import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Helper function to send standardized API responses
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {Object} data - Response data
 */
export const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data);
};

/**
 * Helper function to handle errors consistently
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} defaultMessage - Default error message
 * @param {string} context - Context where error occurred (for logging)
 */
export const handleError = (
  res,
  error,
  defaultMessage = ERROR_MESSAGES.SOMETHING_WENT_WRONG,
  context = 'Unknown'
) => {
  console.error(`${context} Error:`, error);
  sendResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, {
    error: error.message || defaultMessage,
  });
};

/**
 * Helper function to send success responses
 * @param {Object} res - Express response object
 * @param {Object} data - Success data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const sendSuccess = (res, data, statusCode = HTTP_STATUS.OK) => {
  sendResponse(res, statusCode, data);
};

/**
 * Helper function to send error responses
 * @param {Object} res - Express response object
 * @param {string|Object} message - Error message or error object
 * @param {number} statusCode - HTTP status code (default: 400)
 */
export const sendError = (
  res,
  message,
  statusCode = HTTP_STATUS.BAD_REQUEST
) => {
  const errorData = typeof message === 'string' ? { message } : message;
  sendResponse(res, statusCode, errorData);
};
