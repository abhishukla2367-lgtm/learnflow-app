const express = require("express");
const router  = express.Router();

const {
  getMyNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Notification = require("../models/Notification");

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for current user (with unread count)
 * @access  Private
 */
router.get("/", protect, getMyNotifications);

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 * ⚠️  Must be BEFORE /:id
 */
router.patch("/read-all", protect, markAllRead);

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark single notification as read
 * @access  Private
 */
router.patch("/:id/read", protect, markRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete("/:id", protect, deleteNotification);

module.exports = router;
