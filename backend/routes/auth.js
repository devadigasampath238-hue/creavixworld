const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

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
  validate: false, // ✅ Add this
});

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many OTP attempts. Wait 10 minutes.' },
  validate: false, // ✅ Add this
});

router.post('/signup', authLimiter, signupValidation, signup);
router.post('/verify-otp', otpLimiter, verifyOTP);
router.post('/resend-otp', otpLimiter, resendOTP);
router.post('/login', authLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

module.exports = router;
