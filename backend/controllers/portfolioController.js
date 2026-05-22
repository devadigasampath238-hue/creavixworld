const Portfolio = require('../models/Portfolio');
const { sendSuccess, sendError } = require('../utils/response');

// GET /api/portfolio — public
const getPortfolio = async (req, res) => {
  try {
    const items = await Portfolio.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { items });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// GET /api/admin/portfolio — admin
const getAllPortfolio = async (req, res) => {
  try {
    const items = await Portfolio.find().sort({ order: 1, createdAt: -1 });
    return sendSuccess(res, { items });
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// POST /api/admin/portfolio
const createPortfolio = async (req, res) => {
  try {
    const { title, category, description, tags, color, liveUrl, imageUrl, featured, order } = req.body;
    const item = await Portfolio.create({
      title, category, description,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      color, liveUrl, imageUrl, featured, order,
    });
    return sendSuccess(res, { item }, 'Portfolio item created!', 201);
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// PUT /api/admin/portfolio/:id
const updatePortfolio = async (req, res) => {
  try {
    const { title, category, description, tags, color, liveUrl, imageUrl, featured, order, isActive } = req.body;
    const item = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        title, category, description,
        tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
        color, liveUrl, imageUrl, featured, order, isActive,
      },
      { new: true, runValidators: true }
    );
    if (!item) return sendError(res, 'Item not found', 404);
    return sendSuccess(res, { item }, 'Portfolio item updated!');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

// DELETE /api/admin/portfolio/:id
const deletePortfolio = async (req, res) => {
  try {
    const item = await Portfolio.findByIdAndDelete(req.params.id);
    if (!item) return sendError(res, 'Item not found', 404);
    return sendSuccess(res, {}, 'Portfolio item deleted!');
  } catch (err) {
    return sendError(res, err.message, 500);
  }
};

module.exports = { getPortfolio, getAllPortfolio, createPortfolio, updatePortfolio, deletePortfolio };