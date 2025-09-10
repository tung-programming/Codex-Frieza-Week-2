import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUser = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};

export const loginUser = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};

export const forgotPassword = async (req, res) => {
    res.status(501).json({ message: 'Not Implemented' });
};

export const googleAuth = async (req, res) => {
  console.log('Google Auth Endpoint Hit');
  console.log('Received idToken:', req.body.idToken);
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required'
      });
    }

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch (error) {
      console.error('Google token verification failed:', error);
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

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
    const existingUserResult = await pool.query(existingUserQuery, [email, googleId]);

    let user;

    if (existingUserResult.rows.length > 0) {
      // User exists, update Google ID if not set
      user = existingUserResult.rows[0];

      if (!user.google_id) {
        const updateQuery = 'UPDATE users SET google_id = $1 WHERE id = $2 RETURNING *';
        const updateResult = await pool.query(updateQuery, [googleId, user.id]);
        user = updateResult.rows[0];
      }
    } else {
      // Create new user
      const username = name || email.split('@')[0];
      const insertQuery = `
        INSERT INTO users (username, email, google_id, profile_picture, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING *
      `;
      const insertResult = await pool.query(insertQuery, [username, email, googleId, picture]);
      user = insertResult.rows[0];
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePicture: user.profile_picture,
        token: token
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during Google authentication'
    });
  }
};