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
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
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

// router.post('/google', async (req, res) => {
//   const { code } = req.body;
//   console.log('--- Google Auth Endpoint Hit ---');
//   console.log('Received code:', code);
//   try {
//     const oAuth2Client = new OAuth2Client(
//       process.env.GOOGLE_CLIENT_ID,
//       process.env.GOOGLE_CLIENT_SECRET,
//       'postmessage', // Important for this flow
//     );

//     // Exchange the code for tokens
//     console.log('Exchanging code for tokens...');
//     const { tokens } = await oAuth2Client.getToken(code);
//     console.log('Google tokens received:', tokens);
//     const idToken = tokens.id_token;

//     // Verify the ID token and get user profile
//     const ticket = await oAuth2Client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     const payload = ticket.getPayload();
//     console.log('User payload from Google:', payload);
//     const { email, name, picture } = payload;

//     // Check if user exists in your database
//     let userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
//     let user = userResult.rows[0];
//     console.log('User from DB:', user);

//     if (!user) {
//       // If user doesn't exist, create a new one
//       const newUserResult = await db.query(
//         'INSERT INTO users (username, email, profile_picture_url, auth_provider) VALUES ($1, $2, $3, $4) RETURNING *',
//         [name, email, picture, 'google']
//       );
//       user = newUserResult.rows[0];
//     }

//     // Create your own JWT for the user
//     const appToken = jwt.sign(
//       { userId: user.id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({
//       success: true,
//       message: 'Google Sign-In successful',
//       token: appToken,
//       user: {
//         id: user.id,
//         username: user.username,
//         email: user.email,
//         role: user.role,
//       },
//     });
//   } catch (error) {
//     console.error('Google Auth Error:', error);
//     console.error('--- GOOGLE AUTH ERROR ---:', error);
//     res.status(401).json({ success: false, message: 'Google authentication failed.' });
//   }
// });
export default router;