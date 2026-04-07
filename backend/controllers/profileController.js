// controllers/profileController.js
const mongoose   = require("mongoose");
const User       = require("../models/User");
const Enrollment = require("../models/Enrollment");
const Certificate = require("../models/Certificate");
const Payment     = require("../models/Payment");

/* ── GET /api/profile ─────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id || req.user.id);

    const [user, enrollments, certificates, payments] = await Promise.all([
      User.findById(userId).select("-password"),
      Enrollment.find({ student: userId })
        .populate("course", "title thumbnail category difficulty totalLessons totalDuration averageRating")
        .sort({ lastAccessedAt: -1 }),
      Certificate.find({ student: userId })
        .populate("course", "title thumbnail")
        .sort({ issuedAt: -1 }),
      Payment.find({ student: userId, status: "completed" })
        .populate("course", "title price")
        .sort({ createdAt: -1 }),
    ]);

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      user,
      enrollments:  enrollments  || [],
      certificates: certificates || [],
      payments:     payments     || [],
    });
  } catch (err) {
    console.error("Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Could not load profile data.", error: err.message });
  }
};

/* ── PUT /api/profile/update ─────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const ALLOWED = ["name", "bio", "avatar", "headline", "website", "social"];
    const updates = {};
    ALLOWED.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (updates.name && !updates.name.trim())
      return res.status(400).json({ success: false, message: "Name cannot be empty" });

    const userId      = req.user._id || req.user.id;
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select("-password");

    if (!updatedUser)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};
