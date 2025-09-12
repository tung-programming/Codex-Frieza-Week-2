import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Import routes
import authRoutes from './routes/auth.js';
import imageRoutes from './routes/images.js';
import albumRoutes from './routes/albums.js';

// Import database connection
import db from './config/db.js';

// Configure environment variables
dotenv.config();
const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",     // local dev
      "http://localhost:3000",     // if CRA
      "https://pixelvault.web.app" // deployed frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
const __filename = fileURLToPath(import.meta.url);
// Serve uploads folder as static
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const allowedOrigins = ['http://localhost:5173']; // React dev server


// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Allow embedding images
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// CORS middleware
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL || 'https://your-production-domain.com']
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

// Trust proxy (important for rate limiting and IP detection)
if (NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Create uploads directory if it doesn't exist
import fs from 'fs';
const uploadsDir = path.join(__dirname, 'uploads');
const thumbnailsDir = path.join(uploadsDir, 'thumbnails');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Serve static files (uploaded images)
app.use('/uploads', express.static(uploadsDir, {
  maxAge: NODE_ENV === 'production' ? '7d' : '1h', // Cache images
  etag: true,
  lastModified: true
}));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/albums', albumRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database connection
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
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
      database: {
        connected: false,
        error: error.message
      }
    });
  }
});

// API documentation endpoint (simple)
app.get('/api/docs', (req, res) => {
  res.json({
    success: true,
    message: 'PixelVault API Documentation',
    version: '1.0.0',
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/google': 'Google OAuth login',
        'GET /api/auth/me': 'Get current user (requires auth)',
        'PUT /api/auth/change-password': 'Change password (requires auth)'
      },
      images: {
        'GET /api/images': 'Get images with optional filters',
        'POST /api/images': 'Upload images (requires auth)',
        'GET /api/images/stats': 'Get image statistics',
        'GET /api/images/:id': 'Get single image',
        'PUT /api/images/:id': 'Update image metadata (requires auth)',
        'DELETE /api/images/:id': 'Delete image (requires auth)'
      },
      albums: {
        'GET /api/albums': 'Get all albums',
        'POST /api/albums': 'Create album (requires auth)',
        'GET /api/albums/:id': 'Get single album with images',
        'PUT /api/albums/:id': 'Update album (requires auth)',
        'DELETE /api/albums/:id': 'Delete album (requires auth)'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', {
    error: err.message,
    stack: NODE_ENV === 'development' ? err.stack : undefined,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ 
      success: false, 
      message: 'CORS policy violation',
      error: NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // JWT error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed',
      error: NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // File upload error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ 
      success: false, 
      message: 'File too large' 
    });
  }

  // Database error
  if (err.code && err.code.startsWith('23')) { // PostgreSQL constraint violations
    return res.status(400).json({ 
      success: false, 
      message: 'Database constraint violation',
      error: NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Default error response
  res.status(err.status || 500).json({ 
    success: false, 
    message: NODE_ENV === 'production' ? 'Internal server error' : err.message,
    error: NODE_ENV === 'development' ? err.stack : undefined
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

// Serve frontend in production
if (NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../client/dist');
  
  if (fs.existsSync(frontendPath)) {
    app.use(express.static(frontendPath));
    
    // Handle client-side routing
    app.get('*', (req, res) => {
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  } else {
    app.get('*', (req, res) => {
      res.status(404).json({ 
        success: false, 
        message: 'Frontend not built. Run npm run build first.' 
      });
    });
  }
}

// Test database connection on startup
const testConnection = async () => {
  try {
    const result = await db.query('SELECT NOW() as current_time, version() as postgres_version');
    console.log('✅ Database connected successfully');
    console.log(`📊 PostgreSQL Version: ${result.rows[0].postgres_version.split(' ')[0]}`);
    console.log(`🕐 Database time: ${result.rows[0].current_time}`);
    
    // Test if required tables exist
    const tablesResult = await db.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'images', 'albums')
    `);
    
    const requiredTables = ['users', 'images', 'albums'];
    const existingTables = tablesResult.rows.map(row => row.table_name);
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));
    
    if (missingTables.length > 0) {
      console.log(`⚠️ Missing required tables: ${missingTables.join(', ')}`);
      console.log('Run the database migration script to create missing tables.');
    } else {
      console.log('✅ All required database tables exist');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database configuration in .env file');
    
    if (NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.log('⚠️ Continuing in development mode without database...');
    }
  }
};

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connections
  if (db.end) {
    db.end().catch(err => console.error('Error closing database:', err));
  }
  
  console.log('👋 PixelVault server shut down gracefully');
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled rejection and exception handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't crash the server, but log it
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// Start server
const startServer = async () => {
  try {
    await testConnection();
    
    const server = app.listen(PORT, () => {
      console.log('\n🚀 PixelVault Server Started Successfully!');
      console.log('=====================================');
      console.log(`📱 Environment: ${NODE_ENV}`);
      console.log(`🌐 Server: http://localhost:${PORT}`);
      console.log(`🔧 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api/docs`);
      console.log(`📁 Static Files: ${path.join(__dirname, 'uploads')}`);
      
      console.log('\n🔗 Available API Endpoints:');
      console.log('   Authentication:');
      console.log('   POST /api/auth/register     - Register new user');
      console.log('   POST /api/auth/login        - Login user');
      console.log('   POST /api/auth/google       - Google OAuth login');
      console.log('   GET  /api/auth/me           - Get current user');
      console.log('   PUT  /api/auth/change-password - Change password');
      
      console.log('   Images:');
      console.log('   GET    /api/images          - Get images with filters');
      console.log('   POST   /api/images          - Upload images');
      console.log('   GET    /api/images/stats    - Get image statistics');
      console.log('   GET    /api/images/:id      - Get single image');
      console.log('   PUT    /api/images/:id      - Update image metadata');
      console.log('   DELETE /api/images/:id      - Delete image');
      
      console.log('   Albums:');
      console.log('   GET    /api/albums          - Get all albums');
      console.log('   POST   /api/albums          - Create album');
      console.log('   GET    /api/albums/:id      - Get single album');
      console.log('   PUT    /api/albums/:id      - Update album');
      console.log('   DELETE /api/albums/:id      - Delete album');
      
      console.log('\n🔒 Environment Variables Required:');
      const requiredEnvVars = [
        'DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT',
        'JWT_SECRET', 'GOOGLE_CLIENT_ID'
      ];
      
      requiredEnvVars.forEach(varName => {
        const status = process.env[varName] ? '✅' : '❌';
        console.log(`   ${status} ${varName}`);
      });
      
      console.log('\n🎯 Ready to accept requests!');
    });

    // Set server timeout
    server.timeout = 30000; // 30 seconds
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;