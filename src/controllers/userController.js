import {
  getAllUsersService,
  getUserByIdService,
} from '../services/userService.js';
import { HTTP_STATUS, ERROR_MESSAGES } from '../config/constants.js';
import { handleError, sendResponse } from '../utils/response.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    return sendResponse(res, HTTP_STATUS.OK, users);
  } catch (error) {
    return handleError(
      res,
      error,
      ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      'Get All Users'
    );
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserByIdService(id);

    if (!user) {
      return sendResponse(res, HTTP_STATUS.NOT_FOUND, {
        message: ERROR_MESSAGES.USER_NOT_FOUND,
      });
    }

    return sendResponse(res, HTTP_STATUS.OK, user);
  } catch (error) {
    return handleError(
      res,
      error,
      ERROR_MESSAGES.SOMETHING_WENT_WRONG,
      'Get User By ID'
    );
  }
};
