# 🎓 Learnodays

**Learnodays** is a full-stack Learning Management System (LMS) that lets learners browse and enroll in courses, earn certifications, track progress, and compete on a leaderboard — with a full admin console for managing courses, users, enrollments, and reports. Built as a MERN application with real-time updates via Socket.IO.

---

## ✨ Features

### Learner-facing
- Browse and enroll in courses
- In-app course player with quizzes
- Course checkout with Razorpay payments
- Certifications: dedicated catalog, checkout, quiz, and downloadable certificate
- Personal dashboard with enrolled courses ("My Courses") and progress
- Leaderboard and instructor directory
- Real-time notifications (in-app bell + toast alerts)
- Authentication: register, login, OTP verification, forgot/reset password
- User profile management
- Static pages: About, Contact, Help, Privacy, Terms, Cookies

### Admin console
- Central dashboard with platform overview
- Course management (CRUD)
- Student & user management
- Enrollment management
- Instructor management
- Reports & analytics
- Live activity feed via WebSockets (new enrollments, signups, payments)
- PDF/Excel report export

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- React Router DOM v6
- Tailwind CSS
- Socket.IO Client (real-time updates)
- Firebase (authentication support)
- Recharts (analytics charts)
- jsPDF + html2canvas (certificate/report PDF generation)
- ExcelJS / xlsx (report export)
- React Hot Toast

**Backend**
- Node.js + Express 4
- MongoDB with Mongoose
- Socket.IO (real-time notifications & activity feed)
- JWT-based authentication
- Bcrypt.js (password hashing)
- Helmet + express-rate-limit (security hardening)
- Morgan (request logging)
- Nodemailer (emails/OTP)
- Razorpay (course & certification payments)
- node-cron (scheduled jobs)

---

## 📁 Project Structure

```
Learnodays/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/      # Route logic (auth, courses, enrollments, payments, etc.)
│   ├── middleware/       # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express route definitions
│   ├── services/          # Cron jobs
│   ├── utils/              # Email & notification helpers
│   ├── socket.js            # Socket.IO initialization
│   ├── seed.js               # Database seed script
│   └── server.js              # App entry point
│
└── frontend/
    ├── src/
    │   ├── components/    # Shared UI + admin components
    │   ├── context/        # Auth & Socket context providers
    │   ├── data/             # Static course/cert/home data
    │   ├── hooks/             # Custom hooks (notifications, in-view, etc.)
    │   ├── pages/              # Route-level pages (Course, Certification, Dashboard, etc.)
    │   ├── utils/               # API client, thumbnails, time utilities
    │   └── main.jsx
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas (or local MongoDB) instance
- An email account/app password (for Nodemailer)
- A Firebase project (for auth support)

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/learnodays.git
cd learnodays
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=90d
FRONTEND_URL=http://localhost:5173
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
```

Run the backend:
```bash
npm run dev     # development (nodemon)
npm start       # production
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with:
```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

Run the frontend:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`, connecting to the API at `http://localhost:5000`.

---

## 📜 Available Scripts

**Frontend** (`frontend/package.json`)
| Command           | Description                        |
|--------------------|------------------------------------|
| `npm run dev`      | Start the Vite development server  |
| `npm run build`    | Build for production                |
| `npm run preview`  | Preview the production build        |
| `npm run lint`     | Run ESLint                           |

**Backend** (`backend/package.json`)
| Command           | Description                          |
|--------------------|--------------------------------------|
| `npm run dev`      | Start the API with nodemon (auto-reload) |
| `npm start`        | Start the API in production mode     |

---

## 🔌 API Overview

All API routes are prefixed with `/api`:

| Route                | Purpose                              |
|------------------------|--------------------------------------|
| `/api/auth`           | Registration, login, password reset  |
| `/api/otp`             | OTP generation & verification         |
| `/api/user`            | User profile & account data           |
| `/api/course`          | Course catalog & details              |
| `/api/enrollment`      | Course enrollments                    |
| `/api/quiz`            | Course & certification quizzes        |
| `/api/certificate`     | Certificate issuance & verification   |
| `/api/payment`         | Razorpay order creation & verification|
| `/api/review`          | Course reviews                        |
| `/api/notification`    | In-app notifications                  |
| `/api/admin`           | Admin-only operations                 |

---

## 📄 License

This project is proprietary to Learnodays. All rights reserved.