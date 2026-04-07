// controllers/reviewController.js
const Course     = require("../models/Course");
const Review     = require("../models/Review");
const Enrollment = require("../models/Enrollment");
const { broadcast } = require("../socket");

/* ── POST /api/reviews/:courseId ─────────────────────────────── */
exports.addReview = async (req, res) => {
  const { rating, title, body } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });

  const course = await Course.findById(req.params.courseId);
  if (!course)
    return res.status(404).json({ success: false, message: "Course not found" });

  const enrolled = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId });
  if (!enrolled)
    return res.status(403).json({ success: false, message: "You must be enrolled to leave a review" });

  const existing = await Review.findOne({ course: req.params.courseId, student: req.user.id });
  if (existing) {
    existing.rating = rating;
    existing.title  = title;
    existing.body   = body;
    await existing.save();
  } else {
    await Review.create({
      course:     req.params.courseId,
      student:    req.user.id,
      rating, title, body,
      isVerified: true,
    });
  }

  // Recalculate course rating
  const stats = await Review.aggregate([
    { $match: { course: course._id } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  if (stats.length) {
    await Course.findByIdAndUpdate(course._id, {
      averageRating: Math.round(stats[0].avg * 10) / 10,
      totalReviews:  stats[0].count,
    });
  }

  try { broadcast.refresh("reports"); } catch {}

  res.json({ success: true, message: "Review submitted successfully" });
};

/* ── GET /api/reviews/:courseId ──────────────────────────────── */
exports.getCourseReviews = async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
};

/* ── DELETE /api/reviews/:reviewId ───────────────────────────── */
exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review)
    return res.status(404).json({ success: false, message: "Review not found" });

  // Only the reviewer or an admin can delete
  if (review.student.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorized" });

  const courseId = review.course;
  await review.deleteOne();

  // Recalculate course rating
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);
  await Course.findByIdAndUpdate(courseId, {
    averageRating: stats[0]?.avg ? Math.round(stats[0].avg * 10) / 10 : 0,
    totalReviews:  stats[0]?.count || 0,
  });

  res.json({ success: true, message: "Review deleted" });
};

/* ── PATCH /api/reviews/:reviewId/helpful ────────────────────── */
exports.markHelpful = async (req, res) => {
  const review = await Review.findByIdAndUpdate(
    req.params.reviewId,
    { $inc: { helpful: 1 } },
    { new: true }
  );
  if (!review)
    return res.status(404).json({ success: false, message: "Review not found" });
  res.json({ success: true, helpful: review.helpful });
};
