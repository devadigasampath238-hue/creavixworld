const crypto = require('crypto');

const generateOTP = () => {
  // 6-digit cryptographically secure OTP
  return crypto.randomInt(100000, 999999).toString();
};

const generateToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

module.exports = { generateOTP, generateToken };
