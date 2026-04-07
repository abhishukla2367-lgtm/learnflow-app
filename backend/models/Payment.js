const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  student:  { type: mongoose.Schema.Types.ObjectId, ref: "User",   required: true },
  course:   { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  amount:   { type: Number, required: true, min: 0 },
  currency: { type: String, default: "INR" },
  status: {
    type:    String,
    enum:    ["pending", "completed", "failed", "refunded"],
    default: "pending",
  },
  method: {
    type: String,
    enum: ["razorpay", "stripe", "upi", "free"],
    default: "razorpay",
  },
  razorpayOrderId:   { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  invoiceId:         { type: String, unique: true, sparse: true },
  couponCode:        { type: String, default: "" },
  discountApplied:   { type: Number, default: 0 },
  finalAmount:       { type: Number },
  paidAt:            { type: Date },
  refundedAt:        { type: Date },
  refundReason:      { type: String, default: "" },
}, { timestamps: true });

paymentSchema.index({ student: 1, status: 1 });
paymentSchema.index({ course: 1,  status: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
