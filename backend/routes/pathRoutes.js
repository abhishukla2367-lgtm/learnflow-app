const express = require("express");
const router  = express.Router();

const {
  getPaths,
  getPath,
  createPath,
  updatePath,
  deletePath,
} = require("../controllers/pathController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const LearningPath = require("../models/LearningPath");

/**
 * @route   GET /api/paths
 * @desc    Get all published learning paths with courses
 * @access  Public
 */
router.get("/", getPaths);

/**
 * @route   GET /api/paths/:id
 * @desc    Get single learning path details
 * @access  Public
 */
router.get("/:id", getPath);

/**
 * @route   POST /api/paths
 * @desc    Create a new learning path
 * @access  Private (admin only)
 */
router.post("/", protect, authorize("admin"), createPath);

/**
 * @route   PUT /api/paths/:id
 * @desc    Update a learning path
 * @access  Private (admin only)
 */
router.put("/:id", protect, authorize("admin"), updatePath);

/**
 * @route   DELETE /api/paths/:id
 * @desc    Delete a learning path
 * @access  Private (admin only)
 */
router.delete("/:id", protect, authorize("admin"), deletePath);

module.exports = router;
