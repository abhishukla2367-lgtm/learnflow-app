const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: "User",       required: true },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: "Course",     required: true },
  enrollment:   { type: mongoose.Schema.Types.ObjectId, ref: "Enrollment" },
  credentialId: { type: String, unique: true },
  issuedAt:     { type: Date, default: Date.now },
  grade:        { type: String, default: "Pass" },
}, { timestamps: true });

certificateSchema.index({ student: 1, course: 1 });

module.exports = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);
