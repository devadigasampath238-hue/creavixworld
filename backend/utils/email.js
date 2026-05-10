const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS } });
const sendBrevoEmail = async ({ to, subject, html }) => { await transporter.sendMail({ from: `CREAVIX WORLD <${process.env.EMAIL_USER}>`, to, subject, html }); };

const sendOTPEmail = async (email, name, otp) => {
  const html = `<div style="font-family:Arial;background:#030508;color:#e2e8f0;padding:40px;border-radius:12px;max-width:600px;margin:auto;border:1px solid rgba(0,212,255,0.2)"><h2 style="color:#00d4ff;font-family:monospace;letter-spacing:4px">CREAVIX.WORLD</h2><h3 style="color:#fff">Verify Your Email ??</h3><p>Hey <strong style="color:#00d4ff">${name}</strong>,</p><p>Your OTP code is:</p><div style="background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.3);border-radius:8px;padding:24px;text-align:center;margin:24px 0"><span style="font-family:monospace;font-size:40px;font-weight:900;color:#00d4ff;letter-spacing:12px">${otp}</span><p style="color:#475569;font-size:12px;margin-top:8px">? Expires in 10 minutes</p></div><p style="color:#ff006e;font-size:12px">? Never share this code. CREAVIX WORLD will never ask for your OTP.</p></div>`;
  await sendBrevoEmail({ to: email, subject: '?? CREAVIX WORLD — Email Verification OTP', html });
};

const sendWelcomeEmail = async (email, name) => {
  const html = `<div style="font-family:Arial;background:#030508;color:#e2e8f0;padding:40px;border-radius:12px;max-width:600px;margin:auto;border:1px solid rgba(0,212,255,0.2)"><h2 style="color:#00d4ff;font-family:monospace;letter-spacing:4px">CREAVIX.WORLD</h2><h3 style="color:#fff">Welcome, ${name}! ??</h3><p>Your account is verified. You are now part of CREAVIX WORLD.</p><a href="${process.env.FRONTEND_URL}/dashboard" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#9d4edd);color:#000;font-weight:700;padding:14px 32px;border-radius:4px;text-decoration:none;margin-top:20px">Go to Dashboard</a></div>`;
  await sendBrevoEmail({ to: email, subject: '?? Welcome to CREAVIX WORLD!', html });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const html = `<div style="font-family:Arial;background:#030508;color:#e2e8f0;padding:40px;border-radius:12px;max-width:600px;margin:auto;border:1px solid rgba(0,212,255,0.2)"><h2 style="color:#00d4ff;font-family:monospace;letter-spacing:4px">CREAVIX.WORLD</h2><h3 style="color:#fff">Reset Your Password ??</h3><p>Hey <strong style="color:#00d4ff">${name}</strong>,</p><p>Click below to reset your password. Link expires in 1 hour.</p><a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d4ff,#9d4edd);color:#000;font-weight:700;padding:14px 32px;border-radius:4px;text-decoration:none;margin-top:20px">Reset Password</a><p style="color:#ff006e;font-size:12px;margin-top:16px">? Never share this link.</p></div>`;
  await sendBrevoEmail({ to: email, subject: '?? Password Reset — CREAVIX WORLD', html });
};

const sendProjectConfirmation = async (email, name, project) => {
  const html = `<div style="font-family:Arial;background:#030508;color:#e2e8f0;padding:40px;border-radius:12px;max-width:600px;margin:auto;border:1px solid rgba(0,212,255,0.2)"><h2 style="color:#00d4ff;font-family:monospace;letter-spacing:4px">CREAVIX.WORLD</h2><h3 style="color:#fff">Project Request Received ?</h3><p>Hey <strong style="color:#00d4ff">${name}</strong>, we received your project request and will respond within 24–48 hours.</p></div>`;
  await sendBrevoEmail({ to: email, subject: '? Project Request Confirmed — CREAVIX WORLD', html });
};

const sendStatusUpdateEmail = async (email, name, project, status, adminNote) => {
  const html = `<div style="font-family:Arial;background:#030508;color:#e2e8f0;padding:40px;border-radius:12px;max-width:600px;margin:auto;border:1px solid rgba(0,212,255,0.2)"><h2 style="color:#00d4ff;font-family:monospace;letter-spacing:4px">CREAVIX.WORLD</h2><h3 style="color:#fff">Project Status Updated ??</h3><p>Hey <strong style="color:#00d4ff">${name}</strong>, your project status is now: <strong style="color:#00d4ff">${status}</strong></p>${adminNote ? `<p>?? Team note: <em>${adminNote}</em></p>` : ''}</div>`;
  await sendBrevoEmail({ to: email, subject: `?? Project Update: ${status} — CREAVIX WORLD`, html });
};

module.exports = { sendOTPEmail, sendWelcomeEmail, sendPasswordResetEmail, sendProjectConfirmation, sendStatusUpdateEmail };


