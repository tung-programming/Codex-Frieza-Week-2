import express from 'express';
import { 
  registerUser, 
  loginUser, 
  googleAuth, 
  forgotPassword, 
  getCurrentUser,
  changePassword 
} from '../controllers/authController.js';
import { protect, rateLimit } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', rateLimit(5, 15 * 60 * 1000), registerUser); // 5 attempts per 15 minutes
router.post('/login', rateLimit(10, 15 * 60 * 1000), loginUser); // 10 attempts per 15 minutes
router.post('/google', rateLimit(10, 15 * 60 * 1000), googleAuth); // 10 attempts per 15 minutes
router.post('/forgot-password', rateLimit(3, 60 * 60 * 1000), forgotPassword); // 3 attempts per hour

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, rateLimit(3, 60 * 60 * 1000), changePassword); // 3 attempts per hour

// Health check for auth system
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth system is running',
    timestamp: new Date().toISOString()
  });
});

export default router;