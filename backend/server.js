require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);
// ============================
// Security Middleware
// ============================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Global rate limit
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { success: false, message: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Sanitize MongoDB queries
app.use(mongoSanitize());

// Logging (development only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ============================
// Static files
// ============================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================
// Root Route
// ============================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 CREAVIX WORLD API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ============================
// API Routes
// ============================
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: '🚀 CREAVIX WORLD API is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ============================
// Error Handling
// ============================
app.use(notFound);
app.use(errorHandler);

// ============================
// Start Server
// ============================
async function startServer() {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`\n╔══════════════════════════════════════╗`);
      console.log(`║     CREAVIX WORLD API SERVER         ║`);
      console.log(`╠══════════════════════════════════════╣`);
      console.log(`║  🚀 Running on port: ${PORT}             ║`);
      console.log(`║  🌍 Environment: ${process.env.NODE_ENV}         ║`);
      console.log(`╚══════════════════════════════════════╝\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} busy — kill it with: netstat -ano | findstr :${PORT}`);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
module.exports = app;