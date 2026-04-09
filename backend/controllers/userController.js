// controllers/userController.js
const User       = require("../models/User");
const Course     = require("../models/Course");
const Enrollment = require("../models/Enrollment");

/* ── GET /api/users ─────────────────────────────────────────── */
exports.getAllUsers = async (req, res) => {
  try {
    const { role, limit = 100 } = req.query;
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 100));

    const match = { isDeleted: { $ne: true } };
    if (role) match.role = role;

    const users = await User.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $limit: limitNum },
      {
        $lookup: {
          from:         "courses",
          localField:   "_id",
          foreignField: "instructor",
          as:           "coursesDocs",
        },
      },
      {
        $lookup: {
          from:         "enrollments",
          localField:   "coursesDocs._id",
          foreignField: "course",
          as:           "studentEnrollments",
        },
      },
      {
        $addFields: {
          coursesCount:  { $size: "$coursesDocs" },
          studentsCount: { $size: "$studentEnrollments" },
        },
      },
      {
        $project: {
          coursesDocs:        0,
          studentEnrollments: 0,
          password:           0,
        },
      },
    ]);

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message });
  }
};

/* ── GET /api/users/:id ─────────────────────────────────────── */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("createdCourses", "title thumbnail averageRating enrollmentCount isPublished");
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch user", error: err.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { role: "instructor", isActive: true, isDeleted: { $ne: true } } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from:         "courses",
          localField:   "_id",
          foreignField: "instructor",
          as:           "coursesDocs",
        },
      },
      {
        $lookup: {
          from:         "enrollments",
          localField:   "coursesDocs._id",
          foreignField: "course",
          as:           "studentEnrollments",
        },
      },
      {
        $addFields: {
          coursesCount:  { $size: "$coursesDocs" },
          studentsCount: { $size: "$studentEnrollments" },
        },
      },
      {
        $project: {
          coursesDocs:        0,
          studentEnrollments: 0,
          password:           0,
        },
      },
    ]);

    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch instructors", error: err.message });
  }
};