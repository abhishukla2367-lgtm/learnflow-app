
let _io = null;

/* ── Online users tracking ───────────────────────────────── */
const onlineUsers = new Map();   // userId → socketId
const adminSockets = new Set();  // socketIds that are admins

function broadcastOnlineCount(io) {
  io.emit("users:online", onlineUsers.size);
}

/* ── Helper: push fresh dashboard stats to all admins ─────── */
async function pushStatsToAdmins(io, models) {
  if (!models || adminSockets.size === 0) return;
  try {
    const { User, Enrollment, Course } = models;
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
      activeStudents: totalStudents,
      totalEnrollments,
      totalRevenue: revenue[0]?.total ?? 0,
      updatedAt: new Date().toISOString(),
    };
    io.to("admins").emit("stats:update", stats);
  } catch (err) {
    console.error("[socket] pushStatsToAdmins error:", err.message);
  }
}

/* ── Main init ───────────────────────────────────────────── */
function initSocket(io, models) {
  _io = io;

  io.on("connection", (socket) => {
    /* ── User joins ─────────────────────────────────────── */
    socket.on("user:join", ({ userId, role } = {}) => {
      if (userId) {
        onlineUsers.set(String(userId), socket.id);
        socket.data.userId = String(userId);
        socket.data.role   = role;
        socket.join(`user:${userId}`);
        broadcastOnlineCount(io);
      }
    });

    /* ── Admin joins admin room ──────────────────────────── */
    socket.on("admin:join", () => {
      socket.join("admins");
      adminSockets.add(socket.id);
      // Send current online count immediately
      socket.emit("users:online", onlineUsers.size);
    });

    /* ── Course discussion room ─────────────────────────── */
    socket.on("course:join", (courseId) => {
      socket.join(`course:${courseId}`);
    });

    socket.on("course:leave", (courseId) => {
      socket.leave(`course:${courseId}`);
    });

    /* Relay a discussion message to everyone else in the course room */
    socket.on("course:message", ({ courseId, user, text } = {}) => {
      if (!courseId || !text) return;
      socket.to(`course:${courseId}`).emit(`course:message:${courseId}`, { user, text });
    });

    /* ── Disconnect cleanup ──────────────────────────────── */
    socket.on("disconnect", () => {
      adminSockets.delete(socket.id);
      if (socket.data.userId) {
        onlineUsers.delete(socket.data.userId);
        broadcastOnlineCount(io);
      }
    });
  });

  return io;
}

/* ── Export singleton getter so any controller can broadcast ─ */
function getIO() {
  if (!_io) throw new Error("Socket.IO not initialised. Call initSocket(io) first.");
  return _io;
}

/* ── Convenience broadcast helpers (call from controllers) ── */
const broadcast = {
  /**
   * Call after a new enrollment is saved.
   * @param {object} enrollment - { studentName, courseName, courseId, ... }
   */
  newEnrollment(enrollment) {
    if (!_io) return;
    const event = {
      type:        "enrollment:new",
      studentName: enrollment.studentName,
      courseName:  enrollment.courseName,
      courseId:    String(enrollment.courseId || ""),
      timestamp:   new Date().toISOString(),
    };
    _io.to("admins").emit("activity:new",   event);
    _io.to("admins").emit("enrollment:new", event);   // DashboardOverview listener
    _io.to("admins").emit("data:refresh",   { section: "enrollments" });
  },

  /**
   * Call after a new user registers.
   */
  newUser(user) {
    if (!_io) return;
    const event = {
      type:      "user:new",
      name:      user.name,
      userId:    String(user._id || ""),
      timestamp: new Date().toISOString(),
    };
    _io.to("admins").emit("activity:new", event);
    _io.to("admins").emit("data:refresh", { section: "users" });
  },

  /**
   * Call after a course is published/unpublished.
   */
  coursePublished(course) {
    if (!_io) return;
    const event = {
      type:      "course:published",
      title:     course.title,
      courseId:  String(course._id || ""),
      timestamp: new Date().toISOString(),
    };
    _io.to("admins").emit("activity:new", event);
    _io.to("admins").emit("data:refresh", { section: "courses" });
  },

  /**
   * Call after a payment is recorded.
   */
  newPayment({ amount, studentName, courseName } = {}) {
    if (!_io) return;
    _io.to("admins").emit("activity:new", {
      type:        "payment:new",
      amount,
      studentName,
      courseName,
      timestamp:   new Date().toISOString(),
    });
  },

  /**
   * Push updated stats object directly to admin dashboards.
   * Pass whatever changed — it gets merged into existing stats.
   */
  statsUpdate(stats) {
    if (!_io) return;
    _io.to("admins").emit("stats:update", { ...stats, updatedAt: new Date().toISOString() });
  },

  /**
   * Broadcast a discussion message to all users viewing a course.
   */
  courseMessage(courseId, { user, text }) {
    if (!_io) return;
    _io.to(`course:${courseId}`).emit(`course:message:${courseId}`, { user, text });
  },

  /**
   * Tell all clients (or a specific section) to re-fetch data.
   * section: "all" | "enrollments" | "users" | "courses" | "reports"
   */
  refresh(section = "all") {
    if (!_io) return;
    _io.emit("data:refresh", { section });
  },
};

module.exports = { initSocket, getIO, broadcast, pushStatsToAdmins };
