// controllers/adminController.js
const User        = require("../models/User");
const Course      = require("../models/Course");
const Enrollment  = require("../models/Enrollment");
const Review      = require("../models/Review");
const Certificate = require("../models/Certificate");
const notify      = require("../utils/notify");
const { broadcast } = require("../socket");

/* ── Helper ─────────────────────────────────────────────────── */
function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const m    = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/* ── GET /api/admin/dashboard ────────────────────────────────── */
exports.adminDashboard = async (req, res) => {
  const now       = new Date();
  const monthAgo  = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const prevMonth = new Date(now - 60 * 24 * 60 * 60 * 1000);

  const [
    totalStudents,    studentsThisMonth,  studentsPrevMonth,
    totalCourses,     coursesThisMonth,
    totalEnrollments, enrollThisMonth,    enrollPrevMonth,
    totalInstructors,
    revenueAgg,       revThisMonth,       revPrevMonth,
    recentEnrollments,
    topCourses,
    completedCount,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "student", createdAt: { $gte: monthAgo } }),
    User.countDocuments({ role: "student", createdAt: { $gte: prevMonth, $lt: monthAgo } }),
    Course.countDocuments({ isPublished: true }),
    Course.countDocuments({ isPublished: true, createdAt: { $gte: monthAgo } }),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ createdAt: { $gte: monthAgo } }),
    Enrollment.countDocuments({ createdAt: { $gte: prevMonth, $lt: monthAgo } }),
    User.countDocuments({ role: "instructor" }),
    Enrollment.aggregate([
      { $match: { type: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.aggregate([
      { $match: { type: "paid", createdAt: { $gte: monthAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.aggregate([
      { $match: { type: "paid", createdAt: { $gte: prevMonth, $lt: monthAgo } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate("student", "name avatar")
      .populate("course",  "title category"),
    Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(5)
      .populate("instructor", "name")
      .select("title thumbnail enrollmentCount averageRating price category instructor"),
    Enrollment.countDocuments({ isCompleted: true }),
  ]);

  const pct = (a, b) => (b === 0 ? 100 : Math.round(((a - b) / b) * 100));
  const totalRevenue  = revenueAgg[0]?.total || 0;
  const avgCompletion = totalEnrollments > 0
    ? Math.round((completedCount / totalEnrollments) * 100)
    : 0;

  // Push live stats to all connected admin sockets
  try {
    broadcast.statsUpdate({ totalRevenue, activeStudents: totalStudents, totalEnrollments, avgCompletion });
  } catch { /* non-critical */ }

  res.json({
    success: true,
    stats: {
      totalRevenue,
      revenueChange:    pct(revThisMonth[0]?.total || 0, revPrevMonth[0]?.total || 0),
      activeStudents:   totalStudents,
      studentChange:    pct(studentsThisMonth, studentsPrevMonth),
      publishedCourses: totalCourses,
      coursesThisMonth,
      enrollmentsToday: enrollThisMonth,
      enrollmentChange: pct(enrollThisMonth, enrollPrevMonth),
      totalInstructors,
      avgCompletion,
    },
    topCourses: topCourses.map((c) => ({
      _id:         c._id,
      title:       c.title,
      thumbnail:   c.thumbnail,
      instructor:  c.instructor?.name,
      enrollments: c.enrollmentCount,
      revenue:     c.price * c.enrollmentCount,
      rating:      c.averageRating,
      category:    c.category,
    })),
    recentEnrollments: recentEnrollments.map((e) => ({
      _id:           e._id,
      studentName:   e.student?.name   || "Unknown",
      studentAvatar: e.student?.avatar || "",
      courseTitle:   e.course?.title   || "Unknown course",
      category:      e.course?.category || "",
      timeAgo:       timeAgo(e.createdAt),
    })),
  });
};

/* ── GET /api/admin/courses ──────────────────────────────────── */
exports.adminAllCourses = async (req, res) => {
  const { page = 1, limit = 20, category, difficulty, search, status } = req.query;
  const pageNum  = Math.max(1, Number(page)  || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const query    = { isCertification: { $ne: true } };

  if (category)   query.category   = category;
  if (difficulty) query.difficulty = difficulty;
  if (status === "published") query.isPublished = true;
  if (status === "draft")     query.isPublished = false;
  if (search) {
    const re   = { $regex: search.trim(), $options: "i" };
    query.$or  = [{ title: re }, { description: re }];
  }

  const [total, courses] = await Promise.all([
    Course.countDocuments(query),
    Course.find(query)
      .populate("instructor", "name avatar email")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({ success: true, courses, total, page: pageNum, pages: Math.ceil(total / limitNum) });
};

/* ── GET /api/admin/users ────────────────────────────────────── */
exports.adminAllUsers = async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const pageNum  = Math.max(1, Number(page)  || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const match    = { isDeleted: { $ne: true } };

  if (role && role !== "All") match.role = role;
  if (search) {
    const re  = { $regex: search.trim(), $options: "i" };
    match.$or = [{ name: re }, { email: re }];
  }

  const [total, users] = await Promise.all([
    User.countDocuments(match),
    User.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: (pageNum - 1) * limitNum },
      { $limit: limitNum },

      // Courses this user created (for instructors)
      {
        $lookup: {
          from:         "courses",
          localField:   "_id",
          foreignField: "instructor",
          as:           "coursesDocs",
        },
      },

      // Enrollments this user has (for students) — exclude deleted & trial-expired
      {
        $lookup: {
          from:     "enrollments",
          let:      { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr:    { $eq: ["$student", "$$userId"] },
                isDeleted: { $ne: true },
                status:   { $nin: ["refunded", "expired"] },
              },
            },
          ],
          as: "enrollmentsDocs",
        },
      },

      // Students enrolled in courses this instructor created
      {
        $lookup: {
          from:         "enrollments",
          localField:   "coursesDocs._id",
          foreignField: "course",
          as:           "studentEnrollments",
        },
      },

      {
        $addFields: {
          coursesCount:  { $size: "$coursesDocs" },
          enrolledCount: { $size: "$enrollmentsDocs" },
          studentsCount: { $size: "$studentEnrollments" },
        },
      },

      {
        $project: {
          coursesDocs:        0,
          enrollmentsDocs:    0,
          studentEnrollments: 0,
          password:           0,
        },
      },
    ]),
  ]);

  res.json({ success: true, users, total, page: pageNum });
};

/* ── GET /api/admin/enrollments ──────────────────────────────── */
exports.adminEnrollments = async (req, res) => {
  const { page = 1, limit = 20, search, status } = req.query;
  const pageNum  = Math.max(1, Number(page)  || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

  const adminUsers = await User.find({ role: "admin" }).select("_id").lean();
  const query      = { student: { $nin: adminUsers.map((u) => u._id) } };

  if (status === "deleted")   query.isDeleted  = true;
  else                        query.isDeleted  = { $ne: true };
  if (status === "completed") query.isCompleted = true;
  if (status === "active")    query.isCompleted = false;

  if (search) {
    const matchingStudents = await User.find({
      name: { $regex: search.trim(), $options: "i" },
    }).select("_id").lean();
    const matchingCourses = await Course.find({
      title: { $regex: search.trim(), $options: "i" },
    }).select("_id").lean();

    query.$or = [
      { student: { $in: matchingStudents.map((u) => u._id) } },
      { course:  { $in: matchingCourses.map((c) => c._id)  } },
    ];
  }

  const [total, enrollments] = await Promise.all([
    Enrollment.countDocuments(query),
    Enrollment.find(query)
      .populate("student", "name email avatar")
      .populate("course",  "title thumbnail category price")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({ success: true, enrollments, total, page: pageNum });
};

/* ── GET /api/admin/stats ────────────────────────────────────── */
exports.adminStats = async (req, res) => {
  const [totalStudents, totalCourses, totalEnrollments, totalInstructors] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Course.countDocuments({ isPublished: true }),
    Enrollment.countDocuments(),
    User.countDocuments({ role: "instructor" }),
  ]);
  res.json({ success: true, totalStudents, totalCourses, totalEnrollments, totalInstructors });
};

/* ── PATCH /api/admin/users/:id/toggle ───────────────────────── */
exports.toggleUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  if (user.role === "admin")
    return res.status(403).json({ success: false, message: "Cannot toggle another admin" });

  const wasActive  = user.isActive;
  user.isActive    = !user.isActive;
  await user.save({ validateBeforeSave: false });

  // Notify the affected user about their account status change
  await notify(user._id, {
    type:    "announcement",
    title:   user.isActive ? "Your account has been reactivated ✅" : "Your account has been deactivated ⚠️",
    message: user.isActive
      ? "Your Learnflow account is active again. Welcome back!"
      : "Your account has been temporarily deactivated by an administrator. Please contact support for assistance.",
    link:    "/",
    metadata: { action: user.isActive ? "activated" : "deactivated" },
  });

  res.json({
    success:  true,
    isActive: user.isActive,
    message:  `User ${user.isActive ? "activated" : "deactivated"}`,
  });
};

/* ── GET /api/admin/reports ──────────────────────────────────── */
exports.adminReports = async (req, res) => {
  const { period = "monthly" } = req.query;
  const now = new Date();

  const labels =
    period === "weekly"  ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] :
    period === "yearly"  ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] :
                           ["Week 1", "Week 2", "Week 3", "Week 4"];

  const range = (i) => {
    const from = new Date(now);
    const to   = new Date(now);
    if (period === "weekly") {
      from.setDate(now.getDate() - (6 - i)); from.setHours(0,  0,  0,  0);
      to.setDate(now.getDate()   - (5 - i)); to.setHours(23, 59, 59, 999);
    } else if (period === "monthly") {
      from.setDate(1 + i * 7); from.setHours(0,  0,  0,  0);
      to.setDate(7   + i * 7); to.setHours(23, 59, 59, 999);
    } else {
      from.setMonth(i, 1);    from.setHours(0,  0,  0,  0);
      to.setMonth(i + 1, 0);  to.setHours(23, 59, 59, 999);
    }
    return { from, to };
  };

  const [revenueChart, enrollmentChart] = await Promise.all([
    Promise.all(
      labels.map(async (label, i) => {
        const { from, to } = range(i);
        const agg = await Enrollment.aggregate([
          { $match: { type: "paid", createdAt: { $gte: from, $lte: to } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return { label, value: agg[0]?.total || 0 };
      })
    ),
    Promise.all(
      labels.map(async (label, i) => {
        const { from, to } = range(i);
        const count = await Enrollment.countDocuments({ createdAt: { $gte: from, $lte: to } });
        return { label, value: count };
      })
    ),
  ]);

  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    newStudents,
    newEnrollments,
    revenueAgg,
    catBreakdown,
    topCourses,
    completionRates,
  ] = await Promise.all([
    User.countDocuments({ role: "student", createdAt: { $gte: monthAgo } }),
    Enrollment.countDocuments({ createdAt: { $gte: monthAgo } }),
    Enrollment.aggregate([
      { $match: { type: "paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Course.aggregate([
      { $group: { _id: "$category", value: { $sum: "$enrollmentCount" } } },
      { $sort: { value: -1 } },
      { $limit: 6 },
      { $project: { label: "$_id", value: 1, _id: 0 } },
    ]),
    Course.find({ isPublished: true })
      .sort({ enrollmentCount: -1 })
      .limit(8)
      .populate("instructor", "name")
      .select("title enrollmentCount averageRating price"),
    Enrollment.aggregate([
      {
        $group: {
          _id:       "$course",
          total:     { $sum: 1 },
          completed: { $sum: { $cond: ["$isCompleted", 1, 0] } },
        },
      },
      {
        $project: {
          completionRate: {
            $multiply: [{ $divide: ["$completed", "$total"] }, 100],
          },
        },
      },
    ]),
  ]);

  const totalRevenue  = revenueAgg[0]?.total || 0;
  const avgOrderValue = newEnrollments > 0 ? Math.round(totalRevenue / newEnrollments) : 0;

  const compMap = {};
  completionRates.forEach((r) => {
    compMap[r._id.toString()] = Math.round(r.completionRate);
  });

  res.json({
    success: true,
    totalRevenue,
    newStudents,
    newEnrollments,
    avgOrderValue,
    revenueChart,
    enrollmentChart,
    categoryBreakdown: catBreakdown,
    topCourses: topCourses.map((c) => ({
      _id:            c._id,
      title:          c.title,
      enrollments:    c.enrollmentCount,
      revenue:        c.price * c.enrollmentCount,
      rating:         c.averageRating,
      completionRate: compMap[c._id.toString()] ?? 0,
    })),
  });
};