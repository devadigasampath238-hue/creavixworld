const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTPSMS = async (phone, otp) => {
  try {
    await client.messages.create({
      body: `Your CREAVIX WORLD verification code is: ${otp}\n\nExpires in 10 minutes.\nDo not share this code with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    console.log(`✅ SMS sent to ${phone}`);
  } catch (err) {
    console.error('❌ SMS failed:', err.message);
    throw err;
  }
};

module.exports = { sendOTPSMS };