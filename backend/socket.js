// socket.js
const { Server } = require("socket.io");
const jwt        = require("jsonwebtoken");

let io;

/* ── Online users tracking ───────────────────────────────────── */
const onlineUsers  = new Map();   // userId → socketId
const adminSockets = new Set();   // socketIds that are admins

function broadcastOnlineCount() {
  if (!io) return;
  io.emit("users:online", onlineUsers.size);
}

/* ── Helper: push fresh dashboard stats to all admins ─────────── */
async function pushStatsToAdmins() {
  if (!io || adminSockets.size === 0) return;
  try {
    const User       = require("./models/User");
    const Enrollment = require("./models/Enrollment");

    const [totalStudents, totalEnrollments, revenue] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Enrollment.countDocuments(),
      Enrollment.aggregate([
        { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "c" } },
        { $unwind: "$c" },
        { $match: { "c.isFree": { $ne: true } } },
        { $group: { _id: null, total: { $sum: "$c.price" } } },
      ]),
    ]);

    const stats = {
      activeStudents:   totalStudents,
      totalEnrollments,
      totalRevenue:     revenue[0]?.total ?? 0,
      updatedAt:        new Date().toISOString(),
    };
    io.to("admins").emit("stats:update", stats);
  } catch (err) {
    console.error("[socket] pushStatsToAdmins error:", err.message);
  }
}

