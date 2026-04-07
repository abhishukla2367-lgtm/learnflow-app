const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question:      { type: String, required: true },
  options:       [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  explanation:   { type: String, default: "" },
  points:        { type: Number, default: 1 },
});

const attemptSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers:     [Number],
  score:       { type: Number },
  passed:      { type: Boolean },
  timeTaken:   { type: Number }, // seconds
  attemptedAt: { type: Date, default: Date.now },
});

const quizSchema = new mongoose.Schema({
  course:      { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  section:     { type: mongoose.Schema.Types.ObjectId },
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  questions:   [questionSchema],
  timeLimit:    { type: Number, default: 30 },   // minutes
  passingScore: { type: Number, default: 70 },   // percent
  attempts:     [attemptSchema],
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

quizSchema.index({ course: 1, isActive: 1 });

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
