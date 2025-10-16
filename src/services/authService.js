import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { AUTH_CONFIG } from '../config/constants.js';
import { generateToken } from '../utils/auth.js';

export const signupService = async ({ username, password }) => {
  const existingUser = await User.findOne({ username });

  if (existingUser) return { error: 'USER_EXISTS' };

  const hashedPassword = await bcrypt.hash(
    password,
    AUTH_CONFIG.BCRYPT_SALT_ROUNDS
  );

  const newUser = await User.create({
    username,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id);

  return {
    user: {
      id: newUser._id,
      username: newUser.username,
    },
    token,
  };
};

export const loginService = async ({ username, password }) => {
  const user = await User.findOne({ username });
  if (!user) return { error: 'USER_NOT_FOUND' };

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return { error: 'INVALID_CREDENTIALS' };

  const token = generateToken(user._id);

  return {
    user: {
      id: user._id,
      username: user.username,
    },
    token,
  };
};
