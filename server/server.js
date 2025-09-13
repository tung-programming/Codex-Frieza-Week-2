import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import fs from 'fs';

// Import routes
import authRoutes from './routes/auth.js';
import imageRoutes from './routes/images.js';
import albumRoutes from './routes/albums.js';

// Import database connection
import db from './config/db.js';

// Configure environment variables
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve();

const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- Middleware Setup ---

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding images
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:", "https://*.googleusercontent.com"], // Allow Google profile images
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// These headers might be needed for certain OAuth pop-up flows
app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// CORS middleware (Consolidated)
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = NODE_ENV === 'production'
      ? ['https://pixelvault-jpy0.onrender.com'] // Your frontend URL
      : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// Trust proxy (important for rate limiting and IP detection in production)
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// --- Directory and Static File Setup ---

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Serve static files (uploaded images) with caching (Consolidated)
app.use('/uploads', express.static(uploadsDir, {
  maxAge: NODE_ENV === 'production' ? '7d' : '1h', // Cache images for 7 days in prod
  etag: true,
  lastModified: true
}));


// --- API Routes ---

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/albums', albumRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbResult = await db.query('SELECT NOW() as server_time');
    res.json({
      success: true,
      message: 'PixelVault API is running',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: {
        connected: true,
        server_time: dbResult.rows[0].server_time
      },
      version: process.env.npm_package_version || '1.0.0'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      success: false,
      message: 'Service partially unavailable',
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// Simple API documentation endpoint
app.get('/api/docs', (req, res) => {
    // ... (Your documentation JSON)
});


// --- Error Handling and 404 ---

// Generic error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    error: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
  });

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS policy violation' });
  }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Authentication failed' });
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ success: false, message: 'File too large' });
  }
  if (err.code && err.code.startsWith('23')) { // PostgreSQL constraint violations
    return res.status(400).json({ success: false, message: 'Database constraint violation' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    available_endpoints: '/api/docs'
  });
});


// --- Serve Frontend in Production ---

if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');

  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    // Handle client-side routing by sending index.html for any other request
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    console.log('Warning: Frontend build directory not found at', frontendPath);
    app.get('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Frontend not built or not found.'
      });
    });
  }
}

// --- Server Startup Logic ---

const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('✅ Database connected successfully at:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database configuration in .env file');
    if (NODE_ENV === 'production') {
      process.exit(1); // Exit if DB connection fails in production
    }
  }
};

const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log(`\n🚀 Server listening on http://localhost:${PORT}`);
    console.log(`   Environment: ${NODE_ENV}`);
    console.log('   Press Ctrl+C to stop');
  });
};

startServer().catch(err => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🔄 Received ${signal}. Shutting down gracefully...`);
  db.end().then(() => {
    console.log('PostgreSQL pool has been closed.');
    process.exit(0);
  }).catch(err => {
    console.error('Error closing database pool:', err);
    process.exit(1);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

export default app;