// controllers/pathController.js
const LearningPath = require("../models/LearningPath");

/* ── GET /api/paths ──────────────────────────────────────────── */
exports.getPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({ isPublished: true })
      .populate("courses", "title thumbnail category difficulty averageRating enrollmentCount")
      .sort({ enrollCount: -1 });
    res.json({ success: true, paths });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch learning paths", error: err.message });
  }
};

/* ── GET /api/paths/:id ──────────────────────────────────────── */
exports.getPath = async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id)
      .populate("courses", "title thumbnail category difficulty averageRating enrollmentCount instructor");
    if (!path)
      return res.status(404).json({ success: false, message: "Learning path not found" });
    res.json({ success: true, path });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch path", error: err.message });
  }
};

/* ── POST /api/paths ─────────────────────────────────────────── */
exports.createPath = async (req, res) => {
  try {
    const path = await LearningPath.create(req.body);
    res.status(201).json({ success: true, path });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create path", error: err.message });
  }
};

/* ── PUT /api/paths/:id ──────────────────────────────────────── */
exports.updatePath = async (req, res) => {
  try {
    const path = await LearningPath.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!path)
      return res.status(404).json({ success: false, message: "Learning path not found" });
    res.json({ success: true, path });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update path", error: err.message });
  }
};

/* ── DELETE /api/paths/:id ───────────────────────────────────── */
exports.deletePath = async (req, res) => {
  try {
    const path = await LearningPath.findByIdAndDelete(req.params.id);
    if (!path)
      return res.status(404).json({ success: false, message: "Learning path not found" });
    res.json({ success: true, message: "Learning path deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete path", error: err.message });
  }
};
