const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true, lowercase: true },
  otp:       { type: String, required: true },
  name:      { type: String, default: "" },
  password:  { type: String, default: "" }, // pre-hashed password stored temporarily
  expiresAt: { type: Date,   required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) }, // 10 min
  verified:  { type: Boolean, default: false },
}, { timestamps: true });

// Auto-delete expired docs
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1 });

module.exports = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
