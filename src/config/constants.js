// HTTP Status Codes
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  CREATED: 201,
  OK: 200,
};

// Authentication Constants
export const AUTH_CONFIG = {
  BCRYPT_SALT_ROUNDS: 10,
  JWT_EXPIRES_IN: '1d',
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://openrouter.ai/api/v1',
  OPENAI_MODEL: 'openai/gpt-oss-20b',
  MESSAGE_ROLES: {
    USER: 'user',
    AI: 'assistant',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  FAILED_CREATE_CHAT: 'Failed to create chat',
  FAILED_SEND_MESSAGE: 'Failed to send message',
  CHAT_NOT_FOUND: 'Chat not found',
};

// Server Configuration
export const SERVER_CONFIG = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.FRONTEND_URL || 'http://localhost:3000',
};
