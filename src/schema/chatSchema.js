import { z } from 'zod';

export const createChatSchema = z.object({
  members: z.array(z.string().nonempty()).default([]),
  name: z
    .string()
    .min(3, { message: 'Chat name must be at least 3 characters' })
    .max(50, { message: 'Chat name must be at most 50 characters' })
    .nullable()
    .optional(),
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
