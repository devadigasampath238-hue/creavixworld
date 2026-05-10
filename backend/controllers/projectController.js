const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/response');
const { sendProjectConfirmation } = require('../utils/email');

// POST /api/projects — Submit project request
const createProject = async (req, res) => {
  try {
    const {
      name, email, phone, businessName, projectType,
      budget, deadline, description, additionalNotes,
    } = req.body;

    const files = req.files?.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path,
    })) || [];

    const project = await Project.create({
      userId: req.user._id,
      name, email, phone, businessName, projectType,
      budget, deadline: deadline ? new Date(deadline) : null,
      description, additionalNotes, files,
    });

    // Notification
    await Notification.create({
      userId: req.user._id,
      type: 'project_update',
      title: 'Project Request Submitted',
      message: `Your project request for "${businessName}" has been submitted successfully. We'll review it shortly.`,
      projectId: project._id,
    });

    // Confirmation email (non-blocking)
    try { await sendProjectConfirmation(email, name, project); } catch (e) {}

    return sendSuccess(res, { project }, 'Project request submitted successfully!', 201);
  } catch (err) {
    return sendError(res, err.message || 'Submission failed', 500);
  }
};

// GET /api/projects/my — Get user's own projects
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, { projects });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, userId: req.user._id });
    if (!project) return sendError(res, 'Project not found', 404);
    return sendSuccess(res, { project });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { createProject, getMyProjects, getProject };
