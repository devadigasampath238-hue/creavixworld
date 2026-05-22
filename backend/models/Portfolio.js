const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ['E-commerce', 'Dashboard', 'Portfolio', 'Web App', 'Branding', 'Landing Page'],
  },
  description: { type: String, required: true },
  tags: [String],
  color: { type: String, default: '#00d4ff' },
  liveUrl: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);