// src/middleware/validation.js
import { z } from 'zod';
import { HTTP_STATUS } from '../config/constants.js';
import { sendError } from '../utils/response.js';
import { signupSchema, loginSchema } from '../schema/authSchema.js';
import {
  chatIdParamSchema,
  createChatSchema,
  sendMessageSchema,
} from '../schema/chatSchema.js';

/**
 * Generic middleware to validate request data using a Zod schema
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {'body'|'params'|'query'} source - Source of data to validate
 */
export const validateSchema = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const data = req[source];
      const validatedData = schema.parse(data);
      // Replace original data with validated/transformed data
      req[source] = validatedData;

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return sendError(
          res,
          { message: 'Validation failed', errors },
          HTTP_STATUS.BAD_REQUEST
        );
      }

      return sendError(res, 'Validation error', HTTP_STATUS.BAD_REQUEST);
    }
  };
};

/**
 * Helpers to validate specific sources
 */
export const validateBody = (schema) => validateSchema(schema, 'body');
export const validateParams = (schema) => validateSchema(schema, 'params');
export const validateQuery = (schema) => validateSchema(schema, 'query');

/**
 * Legacy field validation middleware (for backward compatibility)
 * @deprecated Use validateSchema with Zod instead
 */
export const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return sendError(
        res,
        `Missing required fields: ${missingFields.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }
    next();
  };
};

/**
 * Auth validation middlewares
 */
export const validateSignup = validateSchema(signupSchema);
export const validateLogin = validateSchema(loginSchema);

/**
 * Chat validation middlewares
 */
export const validateCreateChat = validateSchema(createChatSchema);
export const validateSendMessage = validateSchema(sendMessageSchema);
export const validateChatIdParams = validateParams(chatIdParamSchema);
