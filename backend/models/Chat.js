const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const ChatMessage = require('../models/Chat');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/chat/history/:userId — get chat history between admin and user
router.get('/history/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const me = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    const regularUserId = isAdmin ? userId : me;
    const adminUser = await User.findOne({ role: 'admin' });
    const adminId = adminUser._id.toString();
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

// GET /api/chat/conversations — admin gets all conversations
router.get('/conversations', protect, adminOnly, async (req, res) => {
  try {
    // Get latest message per conversation
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' }, unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$senderRole', 'user'] }, { $eq: ['$read', false] }] }, 1, 0] } } } },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ]);

    // Populate user info
    const populated = await Promise.all(conversations.map(async (conv) => {
      const userId = conv._id.split('_')[0];
      const user = await User.findById(userId).select('name email avatar');
      return { ...conv, user };
    }));

    return sendSuccess(res, { conversations: populated });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
});

module.exports = router;