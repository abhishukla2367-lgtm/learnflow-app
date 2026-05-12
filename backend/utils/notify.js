// utils/notify.js
// ──────────────────────────────────────────────────────────────
// Drop-in helper: creates a Notification in MongoDB and
// immediately pushes it to the user's socket room.
//
// Usage (in any controller):
//   const notify = require('../utils/notify');
//   await notify(userId, {
//     type: 'enrollment',
//     title: 'You enrolled in React Masterclass!',
//     message: 'Your learning journey begins now. Good luck! 🚀',
//     link: '/my-courses',
//   });
// ──────────────────────────────────────────────────────────────

const Notification = require('../models/Notification');

/**
 * @param {string|ObjectId} recipientId  - The user to notify
 * @param {object} payload
 * @param {string} payload.type          - One of the enum values in Notification model
 * @param {string} payload.title
 * @param {string} payload.message
 * @param {string} [payload.link]        - Frontend route (e.g. '/my-courses')
 * @param {string|ObjectId} [payload.senderId] - Who triggered it (optional)
 * @param {object} [payload.metadata]    - Any extra data
 * @returns {Promise<Notification>}
 */
async function notify(recipientId, { type, title, message, link = '', senderId = null, metadata = {} }) {
  try {
    const doc = await Notification.create({
      recipient: recipientId,
      sender:    senderId || undefined,
      type,
      title,
      message,
      link,
      metadata,
    });

    // Push via Socket.io (non-blocking — if socket isn't ready, just skip)
    try {
      const { broadcast } = require('../socket');
      broadcast.sendNotification(String(recipientId), {
        _id:       doc._id,
        type:      doc.type,
        title:     doc.title,
        message:   doc.message,
        link:      doc.link,
        isRead:    false,
        createdAt: doc.createdAt,
        metadata:  doc.metadata,
      });
    } catch { /* socket not ready — notification still saved in DB */ }

    return doc;
  } catch (err) {
    // Never crash a controller because of a failed notification
    console.error('[notify] Failed to create notification:', err.message);
    return null;
  }
}

module.exports = notify;