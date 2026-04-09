# 🚀 LearnFlow — Full-Stack LMS Platform

> India's premier online learning platform. Built with React 18, Node.js, MongoDB, and Socket.IO for real-time features.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Project](#running-the-project)
- [Demo Credentials](#demo-credentials)
- [API Endpoints](#api-endpoints)
- [Realtime Features](#realtime-features)
- [Deployment](#deployment)

---

## ✨ Features

### 🎓 Student Features
- Browse and search 200+ courses with filters (category, difficulty, price)
- Enroll in free and paid courses
- Track learning progress with a visual dashboard
- Download industry-recognized certificates
- Attend live sessions with instructors
- Leaderboard with points and streaks
- Profile management with social links

### 👨‍🏫 Instructor Features
- Create and manage courses with sections and lessons
- Track enrollment and revenue analytics
- Host live sessions

### 🛡️ Admin Features
- Full admin panel with Dashboard, Courses, Users, Instructors, Enrollments, Reports
- Real-time stats with charts (Recharts)
- Publish/unpublish courses
- Activate/deactivate user accounts
- Revenue and enrollment analytics

### ⚡ Realtime Features (Socket.IO)
- Live online user count
- Real-time admin notifications on new enrollments
- Live session indicators
- Instant toast notifications

---

## 🛠 Tech Stack

### Frontend
| Technology       | Version  | Purpose                        |
|-----------------|----------|--------------------------------|
| React           | 18.2     | UI Framework                   |
| Vite            | 5.2      | Build tool & dev server        |
| React Router    | 6.22     | Client-side routing            |
| Tailwind CSS    | 3.4      | Utility-first CSS              |
| Axios           | 1.6      | HTTP requests                  |
| Socket.IO Client| 4.7      | Realtime communication         |
| Recharts        | 2.12     | Charts & analytics             |
| Lucide React    | 0.363    | Icon library                   |
| React Hot Toast | 2.4      | Notifications                  |

### Backend
| Technology          | Version  | Purpose                        |
|--------------------|----------|--------------------------------|
| Node.js            | 18+      | Runtime                        |
| Express            | 4.22     | Web framework                  |
| MongoDB + Mongoose | 7.8      | Database & ODM                 |
| Socket.IO          | 4.7      | Realtime server                |
| JWT                | 9.0      | Authentication                 |
| bcryptjs           | 2.4      | Password hashing               |
| Helmet             | 7.1      | Security headers               |
| Morgan             | 1.10     | HTTP request logging           |
| express-rate-limit | 7.1      | API rate limiting              |

---

## 📁 Project Structure

```
learnflow/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Database seeder
│   ├── controllers/
│   │   ├── controllers.js     # Auth, courses, enrollments, etc.
│   │   └── adminController.js # Admin-specific controllers
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT auth middleware
│   ├── models/
│   │   ├── User.js            # User model
│   │   ├── Course.js          # Course model
│   │   └── index.js           # Enrollment, Quiz, Review, Certificate, LearningPath
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── reviewRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── certificateRoutes.js
│   │   ├── pathRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js              # Main server with Socket.IO
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── axiosConfig.js  # Axios instance with interceptors
    │   │   └── adminApi.js     # Admin API calls
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── Footer.jsx
    │   │   ├── CourseCard.jsx
    │   │   ├── ScrollToTop.jsx
    │   │   ├── admin/          # Full admin panel components
    │   │   ├── home/           # Home page sections
    │   │   └── ui/             # Reusable UI components
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth state management
    │   │   └── SocketContext.jsx# Socket.IO context
    │   ├── hooks/
    │   │   └── useInView.js    # Intersection observer hook
    │   ├── pages/              # All page components
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** v18 or higher
- **MongoDB** v6+ (local) or MongoDB Atlas (cloud)
- **npm** v9+

### Step 1: Clone / Extract the project
```bash
# If using the ZIP files:
unzip backend.zip -d learnflow-backend
unzip src.zip -d learnflow-frontend
```

### Step 2: Backend Setup
```bash
cd learnflow-backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your values (see Environment Variables below)
nano .env

# Seed the database with sample data
npm run seed

# Start development server
npm run dev
```

### Step 3: Frontend Setup
```bash
cd learnflow-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/learnflow
# Or for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/learnflow

# JWT
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

---

## ▶️ Running the Project

### Development
```bash
# Terminal 1: Backend
cd backend
npm run dev        # starts on port 5000 with nodemon

# Terminal 2: Frontend
cd frontend
npm run dev        # starts on port 5173 with Vite
```

### Production Build
```bash
# Frontend build
cd frontend
npm run build      # outputs to dist/

# Backend production
cd backend
npm start
```

---

## 🔑 Demo Credentials

After running `npm run seed` in the backend:

| Role        | Email                       | Password        |
|-------------|----------------------------|-----------------|
| **Admin**   | admin@learnflow.com        | admin123        |
| **Instructor** | rahul@learnflow.com     | instructor123   |
| **Student** | student@learnflow.com      | student123      |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint              | Description        | Auth |
|--------|-----------------------|--------------------|------|
| POST   | /api/auth/register    | Register new user  | ❌   |
| POST   | /api/auth/login       | Login user         | ❌   |
| GET    | /api/auth/me          | Get current user   | ✅   |

### Courses
| Method | Endpoint              | Description              | Auth |
|--------|-----------------------|--------------------------|------|
| GET    | /api/courses          | Get all courses (filters)| ❌   |
| GET    | /api/courses/:id      | Get single course        | ❌   |
| POST   | /api/courses          | Create course            | ✅ Instructor |
| PUT    | /api/courses/:id      | Update course            | ✅ Instructor |
| DELETE | /api/courses/:id      | Delete course            | ✅ Admin |

### Users
| Method | Endpoint                  | Description          | Auth |
|--------|---------------------------|----------------------|------|
| GET    | /api/users/profile        | Get own profile      | ✅   |
| PUT    | /api/users/profile        | Update profile       | ✅   |
| PUT    | /api/users/change-password| Change password      | ✅   |

### Enrollments
| Method | Endpoint                  | Description             | Auth |
|--------|---------------------------|-------------------------|------|
| POST   | /api/enrollments          | Enroll in a course      | ✅   |
| GET    | /api/enrollments/my       | Get my enrollments      | ✅   |
| PATCH  | /api/enrollments/:id      | Update progress         | ✅   |

### Admin
| Method | Endpoint                  | Description             | Auth  |
|--------|---------------------------|-------------------------|-------|
| GET    | /api/admin/stats          | Platform stats          | ✅ Admin |
| GET    | /api/admin/courses        | All courses             | ✅ Admin |
| GET    | /api/admin/users          | All users (by role)     | ✅ Admin |
| GET    | /api/admin/enrollments    | All enrollments         | ✅ Admin |
| PATCH  | /api/admin/courses/:id    | Update course status    | ✅ Admin |
| PATCH  | /api/admin/users/:id      | Update user status      | ✅ Admin |

---

## ⚡ Realtime Features (Socket.IO)

The backend uses Socket.IO for realtime functionality. Events:

### Client → Server
```js
socket.emit('user:join', userId)    // user connects
socket.emit('admin:join')           // admin joins admin room
socket.emit('course:join', courseId)// join course room
```

### Server → Client
```js
socket.on('users:online', count)    // online user count update
socket.on('enrollment:new', data)   // admin notified of new enrollment
socket.on('course:update', data)    // course status change
```

Usage in React:
```jsx
import { useSocket } from './context/SocketContext';

function MyComponent() {
  const { socket, onlineCount, connected } = useSocket();
  // ...
}
```

---

## 🌐 Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the dist/ folder to Vercel or Netlify
```

Add `vercel.json` for SPA routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend (Railway / Render / VPS)
```bash
# Set environment variables on your platform:
# MONGO_URI, JWT_SECRET, JWT_EXPIRE, CLIENT_URL, NODE_ENV=production

npm start
```

### MongoDB Atlas (Production DB)
1. Create a free cluster at mongodb.com/atlas
2. Get your connection string
3. Replace `MONGO_URI` in your environment variables

---

## 🔧 Troubleshooting

**Port 5000 already in use:**
```bash
lsof -i :5000 && kill -9 <PID>
# or change PORT in .env
```

**MongoDB connection failed:**
- Make sure MongoDB is running: `mongod --dbpath /data/db`
- Or use MongoDB Atlas with a valid MONGO_URI

**CORS errors:**
- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL exactly

**Socket.IO not connecting:**
- The Vite proxy in `vite.config.js` handles this in development
- In production, ensure the backend URL is set correctly

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

**Built with ❤️ for learners across India**

*LearnFlow v2.0 — React 18 + Node.js + Socket.IO*
