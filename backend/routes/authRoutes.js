const express = require("express");
const router  = express.Router();

const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student account
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login and receive JWT token
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user with enrolled courses
 * @access  Private
 */
router.get("/me", protect, getMe);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update authenticated user profile fields
 * @access  Private
 */
router.put("/profile", protect, updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Change authenticated user password
 * @access  Private
 */
router.put("/password", protect, changePassword);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset link to email
 * @access  Public
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   POST /api/auth/reset-password/:token
 * @desc    Validate token and reset password
 * @access  Public
 */
router.post("/reset-password/:token", resetPassword);

/**
 * @route   DELETE /api/auth/account
 * @desc    Permanently delete authenticated user account + enrollments
 * @access  Private
 */
router.delete("/account", protect, deleteAccount);

module.exports = router;
