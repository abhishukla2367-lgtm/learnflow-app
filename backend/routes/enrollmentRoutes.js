const express = require("express");
const router  = express.Router();
const {
  enroll,
  getMyEnrollments,
  updateProgress,
  getEnrollmentDetail // Imported from your updated controller
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");
const { Enrollment } = require("../models/index");

// ─── 1. COLLECTION ROUTES ──────────────────────────────────────────────────

// GET /api/enrollments 
// Fetch all enrollments for the logged-in student (used by MyCourses dashboard)
router.get("/", protect, getMyEnrollments);


// ─── 2. STATUS & CHECK ROUTES ──────────────────────────────────────────────

// GET /api/enrollments/check/:courseId
// Quick check to see if user is already enrolled before showing payment buttons
router.get("/check/:courseId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course:  req.params.courseId,
    });
    res.json({ 
      success: true, 
      isEnrolled: !!enrollment, 
      enrollment: enrollment || null 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Check failed", error: err.message });
  }
});


// ─── 3. CORE ACTION ROUTES ─────────────────────────────────────────────────

// POST /api/enrollments/:courseId
// Primary enrollment endpoint (Trial or Paid)
router.post("/:courseId", protect, enroll);

// GET /api/enrollments/:courseId/detail
// THE MOST IMPORTANT ROUTE for the Player. 
// Fetches the enrollment, populates the course, and provides lesson fallbacks.
router.get("/:courseId/detail", protect, getEnrollmentDetail);

// PATCH /api/enrollments/:courseId/progress
// Updates the percentage and marks course as completed if progress is 100
router.patch("/:courseId/progress", protect, updateProgress);


module.exports = router;