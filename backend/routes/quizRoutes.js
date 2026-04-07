const express = require("express");
const router  = express.Router();

const {
  getCourseQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  submitQuiz,
} = require("../controllers/quizController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Quiz = require("../models/Quiz");

/**
 * @route   GET /api/quizzes/course/:courseId
 * @desc    Get all active quizzes for a course (correct answers hidden)
 * @access  Private (enrolled student)
 */
router.get("/course/:courseId", protect, getCourseQuizzes);

/**
 * @route   POST /api/quizzes
 * @desc    Create a new quiz for a course
 * @access  Private (instructor | admin)
 */
router.post("/", protect, authorize("instructor", "admin"), createQuiz);

/**
 * @route   PUT /api/quizzes/:id
 * @desc    Update a quiz
 * @access  Private (instructor | admin)
 */
router.put("/:id", protect, authorize("instructor", "admin"), updateQuiz);

/**
 * @route   DELETE /api/quizzes/:id
 * @desc    Delete a quiz
 * @access  Private (instructor | admin)
 */
router.delete("/:id", protect, authorize("instructor", "admin"), deleteQuiz);

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Submit quiz answers and get instant results
 * @access  Private
 */
router.post("/:id/submit", protect, submitQuiz);

/**
 * @route   GET /api/quizzes/:id/attempts
 * @desc    Get student's quiz attempt history
 * @access  Private
 */
router.get("/:id/attempts", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).select("title attempts");
    if (!quiz) return res.status(404).json({ success: false, message: "Quiz not found" });
    const myAttempts = quiz.attempts.filter((a) => a.student?.toString() === req.user.id);
    res.json({ success: true, attempts: myAttempts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch attempts", error: err.message });
  }
});

module.exports = router;
