const express = require("express");
const router  = express.Router();

const {
  adminDashboard,
  adminAllCourses,
  adminAllUsers,
  adminEnrollments,
  adminReports,
  adminReportCategories,
  adminStats,
  toggleUser,
} = require("../controllers/adminController");

const { adminAllPayments } = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const User       = require("../models/User");
const Course     = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Payment    = require("../models/Payment");

// All admin routes require authentication + admin role
router.use(protect, authorize("admin"));

/**
 * @route   GET /api/admin/dashboard
 * @desc    Full admin dashboard — stats, top courses, recent enrollments (with realtime push)
 * @access  Private (admin)
 */
router.get("/dashboard", adminDashboard);

/**
 * @route   GET /api/admin/stats
 * @desc    Quick summary stats — totals only
 * @access  Private (admin)
 */
router.get("/stats", adminStats);

/**
 * @route   GET /api/admin/courses
 * @desc    All courses with pagination, filters (status, category, search)
 * @access  Private (admin)
 */
router.get("/courses", adminAllCourses);

/**
 * @route   GET /api/admin/users
 * @desc    All users with pagination, filters (role, search)
 * @access  Private (admin)
 */
router.get("/users", adminAllUsers);

/**
 * @route   GET /api/admin/enrollments
 * @desc    All enrollments with pagination, filters (status, search)
 * @access  Private (admin)
 */
router.get("/enrollments", adminEnrollments);

router.delete("/enrollments/:id", async (req, res) => {
  try {
    await Enrollment.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove enrollment", error: err.message });
  }
});

router.patch("/enrollments/:id/restore", async (req, res) => {
  try {
    await Enrollment.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      deletedAt: null,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to restore enrollment", error: err.message });
  }
});

router.get("/reports", adminReports);
router.get("/reports/categories", adminReportCategories);

/**
 * @route   GET /api/admin/payments
 * @desc    All payments with total revenue
 * @access  Private (admin)
 */
router.get("/payments", adminAllPayments);

/**
 * @route   PATCH /api/admin/users/:id/toggle
 * @desc    Activate / deactivate a user account
 * @access  Private (admin)
 */
router.patch("/users/:id/toggle", toggleUser);

/**
 * @route   PATCH /api/admin/courses/:id/feature
 * @desc    Toggle featured status of a course (homepage banner)
 * @access  Private (admin)
 */
router.patch("/courses/:id/feature", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    course.isFeatured = !course.isFeatured;
    await course.save();
    res.json({ success: true, isFeatured: course.isFeatured });
  } catch (err) {
    res.status(500).json({ success: false, message: "Toggle failed", error: err.message });
  }
});

/**
 * @route   GET /api/admin/dashboard-stats
 * @desc    Real-time stats for Dashboard Cards (today's data)
 * @access  Private (admin)
 */
router.get("/dashboard-stats", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayEnrollments, pendingPayments, totalRevenue, newUsers] = await Promise.all([
      Enrollment.countDocuments({ createdAt: { $gte: today } }),
      Payment.countDocuments({ status: "pending" }),
      Payment.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$finalAmount" } } },
      ]),
      User.countDocuments({ createdAt: { $gte: today }, role: "student" }),
    ]);

    res.status(200).json({
      success: true,
      todayEnrollments,
      pendingPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
      newUsers,
    });
  } catch (err) {
    console.error("❌ Dashboard Stats Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch dashboard stats", error: err.message });
  }
});

module.exports = router;