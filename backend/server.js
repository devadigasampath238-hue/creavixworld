require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const jwt = require('jsonwebtoken');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const User = require('./models/User');
const ChatMessage = require('./models/Chat');

// Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');
const portfolioRoutes = require('./routes/portfolio');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
    methods: ['GET', 'POST'],
  },
});

app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: { success: false, message: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(mongoSanitize());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ success: true, message: '🚀 CREAVIX WORLD API is running!', version: '1.0.0', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🚀 CREAVIX WORLD API is running!', timestamp: new Date().toISOString(), environment: process.env.NODE_ENV });
});

app.use(notFound);
app.use(errorHandler);

// ============================
// Socket.io — Real-time Chat
// ============================
// Map: userId -> socketId
const onlineUsers = new Map();

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return next(new Error('User not found'));
    socket.user = user;
    next();
  } catch {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user._id.toString();
  const role = socket.user.role;

  onlineUsers.set(userId, socket.id);
  console.log(`🟢 ${socket.user.name} (${role}) connected`);

  // Join their personal room
  socket.join(userId);

  // Admin joins admin room
  if (role === 'admin') socket.join('admin');

  // Broadcast online status
  io.emit('user_online', { userId, online: true });

  // Send message
  socket.on('send_message', async ({ toUserId, message }) => {
    try {
      if (!message?.trim()) return;

      // conversationId is always: userId_adminId (sorted so it's consistent)
      const adminId = role === 'admin' ? userId : toUserId;
      const regularUserId = role === 'user' ? userId : toUserId;
      const conversationId = `${regularUserId}_${adminId}`;

      const msg = await ChatMessage.create({
        conversationId,
        senderId: socket.user._id,
        senderRole: role,
        message: message.trim(),
      });

      const populated = await msg.populate('senderId', 'name avatar role');

      // Send to recipient
      io.to(toUserId).emit('new_message', populated);
      // Send back to sender (confirmation)
      socket.emit('new_message', populated);
    } catch (err) {
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Mark messages as read
  socket.on('mark_read', async ({ conversationId }) => {
    try {
      await ChatMessage.updateMany(
        { conversationId, senderId: { $ne: socket.user._id }, read: false },
        { read: true }
      );
      socket.emit('messages_read', { conversationId });
    } catch {}
  });

  // Typing indicator
  socket.on('typing', ({ toUserId, isTyping }) => {
    io.to(toUserId).emit('user_typing', { fromUserId: userId, isTyping });
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    io.emit('user_online', { userId, online: false });
    console.log(`🔴 ${socket.user.name} disconnected`);
  });
});

// Make io accessible in routes
app.set('io', io);

// ============================
// Start Server
// ============================
async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`\n╔══════════════════════════════════════╗`);
      console.log(`║     CREAVIX WORLD API SERVER         ║`);
      console.log(`╠══════════════════════════════════════╣`);
      console.log(`║  🚀 Running on port: ${PORT}             ║`);
      console.log(`║  🌍 Environment: ${process.env.NODE_ENV}         ║`);
      console.log(`╚══════════════════════════════════════╝\n`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} busy`);
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