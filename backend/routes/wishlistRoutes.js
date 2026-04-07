const express = require("express");
const router  = express.Router();

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = require("../controllers/wishlistController");

const { protect } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Wishlist = require("../models/Wishlist");
const Course   = require("../models/Course");

/**
 * @route   GET /api/wishlist
 * @desc    Get logged-in student's wishlist with course details
 * @access  Private
 */
router.get("/", protect, getWishlist);

/**
 * @route   DELETE /api/wishlist/clear
 * @desc    Clear the entire wishlist
 * @access  Private
 * ⚠️  Must be BEFORE /:courseId to prevent Express treating "clear" as a courseId
 */
router.delete("/clear", protect, clearWishlist);

/**
 * @route   POST /api/wishlist/:courseId
 * @desc    Add a course to wishlist
 * @access  Private
 */
router.post("/:courseId", protect, addToWishlist);

/**
 * @route   DELETE /api/wishlist/:courseId
 * @desc    Remove a course from wishlist
 * @access  Private
 */
router.delete("/:courseId", protect, removeFromWishlist);

module.exports = router;
