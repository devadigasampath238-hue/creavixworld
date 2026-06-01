const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
} = require('../utils/email');
const { sendOTPSMS } = require('../utils/sms');

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      avatar: user.avatar,
      createdAt: user.createdAt,
    },
  });
};

// Helper to send OTP via SMS with email fallback
const sendOTP = async (phone, email, name, otp) => {
  // Try SMS first
  if (phone) {
    try {
      await sendOTPSMS(phone, otp);
      console.log(`✅ OTP sent via SMS to ${phone}`);
      return 'sms';
    } catch (smsErr) {
      console.warn('⚠ SMS failed, trying email:', smsErr.message);
    }
  }
  // Fallback to email
  try {
    await sendOTPEmail(email, name, otp);
    console.log(`✅ OTP sent via email to ${email}`);
    return 'email';
  } catch (emailErr) {
    console.warn('⚠ Email not sent (network issue). Using terminal OTP.');
    console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
    return 'terminal';
  }
};

// ─── @route  POST /api/auth/signup ──────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ success: false, message: 'Email already registered.' });
      }
      // Resend OTP for unverified user
      const otp = generateOTP();
      existingUser.otp = otp;
      existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
      if (phone) existingUser.phone = phone;
      await existingUser.save();

      const method = await sendOTP(existingUser.phone, email, existingUser.name, otp);

      return res.status(200).json({
        success: true,
        message: method === 'sms'
          ? 'OTP resent to your mobile number.'
          : 'OTP resent to your email.',
      });
    }

    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    const user = await User.create({
      name,
      email,
      password,
      phone,
      otp,
      otpExpires,
      isVerified: false,
    });

    const method = await sendOTP(phone, email, name, otp);

    res.status(201).json({
      success: true,
      message: method === 'sms'
        ? 'Account created. Please verify with the OTP sent to your mobile.'
        : 'Account created. Please verify your email with the OTP sent.',
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, message: 'Server error during signup.' });
  }
};
const { name, email, password, phone, adminCode } = req.body

// Check if admin code provided
const role = adminCode && adminCode === process.env.ADMIN_SECRET_CODE 
  ? 'admin' 
  : 'user'

const user = await User.create({
  name,
  email,
  password,
  phone,
  role,        // ✅ admin or user
  otp,
  otpExpires,
  isVerified: false,
})
// ─── @route  POST /api/auth/verify-otp ──────────────────────────────────────
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified.' });
    }

    console.log('DB OTP:', user.otp, '| Submitted OTP:', otp);
    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    try {
      await sendWelcomeEmail(email, user.name);
    } catch (emailErr) {
      console.warn('Welcome email not sent:', emailErr.message);
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('VerifyOTP error:', err);
    res.status(500).json({ success: false, message: 'Server error during OTP verification.' });
  }
};

// ─── @route  POST /api/auth/resend-otp ──────────────────────────────────────
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified.' });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const method = await sendOTP(user.phone, email, user.name, otp);

    res.status(200).json({
      success: true,
      message: method === 'sms'
        ? 'New OTP sent to your mobile number.'
        : 'New OTP sent to your email.',
    });
  } catch (err) {
    console.error('ResendOTP error:', err);
    res.status(500).json({ success: false, message: 'Server error during OTP resend.' });
  }
};

// ─── @route  POST /api/auth/login ───────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your account before logging in.',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// ─── @route  GET /api/auth/me ────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── @route  PUT /api/auth/profile ──────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, avatar },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        phone: updatedUser.phone,
      },
    });
  } catch (err) {
    console.error('UpdateProfile error:', err);
    res.status(500).json({ success: false, message: 'Server error during profile update.' });
  }
};

// ─── @route  POST /api/auth/forgot-password ─────────────────────────────────
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(email, user.name, resetUrl);
    } catch (emailErr) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(500).json({ success: false, message: 'Failed to send reset email. Try again.' });
    }

    res.status(200).json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (err) {
    console.error('ForgotPassword error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ─── @route  POST /api/auth/reset-password ──────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('ResetPassword error:', err);
    res.status(500).json({ success: false, message: 'Server error during password reset.' });
  }
};

module.exports = {
  signup,
  verifyOTP,
  resendOTP,
  login,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};