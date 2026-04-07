// controllers/notificationController.js
const Notification = require("../models/Notification");

/* ── GET /api/notifications ──────────────────────────────────── */
exports.getMyNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly } = req.query;
    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));
    const query    = { recipient: req.user.id };
    if (unreadOnly === "true") query.isRead = false;

    const [total, notifications, unreadCount] = await Promise.all([
      Notification.countDocuments(query),
      Notification.find(query)
        .populate("sender", "name avatar")
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Notification.countDocuments({ recipient: req.user.id, isRead: false }),
    ]);
    res.json({ success: true, notifications, total, unreadCount, page: pageNum });
  } catch (err) {
    console.error("❌ getMyNotifications:", err.message);
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: err.message });
  }
};

/* ── PATCH /api/notifications/:id/read ───────────────────────── */
exports.markRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true, readAt: Date.now() },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, notification });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark as read", error: err.message });
  }
};

/* ── PATCH /api/notifications/read-all ───────────────────────── */
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() }
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to mark all as read", error: err.message });
  }
};

/* ── DELETE /api/notifications/:id ──────────────────────────── */
exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    if (!notification)
      return res.status(404).json({ success: false, message: "Notification not found" });
    res.json({ success: true, message: "Notification deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete notification", error: err.message });
  }
};
