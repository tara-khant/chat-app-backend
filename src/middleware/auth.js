import jwt from 'jsonwebtoken';
import { HTTP_STATUS } from '../config/constants.js';
import { extractToken } from '../utils/auth.js';
import { sendError } from '../utils/response.js';

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = extractToken(authHeader);
  console.log(token);
  if (!token) {
    return sendError(res, 'Access token required', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.userId = decoded.id;
    next();
  } catch {
    return sendError(res, 'Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = extractToken(authHeader);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch {}
  }

  next();
};
