import express from 'express';
import {
  createChat,
  sendMessage,
  getMyChats,
  getChatMessages,
} from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';
import {
  validateCreateChat,
  validateSendMessage,
  validateChatIdParams,
} from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticateToken, validateCreateChat, createChat);
router.post('/message', authenticateToken, validateSendMessage, sendMessage);
router.get('/', authenticateToken, getMyChats);
router.get(
  '/:chatId',
  authenticateToken,
  validateChatIdParams,
  getChatMessages
);

export default router;
