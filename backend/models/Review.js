const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  course:     { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  student:    { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  title:      { type: String, default: "" },
  body:       { type: String, default: "" },
  helpful:    { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

reviewSchema.index({ course: 1, student: 1 }, { unique: true });
reviewSchema.index({ course: 1, rating: -1 });

module.exports = mongoose.models.Review || mongoose.model("Review", reviewSchema);
