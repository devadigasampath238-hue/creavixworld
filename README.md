# 🚀 CREAVIX WORLD — Full Stack Digital Agency Platform

> **Building Digital Experiences** — A premium, futuristic full-stack web application for the CREAVIX WORLD digital agency brand.

---

## 🌟 Project Overview

CREAVIX WORLD is a production-ready full-stack web application featuring:

- **Stunning Cyberpunk UI/UX** — Neon blue/cyan/purple/pink on matte black
- **Complete Authentication** — Signup, login, OTP verification, forgot/reset password
- **User Dashboard** — Project submissions, status tracking, notifications
- **Admin Dashboard** — User & project management, analytics, status updates
- **Email System** — Futuristic HTML email templates for all events
- **Security-first** — JWT, bcrypt, rate limiting, helmet, MongoDB sanitization, XSS protection

---

## 📁 Project Structure

```
creavix-world/
├── frontend/                   # React + Vite + Tailwind + Framer Motion
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # AuthLayout
│   │   │   ├── dashboard/      # DashSidebar
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   ├── sections/       # Hero, Services, Portfolio, Pricing, etc.
│   │   │   └── ui/             # ParticleBackground
│   │   ├── context/            # AuthContext (global auth state)
│   │   ├── pages/              # Home, Login, Signup, Dashboard, Admin...
│   │   ├── App.jsx             # Router + protected routes
│   │   ├── main.jsx
│   │   └── index.css           # Tailwind + global cyberpunk styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                    # Node.js + Express + MongoDB
│   ├── config/
│   │   └── database.js         # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   ├── projectController.js
│   │   ├── notificationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect/adminOnly
│   │   ├── errorHandler.js
│   │   ├── validation.js       # express-validator rules
│   │   └── upload.js           # Multer file handling
│   ├── models/
│   │   ├── User.js
│   │   ├── OTP.js
│   │   ├── Project.js
│   │   ├── Notification.js
│   │   ├── Message.js
│   │   └── Pricing.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── notifications.js
│   │   └── admin.js
│   ├── utils/
│   │   ├── email.js            # Nodemailer + HTML templates
│   │   ├── generateOTP.js
│   │   └── response.js
│   ├── uploads/                # File upload directory
│   ├── server.js               # Express app entry
│   ├── seed.js                 # Admin seeder
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json                # Root convenience scripts
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+
- **MongoDB Atlas** account (free tier works)
- **Gmail** account with App Password enabled

---

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd creavix-world

# Install all dependencies at once
npm run install:all

# OR manually:
cd frontend && npm install
cd ../backend && npm install
```

---

### 2. Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/creavixworld
JWT_SECRET=your_64_char_random_secret_here
JWT_EXPIRES_IN=7d
RESET_TOKEN_SECRET=another_random_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=teamcreavixworld.org@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=CREAVIX WORLD <teamcreavixworld.org@gmail.com>
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@creavixworld.com
ADMIN_PASSWORD=Admin@Creavix2024!
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords → Generate

---

### 3. Configure Frontend Environment

```bash
cd frontend
cp .env.example .env
```

The default `.env` works for local development:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 4. Seed Admin Account

```bash
cd backend
node seed.js
```

This creates the admin user defined in your `.env`.

---

### 5. Run Development Servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

### 6. Open the App

- **Website:** http://localhost:5173
- **API Health:** http://localhost:5000/api/health
- **Admin Login:** Use the credentials from your `.env`

---

## 🔐 Authentication Flow

```
User signs up → OTP sent to email → User enters OTP
→ Account verified → JWT issued → Access dashboard
```

**Password Reset:**
```
User clicks "Forgot Password" → Reset link emailed
→ User opens link → Sets new password → Redirected to login
```

---

## 🛡 Security Features

| Feature | Implementation |
|---|---|
| Password hashing | bcryptjs (12 rounds) |
| Authentication | JWT (7-day expiry) |
| OTP | 6-digit, 10-minute expiry, 5-attempt limit |
| Rate limiting | express-rate-limit on all auth routes |
| Security headers | Helmet.js |
| MongoDB injection | express-mongo-sanitize |
| XSS | Input sanitization via express-validator |
| File upload | Multer with type/size validation |
| CORS | Whitelist-only origins |

---

## 📧 Email Templates

Beautiful futuristic HTML email templates for:
- 🔐 OTP Verification
- 🚀 Welcome Email
- ✅ Project Submission Confirmation
- 📡 Project Status Updates
- 🔑 Password Reset

All templates match the CREAVIX WORLD cyberpunk brand with neon blues, dark backgrounds, and Orbitron typography.

---

## 🗃 MongoDB Schemas

| Model | Fields |
|---|---|
| **User** | name, email, password, phone, role, isVerified, isActive |
| **OTP** | email, otp, expiresAt, attempts |
| **Project** | userId, name, email, phone, businessName, projectType, budget, deadline, description, files, status, adminNote, price |
| **Notification** | userId, type, title, message, projectId, read |
| **Message** | name, email, subject, message, read, replied |
| **Pricing** | name, price, currency, features, isFeatured |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/signup | Create account |
| POST | /api/auth/login | Login |
| POST | /api/auth/verify-otp | Verify OTP |
| POST | /api/auth/resend-otp | Resend OTP |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile |
| POST | /api/auth/forgot-password | Send reset link |
| POST | /api/auth/reset-password | Reset password |

### Projects
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/projects | Submit project |
| GET | /api/projects/my | Get my projects |
| GET | /api/projects/:id | Get project |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/notifications/my | Get my notifications |
| PUT | /api/notifications/read-all | Mark all read |
| PUT | /api/notifications/:id/read | Mark one read |

### Admin (requires admin role)
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/admin/projects | All projects |
| PUT | /api/admin/projects/:id/status | Update status + note |
| GET | /api/admin/users | All users |
| PUT | /api/admin/users/:id | Update user |
| GET | /api/admin/analytics | Dashboard analytics |

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Add all environment variables from `.env`
6. Deploy!

### Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import GitHub repo
3. Set:
   - **Root directory:** `frontend`
   - **Framework:** Vite
4. Add environment variable:
   - `VITE_API_URL` = `https://your-render-backend.onrender.com/api`
5. Deploy!

### MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Add database user
4. Whitelist IP (0.0.0.0/0 for Render)
5. Copy connection string to `MONGODB_URI`

---

## 📱 Responsive Breakpoints

| Device | Breakpoint |
|---|---|
| Mobile | < 640px |
| Tablet | 640px – 1024px |
| Desktop | 1024px – 1280px |
| Ultra-wide | > 1280px |

---

## 🎨 Brand Colors

| Color | Hex |
|---|---|
| Neon Blue | `#00d4ff` |
| Neon Cyan | `#00fff5` |
| Neon Purple | `#9d4edd` |
| Neon Pink | `#ff006e` |
| Neon Violet | `#7b2fff` |
| Background | `#030508` |

---

## 📞 Contact

- **Instagram:** [@creavixworld](https://www.instagram.com/creavixworld)
- **Email:** teamcreavixworld.org@gmail.com

---

> Built with ❤️ by CREAVIX WORLD — *Building Digital Experiences*
