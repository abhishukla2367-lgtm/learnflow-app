// controllers/wishlistController.js
const Wishlist = require("../models/Wishlist");
const Course   = require("../models/Course");

/* ── GET /api/wishlist ───────────────────────────────────────── */
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ student: req.user.id })
      .populate("courses", "title thumbnail price isFree category difficulty averageRating instructor enrollmentCount");
    if (!wishlist) wishlist = { courses: [] };
    res.json({ success: true, courses: wishlist.courses });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch wishlist", error: err.message });
  }
};

/* ── POST /api/wishlist/:courseId ────────────────────────────── */
exports.addToWishlist = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    let wishlist = await Wishlist.findOne({ student: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ student: req.user.id, courses: [req.params.courseId] });
    } else {
      if (wishlist.courses.map(String).includes(req.params.courseId))
        return res.status(400).json({ success: false, message: "Course already in wishlist" });
      wishlist.courses.push(req.params.courseId);
      await wishlist.save();
    }
    res.status(201).json({ success: true, message: "Course added to wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add to wishlist", error: err.message });
  }
};

/* ── DELETE /api/wishlist/:courseId ──────────────────────────── */
exports.removeFromWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ student: req.user.id });
    if (!wishlist)
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    wishlist.courses = wishlist.courses.filter((id) => id.toString() !== req.params.courseId);
    await wishlist.save();
    res.json({ success: true, message: "Course removed from wishlist" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove from wishlist", error: err.message });
  }
};

/* ── DELETE /api/wishlist (clear all) ────────────────────────── */
exports.clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate({ student: req.user.id }, { courses: [] });
    res.json({ success: true, message: "Wishlist cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear wishlist", error: err.message });
  }
};
