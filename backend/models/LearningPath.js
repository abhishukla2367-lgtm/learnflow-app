const mongoose = require("mongoose");

const pathSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  icon:        { type: String, default: "🎓" },
  thumbnail:   { type: String, default: "" },
  courses:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  duration:    { type: String, default: "3-6 months" },
  difficulty:  { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  isPublished: { type: Boolean, default: true },
  enrollCount: { type: Number, default: 0 },
  tags:        [String],
  outcomes:    [String],
}, { timestamps: true });

pathSchema.index({ isPublished: 1 });

module.exports = mongoose.models.LearningPath || mongoose.model("LearningPath", pathSchema);
