const express = require("express");
const router  = express.Router();

const {
  initiatePayment,
  verifyPayment,
  getMyPayments,
  adminAllPayments,
} = require("../controllers/paymentController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Payment    = require("../models/Payment");
const Course     = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/**
 * @route   GET /api/payments/my
 * @desc    Get logged-in student's payment history
 * @access  Private
 * ⚠️  Must be BEFORE /:id style routes
 */
router.get("/my", protect, getMyPayments);

/**
 * @route   GET /api/payments/admin/all
 * @desc    Get all payments with revenue total (admin)
 * @access  Private (admin)
 */
router.get("/admin/all", protect, authorize("admin"), adminAllPayments);

/**
 * @route   POST /api/payments/initiate
 * @desc    Initiate payment for a course (returns payment record for gateway)
 * @access  Private
 */
router.post("/initiate", protect, initiatePayment);

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay payment signature and confirm enrollment
 * @access  Private
 */
router.post("/verify", protect, verifyPayment);

module.exports = router;
