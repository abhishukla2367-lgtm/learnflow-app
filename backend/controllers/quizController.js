// controllers/quizController.js
const Quiz = require("../models/Quiz");
const notify = require('../utils/notify');

/* ── GET /api/quizzes/course/:courseId ───────────────────────── */
exports.getCourseQuizzes = async (req, res) => {
  const quizzes = await Quiz.find({ course: req.params.courseId, isActive: true })
    .select("-questions.correctAnswer -questions.explanation");
  res.json({ success: true, quizzes });
};

/* ── POST /api/quizzes ───────────────────────────────────────── */
exports.createQuiz = async (req, res) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json({ success: true, quiz });
};

/* ── PUT /api/quizzes/:id ────────────────────────────────────── */
exports.updateQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!quiz)
    return res.status(404).json({ success: false, message: "Quiz not found" });
  res.json({ success: true, quiz });
};

/* ── DELETE /api/quizzes/:id ─────────────────────────────────── */
exports.deleteQuiz = async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz)
    return res.status(404).json({ success: false, message: "Quiz not found" });
  res.json({ success: true, message: "Quiz deleted" });
};

/* ── POST /api/quizzes/:id/submit ────────────────────────────── */
exports.submitQuiz = async (req, res) => {
  const { answers, timeTaken } = req.body;
 
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz)
    return res.status(404).json({ success: false, message: "Quiz not found" });
 
  let correct = 0;
  const results = quiz.questions.map((q, i) => {
    const isCorrect = answers[i] === q.correctAnswer;
    if (isCorrect) correct++;
    return { isCorrect, correctAnswer: q.correctAnswer, explanation: q.explanation };
  });
 
  const score  = Math.round((correct / quiz.questions.length) * 100);
  const passed = score >= quiz.passingScore;
 
  quiz.attempts.push({ student: req.user.id, answers, score, passed, timeTaken });
  await quiz.save();
 
  // ── Notify on passing ──────────────────────────────────────────────────────
  if (passed) {
    const notify = require('../utils/notify');
    await notify(req.user.id, {
      type:    'quiz_passed',
      title:   `Quiz Passed! 🏆`,
      message: `You scored ${score}% on "${quiz.title}". Well done! Keep up the great work.`,
      link:    `/learn/course/${quiz.course}`,
      metadata: { quizId: String(quiz._id), score },
    });
  }
 
  res.json({ success: true, score, passed, correct, total: quiz.questions.length, results });
};