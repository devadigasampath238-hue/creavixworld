const User = require('../models/User');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');
const { sendStatusUpdateEmail } = require('../utils/email');

// GET /api/admin/projects
const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = status ? { status } : {};
    const projects = await Project.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Project.countDocuments(filter);
    return sendSuccess(res, { projects, total });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
    return sendSuccess(res, { users });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PUT /api/admin/projects/:id/status
const updateProjectStatus = async (req, res) => {
  try {
    const { status, adminNote, price } = req.body;
    const validStatuses = ['pending', 'under_review', 'in_progress', 'completed', 'delivered'];
    if (!validStatuses.includes(status)) return sendError(res, 'Invalid status', 400);

    const project = await Project.findById(req.params.id).populate('userId', 'name email');
    if (!project) return sendError(res, 'Project not found', 404);

    project.status = status;
    if (adminNote !== undefined) project.adminNote = adminNote;
    if (price !== undefined) project.price = price;
    await project.save();

    // Notify user
    await Notification.create({
      userId: project.userId._id,
      type: 'status_change',
      title: 'Project Status Updated',
      message: `Your project "${project.businessName}" status has been updated to: ${status.replace('_', ' ').toUpperCase()}.`,
      projectId: project._id,
    });

    // Email notification (non-blocking)
    try {
      await sendStatusUpdateEmail(
        project.userId.email,
        project.userId.name,
        project,
        status,
        adminNote
      );
    } catch (e) {}

    return sendSuccess(res, { project }, 'Status updated successfully!');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const update = {};
    if (isActive !== undefined) update.isActive = isActive;
    if (role !== undefined) update.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return sendError(res, 'User not found', 404);
    return sendSuccess(res, { user }, 'User updated');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /api/admin/analytics
const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalProjects, statusCounts] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Project.countDocuments(),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    // Monthly project data (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyProjects = await Project.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    return sendSuccess(res, {
      analytics: { totalUsers, totalProjects, statusCounts, monthlyProjects },
    });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { getAllProjects, getAllUsers, updateProjectStatus, updateUser, getAnalytics };
