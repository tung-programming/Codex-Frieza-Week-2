// In server/routes/auth.js, keep only ONE Google route and remove the duplicate:

import express from 'express';
import { 
  registerUser, 
  loginUser, 
  googleAuth,  // Make sure this is imported
  forgotPassword, 
  getCurrentUser,
  changePassword 
} from '../controllers/authController.js';
import { protect, rateLimit } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes with rate limiting
router.post('/register', rateLimit(5, 15 * 60 * 1000), registerUser);
router.post('/login', rateLimit(10, 15 * 60 * 1000), loginUser);
router.post('/google', rateLimit(10, 15 * 60 * 1000), googleAuth); // Use the controller method
router.post('/forgot-password', rateLimit(3, 60 * 60 * 1000), forgotPassword);

// Protected routes
router.get('/me', protect, getCurrentUser);
router.put('/change-password', protect, rateLimit(3, 60 * 60 * 1000), changePassword);

// Health check for auth system
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth system is running',
    timestamp: new Date().toISOString()
  });
});

export default router;