const express = require("express");
const router  = express.Router();

const {
  getAllCourses,
  getInstructorCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  publishCourse,
  getCourseReviews,
  addReview,
} = require("../controllers/courseController");

const { protect, authorize, optionalAuth } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Course = require("../models/Course");

/**
 * @route   GET /api/courses
 * @desc    Get all published courses with filters (category, difficulty, search, sort)
 * @access  Public (optionalAuth attaches user if logged in)
 */
router.get("/", optionalAuth, getAllCourses);

/**
 * @route   GET /api/courses/my
 * @desc    Get instructor's own courses
 * @access  Private (instructor | admin)
 * ⚠️  Must be before /:id to avoid Express treating "my" as an id param
 */
router.get("/my", protect, authorize("instructor", "admin"), getInstructorCourses);

/**
 * @route   GET /api/courses/featured
 * @desc    Get featured courses for homepage
 * @access  Public
 */
router.get("/featured", async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true, isFeatured: true, isCertification: { $ne: true } })
      .populate("instructor", "name avatar headline")
      .sort({ enrollmentCount: -1 })
      .limit(8)
      .lean();
    const mapped = courses.map(c => ({
  ...c,
  rating:      c.averageRating,
  reviewCount: c.totalReviews,
  enrollCount: c.enrollmentCount,
  level:       c.difficulty,
}));
res.json({ success: true, courses: mapped });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch featured courses", error: err.message });
  }
});

/**
 * @route   GET /api/courses/:id
 * @desc    Get single course details (with sections and lessons)
 * @access  Public
 */
router.get("/:id", optionalAuth, getCourse);

/**
 * @route   POST /api/courses
 * @desc    Create a new course
 * @access  Private (instructor | admin)
 */
router.post("/", protect, authorize("instructor", "admin"), createCourse);

/**
 * @route   PUT /api/courses/:id
 * @desc    Update course details
 * @access  Private (instructor | admin)
 */
router.put("/:id", protect, authorize("instructor", "admin"), updateCourse);

/**
 * @route   DELETE /api/courses/:id
 * @desc    Delete a course
 * @access  Private (instructor | admin)
 */
router.delete("/:id", protect, authorize("instructor", "admin"), deleteCourse);

/**
 * @route   PATCH /api/courses/:id/publish
 * @desc    Toggle course published/draft status
 * @access  Private (instructor | admin)
 */
router.patch("/:id/publish", protect, authorize("instructor", "admin"), publishCourse);

/**
 * @route   GET /api/courses/:courseId/reviews
 * @desc    Get all reviews for a course
 * @access  Public
 */
router.get("/:courseId/reviews", getCourseReviews);

/**
 * @route   POST /api/courses/:courseId/reviews
 * @desc    Add or update a review for an enrolled course
 * @access  Private (enrolled student)
 */
router.post("/:courseId/reviews", protect, addReview);

module.exports = router;
