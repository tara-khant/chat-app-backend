// src/config/schema/chatSchema.js
import { z } from 'zod';

export const createChatSchema = z.object({
  members: z
    .array(z.string().nonempty())
    .min(1, { message: 'At least one member is required to create a chat' }),
});

export const sendMessageSchema = z.object({
  chatId: z.string().nonempty({ message: 'chatId is required' }),
  senderId: z.string().nonempty({ message: 'senderId is required' }),
  text: z.string().nonempty({ message: 'Message text is required' }),
});

// Validate chatId param
export const chatIdParamSchema = z.object({
  chatId: z.string().min(1, 'chatId is required'),
});
