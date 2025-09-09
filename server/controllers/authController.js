import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { OAuth2Client } from 'google-auth-library';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ message: 'Google ID token is required' });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Email not provided by Google' });
    }

    // Check if user already exists
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    let user;
    if (existingUser.rows.length > 0) {
      // User exists, log them in
      user = existingUser.rows[0];
    } else {
      // Create new user
      const username = name || email.split('@')[0]; // Use name from Google or email prefix
      
      const newUserQuery = 'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING id, username, email';
      const { rows } = await db.query(newUserQuery, [username, email, googleId]);
      user = rows[0];

      // Assign default 'Visitor' role
      const visitorRole = await db.query("SELECT id FROM roles WHERE name = 'Visitor'");
      if (visitorRole.rows.length > 0) {
        await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [user.id, visitorRole.rows[0].id]);
      }
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const newUserQuery = 'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email';
    const { rows } = await db.query(newUserQuery, [username, email, password_hash]);
    const newUser = rows[0];

    // Assign default 'Visitor' role
    const visitorRole = await db.query("SELECT id FROM roles WHERE name = 'Visitor'");
    await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [newUser.id, visitorRole.rows[0].id]);

    res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token: generateToken(newUser.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user by email
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
// @desc    Send password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    // Check if user exists
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (rows.length === 0) {
      // Don't reveal if email exists or not for security
      return res.json({ message: 'If this email exists, a reset link has been sent' });
    }

    // TODO: Generate reset token and send email
    // For now, just return success
    console.log(`Password reset requested for: ${email}`);
    
    res.json({ message: 'If this email exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};