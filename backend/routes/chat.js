const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const ChatMessage = require('../models/Chat');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/chat/history/:userId
router.get('/history/:userId', protect, async (req, res) => {
  try {
    const me = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const adminUser = await User.findOne({ role: 'admin' });
    const adminId = adminUser._id.toString();
    const regularUserId = isAdmin ? req.params.userId : me;
    const conversationId = `${regularUserId}_${adminId}`;

    const messages = await ChatMessage.find({ conversationId })
      .populate('senderId', 'name avatar role')
      .sort({ createdAt: 1 })
      .limit(100);

    return sendSuccess(res, { messages, conversationId });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// POST /api/chat/send — REST fallback
router.post('/send', protect, async (req, res) => {
  try {
    const { toUserId, message } = req.body;
    if (!message?.trim()) return sendError(res, 'Message required', 400);

    const me = req.user._id.toString();
    const role = req.user.role;
    const adminUser = await User.findOne({ role: 'admin' });
    const adminId = adminUser._id.toString();
    const regularUserId = role === 'user' ? me : toUserId;
    const conversationId = `${regularUserId}_${adminId}`;

    const msg = await ChatMessage.create({
      conversationId,
      senderId: req.user._id,
      senderRole: role,
      message: message.trim(),
    });

    const populated = await msg.populate('senderId', 'name avatar role');

    const io = req.app.get('io');
    if (io) io.to(toUserId).emit('new_message', populated);

    return sendSuccess(res, { message: populated }, 'Message sent', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

// GET /api/chat/conversations — admin only
// Using simple query instead of aggregate to avoid errors
router.get('/conversations', protect, adminOnly, async (req, res) => {
  try {
    // Get all messages grouped by conversationId simply
    const allMessages = await ChatMessage.find()
      .sort({ createdAt: -1 })
      .populate('senderId', 'name email avatar role')
      .limit(500);

    // Group by conversationId manually
    const convMap = {};
    for (const msg of allMessages) {
      if (!convMap[msg.conversationId]) {
        convMap[msg.conversationId] = {
          _id: msg.conversationId,
          lastMessage: msg,
          unreadCount: 0,
          user: null,
        };
      }
      if (msg.senderRole === 'user' && !msg.read) {
        convMap[msg.conversationId].unreadCount++;
      }
    }

    // Populate user info for each conversation
    const conversations = await Promise.all(
      Object.values(convMap).map(async (conv) => {
        const userId = conv._id.split('_')[0];
        const user = await User.findById(userId).select('name email avatar');
        return { ...conv, user };
      })
    );

    // Sort by latest message
    conversations.sort((a, b) =>
      new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
    );

    return sendSuccess(res, { conversations });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

module.exports = router;