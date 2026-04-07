// controllers/userController.js
const User = require("../models/User");

/* ── GET /api/users  — Admin: all users ─────────────────────── */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch users", error: err.message });
  }
};

/* ── GET /api/users/:id — Public: user profile ───────────────── */
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

/* ── GET /api/users/instructors — Public: all instructors ────── */
exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor", isActive: true })
      .select("-password")
      .populate("createdCourses", "title thumbnail averageRating enrollmentCount");
    res.json({ success: true, instructors });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch instructors", error: err.message });
  }
};
