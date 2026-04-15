const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // courseModel lets Mongoose populate from either Course or Certificate
  courseModel: { type: String, enum: ["Course", "Certificate"], default: "Course" },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "courseModel",
  },

  // Snapshot saved at enroll time — MyCourses always has data even if populate fails
  certData: {
    title:       { type: String, default: "" },
    thumbnail:   { type: String, default: "" },
    instructor:  { type: String, default: "" },
    description: { type: String, default: "" },
    emoji:       { type: String, default: "" },
    tag:         { type: String, default: "" },
    lessons:     { type: Array,  default: [] }
  },

  status:    { type: String, enum: ["enrolled", "completed", "refunded", "trialing", "expired"], default: "enrolled" },
  isTrial:   { type: Boolean, default: false }, 
  trialEndsAt: { type: Date },
  isAutoChargeEnabled: { type: Boolean, default: true },
  amount:    { type: Number, default: 0 },
  type:      { type: String, enum: ["paid", "free", "trial"], default: "paid" },

  completedLessons: [{
    lessonId:    { type: mongoose.Schema.Types.ObjectId },
    completedAt: { type: Date, default: Date.now },
  }],
  progress:       { type: Number, default: 0, min: 0, max: 100 },
  isCompleted:    { type: Boolean, default: false },
  completedAt:    { type: Date },
  enrolledAt:     { type: Date, default: Date.now },
  lastAccessedAt: { type: Date, default: Date.now },
  lastLessonId:   { type: mongoose.Schema.Types.ObjectId },
  timeSpent:      { type: Number, default: 0 },
  isDeleted:      { type: Boolean, default: false },
  deletedAt:      { type: Date }
}, { timestamps: true });

enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ student: 1, lastAccessedAt: -1 });

module.exports = mongoose.models.Enrollment || mongoose.model("Enrollment", enrollmentSchema);
