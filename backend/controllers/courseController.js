// controllers/courseController.js
const Course  = require("../models/Course");
const User    = require("../models/User");
const Review  = require("../models/Review");
const { broadcast } = require("../socket");

/* ── GET /api/courses ────────────────────────────────────────── */
exports.getAllCourses = async (req, res) => {
  const {
    category, difficulty, search,
    free, page = 1, limit = 12, sort = "popular",
  } = req.query;

  const query = { isPublished: true, isCertification: { $ne: true } };
  if (category)        query.category   = category;
  if (difficulty)      query.difficulty = difficulty;
  if (free === "true") query.isFree     = true;
  if (search) {
    const re = { $regex: search.trim(), $options: "i" };
    query.$or = [{ title: re }, { description: re }, { tags: re }];
  }

  const sortMap = {
    popular: { enrollmentCount: -1 },
    rating:  { averageRating:   -1 },
    newest:  { createdAt:       -1 },
    price:   { price:            1 },
  };

  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(50, Math.max(1, Number(limit)));

  const [total, courses] = await Promise.all([
    Course.countDocuments(query),
    Course.find(query)
      .populate("instructor", "name avatar headline")
      .sort(sortMap[sort] || { enrollmentCount: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean(),
  ]);

  const mapped = courses.map(c => ({
  ...c,
  rating:      c.averageRating,
  reviewCount: c.totalReviews,
  enrollCount: c.enrollmentCount,
  level:       c.difficulty,
}));
res.json({ success: true, courses: mapped, total, page: pageNum, pages: Math.ceil(total / limitNum) });
};

/* ── GET /api/courses/featured ───────────────────────────────── */
exports.getFeaturedCourses = async (req, res) => {
  const courses = await Course.find({ isFeatured: true, isPublished: true, isCertification: { $ne: true } })
    .populate("instructor", "name avatar")
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
};
/* ── GET /api/courses/my ─────────────────────────────────────── */
exports.getInstructorCourses = async (req, res) => {
  const courses = await Course.find({ instructor: req.user.id })
  .populate("instructor", "name avatar headline") 
  .sort({ createdAt: -1 });
  res.json({ success: true, courses });
};

/* ── GET /api/courses/:id ────────────────────────────────────── */
/* ── GET /api/courses/:id ────────────────────────────────────── */
exports.getCourse = async (req, res) => {
  const { id } = req.params;

  // NUCLEAR FIX: Prevent database crash on 'undefined' strings
  if (!id || id === 'undefined' || id === 'null') {
    return res.status(400).json({ success: false, message: "Invalid Course ID provided" });
  }

  try {
    const course = await Course.findById(id)
      .populate("instructor", "name avatar bio headline website");
    
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    
    res.json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, message: "Malformed ID format" });
  }
};

/* ── POST /api/courses ───────────────────────────────────────── */
exports.createCourse = async (req, res) => {
  const course = await Course.create({ ...req.body, instructor: req.user.id });
  await User.findByIdAndUpdate(req.user.id, { $push: { createdCourses: course._id } });
  res.status(201).json({ success: true, course });
};

/* ── PUT /api/courses/:id ────────────────────────────────────── */
exports.updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).json({ success: false, message: "Course not found" });
  if (course.instructor.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorized to edit this course" });

  const updated = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  try { broadcast.refresh("courses"); } catch {}

  res.json({ success: true, course: updated });
};

/* ── DELETE /api/courses/:id ─────────────────────────────────── */
exports.deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).json({ success: false, message: "Course not found" });
  if (course.instructor.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorized to delete this course" });

  await course.deleteOne();

  try { broadcast.refresh("courses"); } catch {}

  res.json({ success: true, message: "Course deleted successfully" });
};

/* ── PATCH /api/courses/:id/publish ──────────────────────────── */
exports.publishCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course)
    return res.status(404).json({ success: false, message: "Course not found" });
  if (course.instructor.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorized" });

  course.isPublished = !course.isPublished;
  await course.save();

  try {
    if (course.isPublished) broadcast.coursePublished(course);
    else broadcast.refresh("courses");
  } catch {}

  res.json({ success: true, course });
};

/* ── GET /api/courses/:courseId/reviews ──────────────────────── */
exports.getCourseReviews = async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate("student", "name avatar")
    .sort({ createdAt: -1 });
  res.json({ success: true, reviews });
};

/* ── POST /api/courses/:courseId/reviews ─────────────────────── */
exports.addReview = async (req, res) => {
  const { rating, title, body } = req.body;

  if (!rating || rating < 1 || rating > 5)
    return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });

  const Enrollment = require("../models/Enrollment");
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
    await Review.create({ course: req.params.courseId, student: req.user.id, rating, title, body, isVerified: true });
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
