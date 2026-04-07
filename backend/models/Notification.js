const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: {
    type: String,
    enum: [
      "enrollment",       // someone enrolled in your course
      "review",           // someone reviewed your course
      "course_published", // admin published/approved your course
      "quiz_passed",      // student passed a quiz
      "certificate",      // certificate issued
      "announcement",     // admin broadcast
      "progress",         // milestone reached (25%, 50%, 75%, 100%)
      "payment",          // payment confirmed
      "message",          // discussion message
    ],
    required: true,
  },
  title:    { type: String, required: true },
  message:  { type: String, required: true },
  link:     { type: String, default: "" }, // frontend route to navigate to
  isRead:   { type: Boolean, default: false },
  readAt:   { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }, // extra payload
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