/* ── Main init ─────────────────────────────────────────────────── */
const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin:      process.env.FRONTEND_URL || ["http://localhost:5173", "http://localhost:5174"],
      methods:     ["GET", "POST"],
      credentials: true,
    },
    pingTimeout:   300000,
    pingInterval:  60000,
    allowUpgrades: false,
  });

  // ── JWT Auth Middleware ──────────────────────────────────────────
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      socket.user = null; // guest — allowed for public events
      return next();
    }
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      socket.user = null; // invalid token — still allow as guest
      next();
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} | role: ${socket.user?.role || "guest"}`);

    // ── User identifies themselves ──────────────────────────────
    socket.on("user:join", ({ userId, role } = {}) => {
      if (!socket.user || String(socket.user.id) !== String(userId)) return;
        onlineUsers.set(String(userId), socket.id);
        socket.data.userId = String(userId);
        socket.data.role   = role;
        socket.join(`user:${userId}`);
        broadcastOnlineCount();
    });

    // ── Admin room — JWT-verified admins only ───────────────────
    socket.on("admin:join", () => {
      if (!socket.user || socket.user.role !== "admin") {
        console.warn(`⛔ Unauthorized admin:join from socket ${socket.id}`);
        socket.emit("admin_auth_error", { message: "Unauthorized" });
        return;
      }
      socket.join("admins");
      adminSockets.add(socket.id);
      console.log(`🛡️  ${socket.user.name || socket.user.id} joined admins room`);
      socket.emit("users:online", onlineUsers.size);
      // Push fresh stats immediately when admin connects
      pushStatsToAdmins();
    });

    socket.on("admin:leave", () => {
      socket.leave("admins");
      adminSockets.delete(socket.id);
    });

    // ── Course discussion room ──────────────────────────────────
    socket.on("course:join", (courseId) => {
      socket.join(`course:${courseId}`);
    });

    socket.on("course:leave", (courseId) => {
      socket.leave(`course:${courseId}`);
    });

    // Relay discussion message to everyone in the course room
    socket.on("course:message", ({ courseId, user, text } = {}) => {
      if (!courseId || !text) return;
      const payload = {
        user,
        text,
        timestamp: new Date().toISOString(),
      };
      socket.to(`course:${courseId}`).emit(`course:message:${courseId}`, payload);
      socket.emit(`course:message:${courseId}`, payload); // confirm to sender
    });

    // ── Per-enrollment room (progress tracking) ─────────────────
    socket.on("enrollment:join",  (enrollmentId) => socket.join(`enrollment:${enrollmentId}`));
    socket.on("enrollment:leave", (enrollmentId) => socket.leave(`enrollment:${enrollmentId}`));

    // ── Notification room (per user) ────────────────────────────
    socket.on("notifications:join", (userId) => {
      if (socket.user && String(socket.user.id) === String(userId)) {
        socket.join(`notifications:${userId}`);
      }
    });

    // ── Disconnect cleanup ───────────────────────────────────────
    socket.on("disconnect", (reason) => {
      adminSockets.delete(socket.id);
      if (socket.data?.userId) {
        onlineUsers.delete(socket.data.userId);
        broadcastOnlineCount();
      }
      console.log(`🔌 Disconnected: ${socket.id} | ${reason}`);
    });
  });

  return io;
};

/* ── Singleton getter so any controller can broadcast ───────────── */
const getIO = () => {
  if (!io) throw new Error("❌ Socket.io not initialized!");
  return io;
};

/* ── Convenience broadcast helpers (call from controllers) ──────── */
const broadcast = {
  /**
   * Call after a new enrollment is saved.
   * Triggers: Dashboard stats, Enrollments tab, Live Enrollments feed.
   */
  newEnrollment({ studentName, courseName, courseId } = {}) {
    if (!io) return;
    const event = {
      type:        "enrollment:new",
      studentName,
      courseName,
      courseId:    String(courseId || ""),
      timestamp:   new Date().toISOString(),
    };
    io.to("admins").emit("activity:new",   event);
    io.to("admins").emit("enrollment:new", event);
    io.to("admins").emit("data:refresh",   { section: "enrollments" });
    io.to("admins").emit("data:refresh",   { section: "instructors" }); 
    pushStatsToAdmins(); // Update stat cards
  },

  /**
   * Call after a new user registers.
   * Triggers: Dashboard stats, Users tab, Instructors tab.
   */
  newUser(user) {
    if (!io) return;
    const event = {
      type:      "user:new",
      name:      user.name,
      userId:    String(user._id || ""),
      timestamp: new Date().toISOString(),
    };
    io.to("admins").emit("activity:new", event);
    io.to("admins").emit("data:refresh", { section: "users" });
    pushStatsToAdmins(); // Update student count card
  },

  /**
   * Call after a course is published/unpublished.
   * Triggers: Courses tab refresh.
   */
  coursePublished(course) {
    if (!io) return;
    const event = {
      type:      "course:published",
      title:     course.title,
      courseId:  String(course._id || ""),
      timestamp: new Date().toISOString(),
    };
    io.to("admins").emit("activity:new",      event);
    io.to("admins").emit("course:published",  event);
    io.to("admins").emit("data:refresh",      { section: "courses" });
  },

  /**
   * Call after a payment is recorded.
   * Triggers: Dashboard revenue card.
   */
  newPayment({ amount, studentName, courseName } = {}) {
    if (!io) return;
    io.to("admins").emit("activity:new", {
      type:        "payment:new",
      amount,
      studentName,
      courseName,
      timestamp:   new Date().toISOString(),
    });
    pushStatsToAdmins(); // Update revenue card
  },

  /**
   * Push a stats object directly to admin dashboards.
   */
  statsUpdate(stats) {
    if (!io) return;
    io.to("admins").emit("stats:update", { ...stats, updatedAt: new Date().toISOString() });
  },

  /**
   * Push a notification to a specific user.
   */
  sendNotification(userId, notification) {
    if (!io) return;
    io.to(`user:${userId}`).emit("notification:new", notification);
    io.to(`notifications:${userId}`).emit("notification:new", notification);
  },

  /**
   * Broadcast a discussion message to all users viewing a course.
   */
  courseDiscussion(courseId, data) {
    if (!io) return;
    io.to(`course:${courseId}`).emit(`course:message:${courseId}`, {
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Tell all clients (or a specific section) to re-fetch data.
   * section: "all" | "enrollments" | "users" | "courses" | "reports" | "instructors"
   */
  refresh(section = "all") {
    if (!io) return;
    io.emit("data:refresh", { section });
  },
};

module.exports = { initSocket, getIO, broadcast, pushStatsToAdmins };