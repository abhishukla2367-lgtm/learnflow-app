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
      ? "Your Learnodays account is active again. Welcome back!"
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

/* ── Report period helpers ─────────────────────────────────────
   Calendar-aligned "This X / Last X" ranges (Coursera/Udemy-style
   admin reporting) instead of a rolling window. */
const PERIOD_ALIASES = { weekly: "this_week", monthly: "this_month", yearly: "this_year" };
const VALID_PERIODS  = ["this_week", "last_week", "this_month", "last_month", "this_year", "last_year"];

function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
function endOfDay(d)   { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; }

function mondayOf(d) {
  const x   = new Date(d);
  const day = x.getDay(); // 0=Sun..6=Sat
  x.setDate(x.getDate() + (day === 0 ? -6 : 1 - day));
  return startOfDay(x);
}

function getPeriodRange(period, now) {
  let granularity, start, end, prevStart, prevEnd;

  if (period === "this_week" || period === "last_week") {
    const thisMonday = mondayOf(now);
    if (period === "this_week") {
      start = thisMonday;
      end   = endOfDay(new Date(+thisMonday + 6 * 86400000));
    } else {
      end   = endOfDay(new Date(+thisMonday - 86400000));
      start = startOfDay(new Date(+end - 6 * 86400000));
    }
    prevStart = startOfDay(new Date(+start - 7 * 86400000));
    prevEnd   = endOfDay(new Date(+prevStart + 6 * 86400000));
    granularity = "week";
  } else if (period === "this_month" || period === "last_month") {
    const y = now.getFullYear(), m = now.getMonth();
    const t = period === "this_month" ? m : m - 1;
    start = startOfDay(new Date(y, t, 1));
    end   = endOfDay(new Date(y, t + 1, 0));
    prevStart = startOfDay(new Date(y, t - 1, 1));
    prevEnd   = endOfDay(new Date(y, t, 0));
    granularity = "month";
  } else { // this_year / last_year
    const y = now.getFullYear();
    const t = period === "this_year" ? y : y - 1;
    start = startOfDay(new Date(t, 0, 1));
    end   = endOfDay(new Date(t, 11, 31));
    prevStart = startOfDay(new Date(t - 1, 0, 1));
    prevEnd   = endOfDay(new Date(t - 1, 11, 31));
    granularity = "year";
  }
  return { granularity, start, end, prevStart, prevEnd };
}

function buildBuckets(granularity, start) {
  const buckets = [];
  if (granularity === "week") {
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((label, i) => {
      const from = new Date(start); from.setDate(from.getDate() + i);
      buckets.push({ label, from: startOfDay(from), to: endOfDay(from) });
    });
  } else if (granularity === "month") {
    const y = start.getFullYear(), m = start.getMonth();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    for (let d = 1; d <= daysInMonth; d++) {
      buckets.push({ label: String(d), from: startOfDay(new Date(y, m, d)), to: endOfDay(new Date(y, m, d)) });
    }
  } else { // year
    const y = start.getFullYear();
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].forEach((label, m) => {
      buckets.push({ label, from: startOfDay(new Date(y, m, 1)), to: endOfDay(new Date(y, m + 1, 0)) });
    });
  }
  return buckets;
}

function pctChange(curr, prev) {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

/* Sum/count period-scoped docs into pre-built, non-overlapping buckets via
   binary search — avoids relying on Mongo's date operators (which default to
   UTC) so bucket boundaries stay exactly consistent with getPeriodRange(). */
function bucketize(buckets, docs, valueFn) {
  const sums = new Array(buckets.length).fill(0);
  docs.forEach((doc) => {
    const t = new Date(doc.createdAt).getTime();
    let lo = 0, hi = buckets.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (t < buckets[mid].from.getTime())      hi = mid - 1;
      else if (t > buckets[mid].to.getTime())   lo = mid + 1;
      else { sums[mid] += valueFn(doc); return; }
    }
  });
  return sums;
}

