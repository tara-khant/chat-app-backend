// src/services/userService.js

import User from '../models/User.js';

// Get all users
export const getAllUsersService = async (userId) => {
  try {
    const users = await User.find({ _id: { $ne: userId } }, '-password');
    return users;
  } catch (error) {
    throw error;
  }
};

// Get user by ID
export const getUserByIdService = async (id) => {
  try {
    const user = await User.findOne({ _id: id }, '-password');
    return user;
  } catch (error) {
    throw error;
  }
};
