const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  projectType: {
    type: String,
    required: true,
    enum: [
      'Business Website',
      'Portfolio Website',
      'E-commerce Store',
      'Admin Dashboard',
      'Custom Web App',
      'UI/UX Design',
      'Branding',
      'Landing Page',
      'Other',
    ],
  },
  budget: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
  },
  description: {
    type: String,
    required: true,
    minlength: [30, 'Description must be at least 30 characters'],
  },
  additionalNotes: {
    type: String,
    default: '',
  },
  files: [
    {
      filename: String,
      originalName: String,
      mimetype: String,
      size: Number,
      path: String,
    },
  ],
  status: {
    type: String,
    enum: ['pending', 'under_review', 'in_progress', 'completed', 'delivered'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: null,
  },
  currency: {
    type: String,
    default: 'USD',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Project', projectSchema);
