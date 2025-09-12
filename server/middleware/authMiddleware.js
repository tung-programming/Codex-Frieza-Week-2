import jwt from 'jsonwebtoken';
import db from '../config/db.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, no token provided' 
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token (fresh from database)
      const query = 'SELECT id, username, email, role, profile_picture, created_at FROM users WHERE id = $1';
      const { rows } = await db.query(query, [decoded.id]);
      
      if (rows.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, user not found' 
        });
      }

      // Attach user to request
      req.user = rows[0];
      next();

    } catch (error) {
      console.error('Auth middleware error:', error);
      
      // Handle different JWT errors
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, invalid token' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, token expired' 
        });
      } else {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authorized, token verification failed' 
        });
      }
    }
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authorized, no token provided' 
    });
  }
};

// Optional auth - adds user to req if token exists, but doesn't require it
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (token && token !== 'null' && token !== 'undefined') {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from database
        const query = 'SELECT id, username, email, role, profile_picture, created_at FROM users WHERE id = $1';
        const { rows } = await db.query(query, [decoded.id]);
        
        if (rows.length > 0) {
          req.user = rows[0];
        }
      }
    } catch (error) {
      // Silently fail for optional auth - just log the warning
      console.warn('Optional auth failed:', error.message);
    }
  }
  
  next();
};

// Role-based access control middleware
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}` 
      });
    }

    next();
  };
};

// Admin only access
export const adminOnly = requireRole('Admin');

// Editor or Admin access
export const editorOrAdmin = requireRole('Editor', 'Admin');

// Visitor or higher access (basically any authenticated user)
export const visitorOrHigher = requireRole('Visitor', 'Editor', 'Admin');

// Check if user owns resource or is admin
export const ownerOrAdmin = (getResourceOwnerId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }

      // Admin can access everything
      if (req.user.role === 'Admin') {
        return next();
      }

      // Get the owner ID of the resource
      const ownerId = await getResourceOwnerId(req);
      
      if (!ownerId) {
        return res.status(404).json({ 
          success: false, 
          message: 'Resource not found' 
        });
      }

      // Check if user owns the resource
      if (req.user.id === ownerId) {
        return next();
      }

      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. You can only access your own resources.' 
      });

    } catch (error) {
      console.error('Owner/Admin check error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Server error during authorization' 
      });
    }
  };
};

// Rate limiting middleware (basic implementation)
const requestCounts = new Map();

export const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requestCounts.has(key)) {
      const requests = requestCounts.get(key).filter(time => time > windowStart);
      requestCounts.set(key, requests);
    } else {
      requestCounts.set(key, []);
    }

    const currentRequests = requestCounts.get(key);

    if (currentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later'
      });
    }

    // Add current request
    currentRequests.push(now);
    requestCounts.set(key, currentRequests);

    next();
  };
};