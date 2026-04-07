const express = require("express");
const router  = express.Router();

const {
  addReview,
  getCourseReviews,
  deleteReview,
  markHelpful,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Review = require("../models/Review");

/**
 * @route   GET /api/reviews/:courseId
 * @desc    Get all reviews for a course
 * @access  Public
 */
router.get("/:courseId", getCourseReviews);

/**
 * @route   POST /api/reviews/:courseId
 * @desc    Add or update a review (must be enrolled)
 * @access  Private
 */
router.post("/:courseId", protect, addReview);

/**
 * @route   PATCH /api/reviews/:reviewId/helpful
 * @desc    Mark a review as helpful (increment helpful count)
 * @access  Private
 */
router.patch("/:reviewId/helpful", protect, markHelpful);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review (reviewer or admin only)
 * @access  Private
 */
router.delete("/:reviewId", protect, deleteReview);

module.exports = router;
