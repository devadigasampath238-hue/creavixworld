const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },  
});

// Anti-spam headers applied to every email
const getBaseHeaders = (to, subject) => ({
  'X-Mailer': 'CREAVIX WORLD Mailer',
  'X-Priority': '1',
  'Importance': 'High',
  'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
  'Reply-To': process.env.EMAIL_USER,
  'Message-ID': `<${Date.now()}.${Math.random().toString(36).slice(2)}@creavixworld.com>`,
});

const baseTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CREAVIX WORLD</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:wght@300;400;600&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #030508; font-family: 'Exo 2', Arial, sans-serif; color: #e2e8f0; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 20px; }
    .card {
      background: linear-gradient(135deg, #0d1321 0%, #070b12 100%);
      border: 1px solid rgba(0,212,255,0.2);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 0 40px rgba(0,212,255,0.08);
    }
    .header {
      background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(157,78,221,0.1));
      padding: 32px 40px;
      text-align: center;
      border-bottom: 1px solid rgba(0,212,255,0.15);
    }
    .logo { font-family: 'Orbitron', monospace; font-size: 22px; font-weight: 900; color: #fff; letter-spacing: 4px; }
    .logo span { color: #00d4ff; }
    .tagline { font-size: 11px; color: rgba(0,212,255,0.6); letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; font-family: 'Orbitron', monospace; }
    .body { padding: 40px; }
    .title { font-family: 'Orbitron', monospace; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 16px; }
    .text { font-size: 15px; color: #94a3b8; line-height: 1.7; margin-bottom: 16px; }
    .highlight { color: #00d4ff; }
    .otp-box {
      background: rgba(0,212,255,0.05);
      border: 1px solid rgba(0,212,255,0.3);
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code { font-family: 'Orbitron', monospace; font-size: 40px; font-weight: 900; color: #00d4ff; letter-spacing: 12px; text-shadow: 0 0 20px rgba(0,212,255,0.5); }
    .otp-hint { font-size: 12px; color: #475569; margin-top: 8px; }
    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #00d4ff, #9d4edd);
      color: #000 !important;
      font-family: 'Orbitron', monospace;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 14px 32px;
      border-radius: 4px;
      text-decoration: none;
      margin: 20px 0;
    }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent); margin: 24px 0; }
    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      font-family: 'Orbitron', monospace;
      letter-spacing: 1px;
      font-weight: 700;
    }
    .footer {
      padding: 24px 40px;
      text-align: center;
      border-top: 1px solid rgba(0,212,255,0.1);
      background: rgba(0,0,0,0.3);
    }
    .footer-text { font-size: 12px; color: #334155; line-height: 1.6; }
    .footer-links a { color: #00d4ff; text-decoration: none; }
    .warning-box {
      background: rgba(255,0,110,0.05);
      border: 1px solid rgba(255,0,110,0.2);
      border-radius: 6px;
      padding: 12px 16px;
      margin-top: 16px;
    }
    .warning-text { font-size: 12px; color: #ff006e; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .info-label { font-size: 12px; color: #475569; }
    .info-value { font-size: 13px; color: #e2e8f0; font-weight: 600; }
    .legitimate-note { font-size: 11px; color: #334155; margin-top: 12px; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo">CREAVIX<span>.</span>WORLD</div>
        <div class="tagline">Building Digital Experiences</div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        <div class="footer-text">
          © ${new Date().getFullYear()} CREAVIX WORLD. All rights reserved.<br/>
          <span class="footer-links">
            <a href="https://www.instagram.com/creavixworld">Instagram</a> &nbsp;•&nbsp;
            <a href="mailto:teamcreavixworld.org@gmail.com">Contact Us</a>
          </span>
          <div class="legitimate-note">
            You received this email because you registered at creavixworld.com.<br/>
            This is a transactional email — not marketing or spam.
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
`;

const sendOTPEmail = async (email, name, otp) => {
  const content = `
    <div class="title">Verify Your Email 🔐</div>
    <p class="text">Hey <span class="highlight">${name}</span>,</p>
    <p class="text">Welcome to CREAVIX WORLD! Use the 6-digit code below to verify your email address. This code expires in 10 minutes.</p>
    <div class="otp-box">
      <div class="otp-code">${otp}</div>
      <div class="otp-hint">⏱ Expires in 10 minutes</div>
    </div>
    <div class="warning-box">
      <p class="warning-text">⚠ Never share this code. CREAVIX WORLD will never ask for your OTP via phone or chat.</p>
    </div>
    <p class="text" style="font-size:13px; color:#475569; margin-top:12px;">If you did not create an account, you can safely ignore this email.</p>
  `;
  await transporter.sendMail({
    from: `"CREAVIX WORLD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} is your CREAVIX WORLD verification code`,
    html: baseTemplate(content),
    text: `Your CREAVIX WORLD verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email.\n\nCREAVIX WORLD Team`,
    headers: getBaseHeaders(email, 'Verification Code'),
  });
};

const sendWelcomeEmail = async (email, name) => {
  const content = `
    <div class="title">Welcome to CREAVIX WORLD! 🚀</div>
    <p class="text">Hey <span class="highlight">${name}</span>,</p>
    <p class="text">Your account has been verified and is ready to use. You are now part of an elite network of clients building the future of their digital presence.</p>
    <div class="divider"></div>
    <p class="text">Here is what you can do next:</p>
    <p class="text">• 📋 <strong>Submit a project request</strong> — Tell us your vision<br/>• 📊 <strong>Track your projects</strong> — Real-time status updates<br/>• 🔔 <strong>Get notifications</strong> — Stay in the loop</p>
    <div style="text-align:center;">
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Go to Dashboard</a>
    </div>
  `;
  await transporter.sendMail({
    from: `"CREAVIX WORLD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Welcome to CREAVIX WORLD, ${name}!`,
    html: baseTemplate(content),
    text: `Welcome to CREAVIX WORLD, ${name}!\n\nYour account is verified. Login at: ${process.env.FRONTEND_URL}/login\n\nCREAVIX WORLD Team`,
    headers: getBaseHeaders(email, 'Welcome'),
  });
};

const sendProjectConfirmation = async (email, name, project) => {
  const content = `
    <div class="title">Project Request Received ✅</div>
    <p class="text">Hey <span class="highlight">${name}</span>,</p>
    <p class="text">We have received your project request. Our team will review it and get back to you within 24 to 48 hours.</p>
    <div class="divider"></div>
    <div class="otp-box" style="text-align:left; padding:20px;">
      <div class="info-row"><span class="info-label">Business</span><span class="info-value">${project.businessName}</span></div>
      <div class="info-row"><span class="info-label">Project Type</span><span class="info-value">${project.projectType}</span></div>
      <div class="info-row"><span class="info-label">Budget</span><span class="info-value">${project.budget}</span></div>
      <div class="info-row"><span class="info-label">Status</span><span class="info-value" style="color:#00d4ff;">Pending Review</span></div>
    </div>
    <div style="text-align:center; margin-top:24px;">
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">Track Your Project</a>
    </div>
  `;
  await transporter.sendMail({
    from: `"CREAVIX WORLD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Project request received — ${project.businessName}`,
    html: baseTemplate(content),
    text: `Hi ${name},\n\nYour project request for "${project.businessName}" has been received.\nType: ${project.projectType}\nBudget: ${project.budget}\n\nTrack it at: ${process.env.FRONTEND_URL}/dashboard\n\nCREAVIX WORLD Team`,
    headers: getBaseHeaders(email, 'Project Confirmation'),
  });
};

const statusColors = {
  pending: { color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  under_review: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  in_progress: { color: '#9d4edd', bg: 'rgba(157,78,221,0.15)' },
  completed: { color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  delivered: { color: '#00d4ff', bg: 'rgba(0,212,255,0.15)' },
};

const sendStatusUpdateEmail = async (email, name, project, status, adminNote) => {
  const statusLabels = {
    pending: 'Pending', under_review: 'Under Review', in_progress: 'In Progress',
    completed: 'Completed', delivered: 'Delivered'
  };
  const sc = statusColors[status] || statusColors.pending;
  const content = `
    <div class="title">Project Status Update 📡</div>
    <p class="text">Hey <span class="highlight">${name}</span>,</p>
    <p class="text">Your project <strong>${project.businessName}</strong> has a new status update.</p>
    <div class="otp-box" style="text-align:center;">
      <p style="font-size:12px; color:#475569; margin-bottom:8px; font-family:monospace; letter-spacing:2px;">NEW STATUS</p>
      <span class="status-badge" style="background:${sc.bg}; color:${sc.color}; border:1px solid ${sc.color};">${statusLabels[status] || status}</span>
    </div>
    ${adminNote ? `<div class="warning-box" style="border-color:rgba(0,212,255,0.3); background:rgba(0,212,255,0.05);"><p style="color:#00d4ff; font-size:13px;">Message from our team: <em>"${adminNote}"</em></p></div>` : ''}
    <div style="text-align:center; margin-top:24px;">
      <a href="${process.env.FRONTEND_URL}/dashboard" class="btn">View Dashboard</a>
    </div>
  `;
  await transporter.sendMail({
    from: `"CREAVIX WORLD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Your project status: ${statusLabels[status]} — CREAVIX WORLD`,
    html: baseTemplate(content),
    text: `Hi ${name},\n\nYour project "${project.businessName}" status: ${statusLabels[status]}\n\n${adminNote ? `Team note: ${adminNote}\n\n` : ''}View at: ${process.env.FRONTEND_URL}/dashboard\n\nCREAVIX WORLD Team`,
    headers: getBaseHeaders(email, 'Status Update'),
  });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const content = `
    <div class="title">Reset Your Password 🔑</div>
    <p class="text">Hey <span class="highlight">${name}</span>,</p>
    <p class="text">We received a password reset request for your CREAVIX WORLD account. Click below to set a new password.</p>
    <div style="text-align:center; margin:24px 0;">
      <a href="${resetUrl}" class="btn">Reset My Password</a>
    </div>
    <p class="text" style="font-size:13px; color:#475569;">This link expires in <strong style="color:#ff006e;">1 hour</strong>.</p>
    <div class="warning-box">
      <p class="warning-text">⚠ If you did not request a password reset, ignore this email. Your account remains secure.</p>
    </div>
  `;
  await transporter.sendMail({
    from: `"CREAVIX WORLD" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Reset your CREAVIX WORLD password`,
    html: baseTemplate(content),
    text: `Hi ${name},\n\nReset your CREAVIX WORLD password here:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\nCREAVIX WORLD Team`,
    headers: getBaseHeaders(email, 'Password Reset'),
  });
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
  sendProjectConfirmation,
  sendStatusUpdateEmail,
  sendPasswordResetEmail,
};
