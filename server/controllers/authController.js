import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../config/db.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields (username, email, password)' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address' 
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Username validation
    if (username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username must be at least 3 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2', 
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or username' 
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user - default role is 'Editor'
    const insertQuery = `
      INSERT INTO users (username, email, password_hash, role, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING id, username, email, role, created_at
    `;
    const newUser = await db.query(insertQuery, [username, email, hashedPassword, 'Editor']);
    const user = newUser.rows[0];

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle database constraint errors
    if (error.code === '23505') { // unique_violation
      if (error.constraint?.includes('email')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email already registered' 
        });
      } else if (error.constraint?.includes('username')) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already taken' 
        });
      }
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const userResult = await db.query(userQuery, [email]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    const user = userResult.rows[0];

    // Check if user registered with Google OAuth (no password)
    if (!user.password_hash) {
      return res.status(401).json({ 
        success: false, 
        message: 'This account was registered with Google. Please use Google Sign-In.' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login (optional)
    await db.query('UPDATE users SET updated_at = NOW() WHERE id = $1', [user.id]);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    // User is already attached by auth middleware
    const user = req.user;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture,
        createdAt: user.created_at
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
// In authController.js, update the googleAuth function:

export const googleAuth = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Google authorization code is required'
      });
    }

    // Set up OAuth2Client
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'postmessage' // Important for auth-code flow
    );

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;

    // Verify the ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not provided by Google'
      });
    }

    // Check if user already exists
    const existingUserQuery = 'SELECT * FROM users WHERE email = $1 OR google_id = $2';
    const existingUserResult = await db.query(existingUserQuery, [email, googleId]);

    let user;

    if (existingUserResult.rows.length > 0) {
      // User exists, update Google ID if not set
      user = existingUserResult.rows[0];

      if (!user.google_id) {
        const updateQuery = `
          UPDATE users SET 
            google_id = $1, 
            profile_picture = COALESCE(profile_picture, $2), 
            updated_at = NOW() 
          WHERE id = $3 
          RETURNING *
        `;
        const updateResult = await db.query(updateQuery, [googleId, picture, user.id]);
        user = updateResult.rows[0];
      }
    } else {
      // Create new user
      const username = name || email.split('@')[0];
      const insertQuery = `
        INSERT INTO users (username, email, google_id, profile_picture, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        RETURNING *
      `;
      const insertResult = await db.query(insertQuery, [username, email, googleId, picture, 'Editor']);
      user = insertResult.rows[0];
    }

    // Generate JWT token
    const token = generateToken(user);

    // Return user data with token
    res.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profilePicture: user.profile_picture,
        token: token  // Include token in user object
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
};

// @desc    Forgot password (placeholder for future implementation)
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  res.status(501).json({ 
    success: false, 
    message: 'Password reset feature coming soon. Please contact support if needed.' 
  });
};

// @desc    Change password (bonus feature)
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user's current password hash
    const userResult = await db.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    
    if (userResult.rows.length === 0 || !userResult.rows[0].password_hash) {
      return res.status(400).json({
        success: false,
        message: 'Password change not available for Google accounts'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await db.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', 
      [hashedNewPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};