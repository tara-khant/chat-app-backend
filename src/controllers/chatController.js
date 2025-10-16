// src/controllers/chatController.js

import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { sendResponse, handleError } from '../utils/response.js';
import {
  createChatService,
  sendMessageService,
  getChatsByUserService,
  getMessagesByChatService,
} from '../services/chatService.js';

// Create a new chat
export const createChat = async (req, res) => {
  try {
    const { members, name } = req.body;
    const userId = req.userId;
    const chat = await createChatService(members, name, userId);
    sendResponse(res, HTTP_STATUS.CREATED, chat);
  } catch (error) {
    handleError(res, error, ERROR_MESSAGES.FAILED_CREATE_CHAT, 'Chat Create');
  }
};

// Send a message in a chat
export const sendMessage = async (req, res) => {
  try {
    const { chatId, senderId, text } = req.body;
    const io = req.app.get('io');
    const result = await sendMessageService({ chatId, senderId, text, io });

    sendResponse(res, HTTP_STATUS.OK, result);
  } catch (error) {
    handleError(
      res,
      error,
      ERROR_MESSAGES.FAILED_SEND_MESSAGE,
      'Chat SendMessage'
    );
  }
};

// Get all chats for a user
export const getMyChats = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return sendResponse(res, HTTP_STATUS.UNAUTHORIZED, {
        message: 'User not authenticated',
      });
    }

    const chats = await getChatsByUserService(userId);
    sendResponse(res, HTTP_STATUS.OK, chats);
  } catch (error) {
    handleError(res, error, ERROR_MESSAGES.FAILED_FETCH_CHATS, 'Get Chats');
  }
};

// Get messages of a chat
export const getChatMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await getMessagesByChatService(chatId);
    sendResponse(res, HTTP_STATUS.OK, messages);
  } catch (error) {
    handleError(
      res,
      error,
      ERROR_MESSAGES.FAILED_FETCH_MESSAGES,
      'Get Chat Messages'
    );
  }
};
