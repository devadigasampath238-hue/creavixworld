const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {
  signup, verifyOTP, resendOTP, login,
  getMe, updateProfile, forgotPassword, resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { signupValidation, loginValidation } = require('../middleware/validation');

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many requests. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: false,
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP attempts. Wait 10 minutes.' },
  validate: false,
});

router.post('/signup', authLimiter, signupValidation, signup);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// GET /api/auth/admin-id — returns admin ID for chat
router.get('/admin-id', async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('_id name');
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.json({ success: true, adminId: admin._id, adminName: admin.name });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Google OAuth - Start
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
  })
);

// Google OAuth - Callback
router.get('/google/callback',
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login` 
  }),
  async (req, res) => {
    const token = jwt.sign(
      { id: req.user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
  }
);

module.exports = router;