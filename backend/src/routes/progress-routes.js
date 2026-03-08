import express from 'express';
import { getProgress } from '../controllers/progress-controller.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// Optional auth — attach user if token present, otherwise continue
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret-key-change-this');
      const user = await User.findById(decoded.userId);
      if (user) req.user = user;
    }
  } catch (_) {
    // Token invalid — continue without user
  }
  next();
};

router.get('/', optionalAuth, getProgress);

export default router;

