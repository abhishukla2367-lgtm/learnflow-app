const express = require("express");
const router  = express.Router();

const {
  getAllUsers,
  getUserById,
  getInstructors,
} = require("../controllers/userController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const User = require("../models/User");

/**
 * @route   GET /api/users/instructors
 * @desc    Get all active instructors for public display
 * @access  Public
 * ⚠️  Must be BEFORE /:id to avoid Express treating "instructors" as an id
 */
router.get("/instructors", getInstructors);

/**
 * @route   GET /api/users
 * @desc    Get all users (admin only)
 * @access  Private (admin)
 */
router.get("/", protect, authorize("admin"), getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get public user profile by ID
 * @access  Private
 */
router.get("/:id", protect, getUserById);

module.exports = router;
