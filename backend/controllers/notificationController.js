const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/notifications/my
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    return sendSuccess(res, { notifications });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PUT /api/notifications/:id/read
const markRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    );
    return sendSuccess(res, {}, 'Marked as read');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PUT /api/notifications/read-all
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    return sendSuccess(res, {}, 'All notifications marked as read');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { getMyNotifications, markRead, markAllRead };
