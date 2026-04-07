require("express-async-errors");
require("dotenv").config();

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");
const helmet   = require("helmet");
const morgan   = require("morgan");
const dns      = require("node:dns");
const http     = require("http");
const rateLimit = require("express-rate-limit");

dns.setServers(["8.8.8.8", "1.1.1.1"]);
process.removeAllListeners("warning");

/* ── 1. VALIDATE CRITICAL ENV VARS (Including Email) ───────────────────── */
// Added EMAIL_USER and EMAIL_PASS to ensure your mailer doesn't crash later
const REQUIRED_ENV = [
  "MONGO_URI", 
  "JWT_SECRET", 
  "JWT_EXPIRE", 
  "EMAIL_USER", 
  "EMAIL_PASS"
];

REQUIRED_ENV.forEach((k) => {
  if (!process.env[k]) {
    console.error(`❌ Missing required env var: ${k}`);
    console.log(`💡 Tip: Check your .env file for ${k}`);
    process.exit(1);
  }
});

const app    = express();
const server = http.createServer(app);

// ── Socket.io setup ───────────────────────────────────────────────────────────
const { Server } = require("socket.io");
const { initSocket } = require("./socket");
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 300000,
  pingInterval: 60000,
});
initSocket(io);
app.set("io", io);

// --- 2. MIDDLEWARE CONFIGURATION ---

app.use(helmet());
app.set("trust proxy", 1);

app.use(cors({
  origin: process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Global Rate Limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests, please try again later." },
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15, // Slightly increased for better UX
  message: { success: false, message: "Too many auth attempts, please wait 15 minutes." },
});

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  if (req.is("multipart/form-data")) return next();
  express.urlencoded({ extended: true })(req, res, next);
});

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- 3. DATABASE CONNECTION ---

mongoose.connect(process.env.MONGO_URI)
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

// --- 4. ROUTES ---
const otpRoutes        = require("./routes/otpRoutes");
const authRoutes         = require("./routes/authRoutes");
const courseRoutes       = require("./routes/courseRoutes");
const enrollmentRoutes   = require("./routes/enrollmentRoutes");
const quizRoutes         = require("./routes/quizRoutes");
const reviewRoutes       = require("./routes/reviewRoutes");
const pathRoutes         = require("./routes/pathRoutes");
const certificateRoutes  = require("./routes/certificateRoutes");
const adminRoutes        = require("./routes/adminRoutes");
const userRoutes         = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const discussionRoutes   = require("./routes/discussionRoutes");
const paymentRoutes      = require("./routes/paymentRoutes");
const wishlistRoutes     = require("./routes/wishlistRoutes");
const profileRoutes      = require("./routes/profileRoutes");

app.use("/api/otp",           authLimiter, otpRoutes);
app.use("/api/auth",          authLimiter, authRoutes);
app.use("/api/courses",       courseRoutes);
app.use("/api/enrollments",   enrollmentRoutes);
app.use("/api/quizzes",       quizRoutes);
app.use("/api/reviews",       reviewRoutes);
app.use("/api/paths",         pathRoutes);
app.use("/api/certificates",  certificateRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/users",         userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/discussions",   discussionRoutes);
app.use("/api/payments",      paymentRoutes);
app.use("/api/wishlist",      wishlistRoutes);
app.use("/api/profile",       profileRoutes);

// --- 5. HEALTH CHECK ---
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status:   "Active",
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    email:    process.env.EMAIL_USER ? "Configured" : "Missing", // Check email status
    sockets:  io.engine.clientsCount,
  });
});

// --- 6. ERROR HANDLING ---
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error("🔥 Server Error Stack:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error:   process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// --- 7. START SERVER ---
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log("");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🚀 LearnFlow API   : Started`);
  console.log(`📡 URL            : http://localhost:${PORT}/api`);
  console.log(`🔌 Socket.IO      : Connected`);
  console.log(`✅ MongoDB        : Connected`);
  console.log(`🕐 Started at      : ${timestamp}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
});

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use.`);
    process.exit(1);
  }
});