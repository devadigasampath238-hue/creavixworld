const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const ChatMessage = require('../models/Chat');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/chat/history/:userId — get chat history
router.get('/history/:userId', protect, async (req, res) => {
  try {
    const me = req.user._id.toString()
    const isAdmin = req.user.role === 'admin'
    const adminUser = await User.findOne({ role: 'admin' })
    const adminId = adminUser._id.toString()
    const regularUserId = isAdmin ? req.params.userId : me
    const conversationId = `${regularUserId}_${adminId}`

    const messages = await ChatMessage.find({ conversationId })
      .populate('senderId', 'name avatar role')
      .sort({ createdAt: 1 })
      .limit(100)

    return sendSuccess(res, { messages, conversationId })
  } catch (err) {
    return sendError(res, err.message, 500)
  }
})

// POST /api/chat/send — REST fallback when socket disconnected
router.post('/send', protect, async (req, res) => {
  try {
    const { toUserId, message } = req.body
    if (!message?.trim()) return sendError(res, 'Message required', 400)

    const me = req.user._id.toString()
    const role = req.user.role
    const adminUser = await User.findOne({ role: 'admin' })
    const adminId = adminUser._id.toString()
    const regularUserId = role === 'user' ? me : toUserId
    const conversationId = `${regularUserId}_${adminId}`

    const msg = await ChatMessage.create({
      conversationId,
      senderId: req.user._id,
      senderRole: role,
      message: message.trim(),
    })

    const populated = await msg.populate('senderId', 'name avatar role')

    // Emit via socket if available
    const io = req.app.get('io')
    if (io) {
      io.to(toUserId).emit('new_message', populated)
    }

    return sendSuccess(res, { message: populated }, 'Message sent', 201)
  } catch (err) {
    return sendError(res, err.message, 500)
  }
})

// GET /api/chat/conversations — admin gets all conversations
router.get('/conversations', protect, adminOnly, async (req, res) => {
  try {
    const conversations = await ChatMessage.aggregate([
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$conversationId',
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: { $cond: [{ $and: [{ $eq: ['$senderRole', 'user'] }, { $eq: ['$read', false] }] }, 1, 0] }
          }
        }
      },
      { $sort: { 'lastMessage.createdAt': -1 } }
    ])

    const populated = await Promise.all(conversations.map(async (conv) => {
      const userId = conv._id.split('_')[0]
      const user = await User.findById(userId).select('name email avatar')
      return { ...conv, user }
    }))

    return sendSuccess(res, { conversations: populated })
  } catch (err) {
    return sendError(res, err.message, 500)
  }
})

module.exports = router