const { body, validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

// Validation result checker
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, errors.array()[0].msg, 400, errors.array());
  }
  next();
};

// Auth validators
const signupValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be 2–50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  validate,
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  validate,
];

const projectValidation = [
  body('name').trim().notEmpty().withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('businessName').trim().notEmpty().withMessage('Business name required'),
  body('projectType').notEmpty().withMessage('Project type required'),
  body('budget').notEmpty().withMessage('Budget required'),
  body('description')
    .trim()
    .isLength({ min: 30 })
    .withMessage('Description must be at least 30 characters'),
  validate,
];

module.exports = { signupValidation, loginValidation, projectValidation, validate };
