# 📝 QuickNotes

> A modern, secure, full-stack MERN Notes application with JWT authentication, email-based password recovery, OTP verification, rate limiting, and responsive UI.

🌐 **Live Demo:** https://quick-notes-ckeh.onrender.com

---

## 📌 Overview

QuickNotes is a production-inspired MERN Stack application that enables users to securely create, organize, update, and manage personal notes. The application focuses on authentication, security, clean architecture, and scalability while providing a smooth and responsive user experience.

Unlike a basic CRUD application, QuickNotes incorporates real-world backend practices such as JWT authentication, email verification, OTP-based password recovery, request rate limiting, secure password hashing, and RESTful API design.

---

# ✨ Features

### 🔐 Authentication & Security

- User Registration
- Secure Login
- JWT Authentication
- Protected API Routes
- Password Hashing using bcrypt
- OTP-based Password Reset
- Email Verification via Resend
- Request Rate Limiting using Upstash Redis
- Secure Environment Variable Management

---

### 📝 Notes Management

- Create Notes
- Update Existing Notes
- Delete Notes
- View Personal Notes
- User-specific Data Isolation
- Persistent MongoDB Storage

---

### 🎨 User Experience

- Responsive UI
- Modern Component-based Architecture
- Fast Navigation using React Router
- Beautiful UI built with Tailwind CSS & DaisyUI
- Toast Notifications
- Loading States
- Error Handling

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- DaisyUI
- Axios
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Cloud & Services

- MongoDB Atlas
- Resend Email API
- Upstash Redis
- Render

---

# 🏗 Project Architecture

```
QuickNotes
│
├── frontend
│   ├── components
│   ├── pages
│   ├── lib
│   ├── hooks
│   └── assets
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── config
│   ├── utils
│   └── server.js
│
└── README.md
```

---

# 🔒 Security Highlights

- JWT-based Authentication
- Password Hashing using bcrypt
- Protected Routes Middleware
- OTP Expiration
- Rate Limiting with Redis
- Secure Password Reset Flow
- Environment Variable Protection
- User-specific Database Queries
- Secure API Design

---

# 📷 Application Screens

### Authentication

- Login
- Register
- Forgot Password
- OTP Verification
- Reset Password

### Dashboard

- View Notes
- Create Note
- Edit Note
- Delete Note

---

# 🚀 REST API

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| POST | /api/auth/forgot-password |
| POST | /api/auth/verify-otp |
| POST | /api/auth/reset-password |

---

## Notes

| Method | Endpoint |
|---------|----------|
| GET | /api/notes |
| POST | /api/notes |
| PUT | /api/notes/:id |
| DELETE | /api/notes/:id |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/QuickNotes.git
```

```
cd QuickNotes
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env` file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key

CLIENT_URL=http://localhost:5173
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
```

Create

```env
VITE_API_URL=http://localhost:5000
```

Run

```bash
npm run dev
```

---

# 🌍 Deployment

Frontend and Backend are deployed on Render.

Live Application

https://quick-notes-ckeh.onrender.com

---

# 📈 Future Improvements

- Rich Text Editor
- Markdown Support
- File Attachments
- Search & Filters
- Tags & Categories
- Pin Notes
- Note Sharing
- Dark / Light Theme
- Docker Support
- CI/CD Pipeline
- Unit & Integration Testing

---

# 📚 What I Learned

During this project I gained hands-on experience with:

- Designing RESTful APIs
- JWT Authentication
- Secure Password Handling
- MongoDB Data Modeling
- Express Middleware
- Rate Limiting
- Email Integration
- Full-Stack Deployment
- State Management in React
- Production-ready Folder Structure

---

# 📬 Contact

**Sahasra Peram**

LinkedIn:
https://www.linkedin.com/in/sahasra-peram/

GitHub:
https://github.com/Sahasraperam

Email:
sahasra.peram.77@gmail.com

To check the website:
https://quick-notes-ckeh.onrender.com

---

## ⭐ If you found this project interesting, consider giving it a star!