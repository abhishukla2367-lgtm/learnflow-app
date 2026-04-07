const express = require("express");
const router  = express.Router();

const {
  getCourseDiscussions,
  createDiscussion,
  addReply,
  pinDiscussion,
  deleteDiscussion,
  likeDiscussion,
} = require("../controllers/discussionController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Discussion = require("../models/Discussion");

/**
 * @route   GET /api/discussions/course/:courseId
 * @desc    Get all discussions for a course (paginated, pinned first)
 * @access  Private
 */
router.get("/course/:courseId", protect, getCourseDiscussions);

/**
 * @route   POST /api/discussions/course/:courseId
 * @desc    Create a new discussion thread (enrolled students, instructors, admins)
 * @access  Private
 */
router.post("/course/:courseId", protect, createDiscussion);

/**
 * @route   POST /api/discussions/:id/reply
 * @desc    Add a reply to a discussion thread
 * @access  Private
 */
router.post("/:id/reply", protect, addReply);

/**
 * @route   PATCH /api/discussions/:id/like
 * @desc    Toggle like on a discussion thread
 * @access  Private
 */
router.patch("/:id/like", protect, likeDiscussion);

/**
 * @route   PATCH /api/discussions/:id/pin
 * @desc    Pin or unpin a discussion (admin | instructor only)
 * @access  Private (admin | instructor)
 */
router.patch("/:id/pin", protect, authorize("admin", "instructor"), pinDiscussion);

/**
 * @route   DELETE /api/discussions/:id
 * @desc    Soft-delete a discussion (author or admin)
 * @access  Private
 */
router.delete("/:id", protect, deleteDiscussion);

module.exports = router;
