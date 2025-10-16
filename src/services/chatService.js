// src/services/chatService.js
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import OpenAI from 'openai';
import { API_CONFIG } from '../config/constants.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

const openai = new OpenAI({
  baseURL: API_CONFIG.BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateChatName = async (lastMessage) => {
  try {
    const prompt = `Generate a concise chat title (3-6 words) from this message: "${lastMessage}"`;

    const completion = await openai.chat.completions.create({
      model: API_CONFIG.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: 'You are an assistant that generates short chat titles.',
        },
        { role: 'user', content: prompt },
      ],
      max_new_tokens: 20,
      temperature: 0.7,
    });

    const title = completion?.choices?.[0]?.message?.content?.trim();
    return title || 'New Chat';
  } catch (err) {
    console.error('Error generating chat title:', err);
    return 'New Chat';
  }
};

/**
 * Create a new chat with members
 * @param {Array<String>} members - Array of user IDs
 * @param {String|null} name - optional chat name (for group chat)
 * @param {String} userId - creator user ID
 * @returns {Object} created chat
 */
export const createChatService = async (members, name = null, userId) => {
  const chat = await Chat.create({
    members,
    name,
    isGroupChat: members.length > 1,
    createdBy: userId,
  });

  return chat;
};

/**
 * Send a message in a chat and get AI response
 * Also generates chat name if first message
 * @param {Object} params
 * @param {String} params.chatId
 * @param {String} params.senderId
 * @param {String} params.text
 * @param {Object} params.io - socket.io instance (optional)
 * @returns {Object} updated chat with populated members and lastMessage
 */
export const sendMessageService = async ({ chatId, senderId, text, io }) => {
  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('Chat not found');

  // Auto-generate chat name if empty (first message)
  // if (!chat.name) {
  chat.name = await generateChatName(text);
  await chat.save();
  // }

  // Save user message
  const userMessage = await Message.create({
    chatId,
    senderId,
    text,
    type: 'user',
  });

  chat.lastMessage = userMessage._id;
  await chat.save();

  // Get AI bot response
  let botMessageText = '';
  try {
    const aiResponse = await openai.chat.completions.create({
      model: API_CONFIG.OPENAI_MODEL,
      messages: [{ role: 'user', content: text }],
    });
    botMessageText = aiResponse.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    botMessageText = 'Sorry, I could not process your message.';
  }

  const botMessage = await Message.create({
    chatId,
    senderId: null,
    text: botMessageText,
    type: 'ai',
  });

  chat.lastMessage = botMessage._id;
  await chat.save();

  // Emit real-time update via WebSocket
  if (io) {
    io.to(chatId).emit('receiveMessage', {
      chatId,
      senderId: null,
      text: botMessageText,
      type: 'ai',
      timestamp: botMessage.createdAt,
      chat,
    });
  }

  // Populate chat before returning
  const populatedChat = await Chat.findById(chat._id)
    .populate('members', 'username')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'username' },
    });

  return populatedChat;
};

/**
 * Get all chats of a user
 */
export const getChatsByUserService = async (userId) => {
  if (!userId) throw new Error('User ID is required');
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const chats = await Chat.find({
    $or: [{ createdBy: userObjectId }, { members: userObjectId }],
  })
    .populate('members', 'username')
    .populate({
      path: 'lastMessage',
      populate: { path: 'senderId', select: 'username' },
    })
    .sort({ updatedAt: -1 });

  return chats;
};

/**
 * Get messages of a chat
 */
export const getMessagesByChatService = async (chatId) => {
  if (!chatId) throw new Error('Chat ID is required');

  const chat = await Chat.findById(chatId).populate('members', 'username');
  if (!chat) throw new Error('Chat not found');

  const messages = await Message.find({ chatId })
    .populate('senderId', 'username')
    .sort({ timestamp: 1 });

  return { ...chat.toObject(), messages };
};
