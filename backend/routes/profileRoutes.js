const express = require("express");
const router  = express.Router();

const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const User        = require("../models/User");
const Enrollment  = require("../models/Enrollment");
const Certificate = require("../models/Certificate");
const Payment     = require("../models/Payment");

/**
 * @route   GET /api/profile
 * @desc    Fetch complete profile — user details, enrollments, certificates, payments
 * @access  Private
 */
router.get("/", protect, getProfile);

/**
 * @route   PUT /api/profile/update
 * @desc    Update user profile fields (name, bio, avatar, headline, website, social)
 * @access  Private
 */
router.put("/update", protect, updateProfile);

module.exports = router;
