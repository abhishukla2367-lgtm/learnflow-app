const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  body:      { type: String, required: true, maxlength: 2000 },
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
  course:    { type: mongoose.Schema.Types.ObjectId, ref: "Course",  required: true },
  lesson:    { type: mongoose.Schema.Types.ObjectId }, // optional — ties to a lesson
  author:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title:     { type: String, required: true, maxlength: 200 },
  body:      { type: String, required: true, maxlength: 5000 },
  replies:   [replySchema],
  likes:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isPinned:  { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  views:     { type: Number, default: 0 },
}, { timestamps: true });

discussionSchema.index({ course: 1, createdAt: -1 });
discussionSchema.index({ course: 1, isPinned: -1, createdAt: -1 });

module.exports = mongoose.models.Discussion || mongoose.model("Discussion", discussionSchema);
