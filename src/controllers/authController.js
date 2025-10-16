// src/controllers/authController.js

import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { sendResponse, handleError } from '../utils/response.js';
import { signupService, loginService } from '../services/authService.js';

const mapErrorToMessage = {
  USER_EXISTS: ERROR_MESSAGES.USER_EXISTS,
  USER_NOT_FOUND: ERROR_MESSAGES.USER_NOT_FOUND,
  INVALID_CREDENTIALS: ERROR_MESSAGES.INVALID_CREDENTIALS,
};

export const signup = async (req, res) => {
  try {
    const result = await signupService(req.body);

    if (result.error) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        message: mapErrorToMessage[result.error],
      });
    }

    return sendResponse(res, HTTP_STATUS.CREATED, result);
  } catch (error) {
    return handleError(
      res,
      error,
      ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      'Auth Signup'
    );
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    if (result.error) {
      return sendResponse(res, HTTP_STATUS.BAD_REQUEST, {
        message: mapErrorToMessage[result.error],
      });
    }

    return sendResponse(res, HTTP_STATUS.OK, result);
  } catch (error) {
    return handleError(
      res,
      error,
      ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      'Auth Login'
    );
  }
};
