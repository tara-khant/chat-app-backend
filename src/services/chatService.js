// src/services/chatService.js
import Chat from '../models/Chat.js';
import OpenAI from 'openai';
import { API_CONFIG } from '../config/constants.js';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
  baseURL: API_CONFIG.BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Create a new chat with members
 * @param {Array<String>} members - Array of user IDs
 * @returns {Object} created chat
 */
export const createChatService = async (members) => {
  const chat = await Chat.create({ members, messages: [] });
  return chat;
};

/**
 * Send a message in a chat and get AI response
 * @param {String} chatId
 * @param {String} senderId
 * @param {String} text
 * @returns {Object} updated chat with messages
 */
export const sendMessageService = async ({ chatId, senderId, text }) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error('Chat not found');
  }

  // Save user message
  const userMessage = { sender: senderId, text, createdAt: new Date() };
  chat.messages.push(userMessage);

  // Call OpenAI API
  let botMessageText = '';
  try {
    const aiResponse = await openai.chat.completions.create({
      model: API_CONFIG.OPENAI_MODEL,
      messages: [{ role: API_CONFIG.MESSAGE_ROLES.USER, content: text }],
    });

    botMessageText = aiResponse.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    botMessageText = 'Sorry, I could not process your message.';
  }

  // Save AI message
  const botMessage = {
    sender: null,
    text: botMessageText,
    createdAt: new Date(),
  };
  chat.messages.push(botMessage);

  await chat.save();

  return chat;
};

/**
 * Get all chats of a user
 * @param {String} userId
 * @returns {Array<Object>} chats
 */
export const getChatsByUserService = async (userId) => {
  if (!userId) throw new Error('User ID is required');

  const chats = await Chat.find({ members: userId }).populate(
    'members',
    'username'
  );
  return chats;
};

/**
 * Get messages of a chat
 * @param {String} chatId
 * @returns {Array<Object>} messages
 */
export const getMessagesByChatService = async (chatId) => {
  if (!chatId) throw new Error('Chat ID is required');

  const chat = await Chat.findById(chatId);
  if (!chat) throw new Error('Chat not found');

  return chat.messages;
};