/* ── GET /api/admin/reports ──────────────────────────────────── */
exports.adminReports = async (req, res) => {
  let period = PERIOD_ALIASES[req.query.period] || req.query.period || "this_month";
  if (!VALID_PERIODS.includes(period)) period = "this_month";

  const now = new Date();
  const { granularity, start, end, prevStart, prevEnd } = getPeriodRange(period, now);
  const buckets = buildBuckets(granularity, start);

  const [
    paidDocs,           // for revenue chart — 1 query instead of up to 31
    allDocs,             // for enrollment chart — 1 query instead of up to 31
    newStudents,
    newEnrollments,
    revenueAgg,
    prevNewStudents,
    prevNewEnrollments,
    prevRevenueAgg,
    periodByCourse,      // period-scoped enrollments/revenue grouped by course
    catBreakdown,        // period-scoped category breakdown
    completionRates,     // completion rate stays all-time (see note below)
  ] = await Promise.all([
    Enrollment.find({ type: "paid", createdAt: { $gte: start, $lte: end } })
      .select("amount createdAt").lean(),
    Enrollment.find({ createdAt: { $gte: start, $lte: end } })
      .select("createdAt").lean(),
    User.countDocuments({ role: "student", createdAt: { $gte: start, $lte: end } }),
    Enrollment.countDocuments({ createdAt: { $gte: start, $lte: end } }),
    Enrollment.aggregate([
      { $match: { type: "paid", createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    User.countDocuments({ role: "student", createdAt: { $gte: prevStart, $lte: prevEnd } }),
    Enrollment.countDocuments({ createdAt: { $gte: prevStart, $lte: prevEnd } }),
    Enrollment.aggregate([
      { $match: { type: "paid", createdAt: { $gte: prevStart, $lte: prevEnd } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Enrollment.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id:         "$course",
          enrollments: { $sum: 1 },
          revenue:     { $sum: { $cond: [{ $eq: ["$type", "paid"] }, "$amount", 0] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 8 },
    ]),
    Enrollment.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $lookup: { from: "courses", localField: "course", foreignField: "_id", as: "courseDoc" } },
      { $unwind: "$courseDoc" },
      { $group: { _id: "$courseDoc.category", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 6 },
      { $project: { label: "$_id", value: 1, _id: 0 } },
    ]),
    // Completion rate is deliberately NOT period-scoped: a course's overall
    // track record is more meaningful here than the completion rate of only
    // this period's cohort, who mostly haven't had time to finish yet
    // (that would read as artificially near-zero for "This Week", etc).
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

  const revenueSums  = bucketize(buckets, paidDocs, (d) => d.amount || 0);
  const enrollCounts = bucketize(buckets, allDocs,  () => 1);
  const revenueChart    = buckets.map((b, i) => ({ label: b.label, value: revenueSums[i] }));
  const enrollmentChart = buckets.map((b, i) => ({ label: b.label, value: enrollCounts[i] }));

  const totalRevenue      = revenueAgg[0]?.total || 0;
  const prevTotalRevenue  = prevRevenueAgg[0]?.total || 0;
  const avgOrderValue     = newEnrollments     > 0 ? Math.round(totalRevenue     / newEnrollments)     : 0;
  const prevAvgOrderValue = prevNewEnrollments > 0 ? Math.round(prevTotalRevenue / prevNewEnrollments) : 0;

  const compMap = {};
  completionRates.forEach((r) => {
    compMap[r._id.toString()] = Math.round(r.completionRate);
  });

  // Join the period-scoped enrollment counts/revenue back to live Course
  // details (title/rating). Courses that no longer exist are dropped.
  const courseIds = periodByCourse.map((p) => p._id).filter(Boolean);
  const courseDocs = await Course.find({ _id: { $in: courseIds } })
    .select("title averageRating")
    .lean();
  const courseMap = new Map(courseDocs.map((c) => [String(c._id), c]));

  const topCourses = periodByCourse
    .map((p) => {
      const c = courseMap.get(String(p._id));
      if (!c) return null;
      return {
        _id:            p._id,
        title:          c.title,
        enrollments:    p.enrollments,
        revenue:        p.revenue,
        rating:         c.averageRating,
        completionRate: compMap[String(p._id)] ?? 0,
      };
    })
    .filter(Boolean);

  res.json({
    success: true,
    period,
    totalRevenue,
    newStudents,
    newEnrollments,
    avgOrderValue,
    changes: {
      totalRevenue:   pctChange(totalRevenue,   prevTotalRevenue),
      newStudents:    pctChange(newStudents,    prevNewStudents),
      newEnrollments: pctChange(newEnrollments, prevNewEnrollments),
      avgOrderValue:  pctChange(avgOrderValue,  prevAvgOrderValue),
    },
    revenueChart,
    enrollmentChart,
    categoryBreakdown: catBreakdown,
    topCourses,
  });
};