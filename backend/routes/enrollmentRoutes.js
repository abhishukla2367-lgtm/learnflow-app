const express = require("express");
const router  = express.Router();
const {
  enroll,
  getMyEnrollments,
  updateProgress,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");
const { Enrollment } = require("../models/index");

// GET /api/enrollments — all enrollments for logged-in student
router.get("/", protect, getMyEnrollments);

// GET /api/enrollments/check/:courseId
router.get("/check/:courseId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,   // FIXED: was "user:" — matches schema field name
      course:  req.params.courseId,
    });
    res.json({ success: true, isEnrolled: !!enrollment, enrollment: enrollment || null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Check failed", error: err.message });
  }
});

// POST /api/enrollments/:courseId — enroll
router.post("/:courseId", protect, enroll);

// PUT /api/enrollments/:courseId/progress — update progress
router.put("/:courseId/progress", protect, updateProgress);

// GET /api/enrollments/:courseId/detail
router.get("/:courseId/detail", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,   // FIXED: was "user:"
      course:  req.params.courseId,
    }).populate("course");

    if (!enrollment)
      return res.status(404).json({ success: false, message: "Enrollment not found" });

    res.json({ success: true, enrollment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed", error: err.message });
  }
});

module.exports = router;
