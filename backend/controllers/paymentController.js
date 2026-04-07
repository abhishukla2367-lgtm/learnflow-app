// controllers/paymentController.js
const crypto      = require("crypto");
const Course      = require("../models/Course");
const Payment     = require("../models/Payment");
const Enrollment  = require("../models/Enrollment");
const Notification = require("../models/Notification");
const User         = require("../models/User");
const { broadcast } = require("../socket");

/* ── POST /api/payments/initiate ─────────────────────────────── */
exports.initiatePayment = async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  if (!course.isPublished) return res.status(400).json({ success: false, message: "Course not available" });
  if (await Enrollment.findOne({ student: req.user.id, course: courseId }))
    return res.status(400).json({ success: false, message: "Already enrolled" });

  if (course.isFree || course.price === 0) {
    const enrollment = await Enrollment.create({ student: req.user.id, course: courseId });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: course._id } });
    try { broadcast.newEnrollment({ studentName: req.user.name, courseName: course.title, courseId: course._id }); } catch {}
    return res.status(201).json({ success: true, free: true, enrollment });
  }

  const discountAmt = course.discount > 0 ? Math.round((course.price * course.discount) / 100) : 0;
  const finalAmount = course.price - discountAmt;
  const payment = await Payment.create({
    student: req.user.id, course: courseId,
    amount: course.price, finalAmount, discountApplied: discountAmt,
    status: "pending", method: "razorpay",
    invoiceId: `INV-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
  });

  res.status(201).json({ success: true, free: false, payment: {
    _id: payment._id, amount: finalAmount, currency: payment.currency,
    invoiceId: payment.invoiceId, courseName: course.title,
  }});
};

/* ── POST /api/payments/verify ───────────────────────────────── */
exports.verifyPayment = async (req, res) => {
  const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const payment = await Payment.findById(paymentId);
  if (!payment || payment.student.toString() !== req.user.id)
    return res.status(404).json({ success: false, message: "Payment not found" });

  if (razorpaySignature && process.env.RAZORPAY_KEY_SECRET) {
    const body     = razorpayOrderId + "|" + razorpayPaymentId;
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
    if (expected !== razorpaySignature) {
      payment.status = "failed"; await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  }

  payment.status = "completed"; payment.razorpayOrderId = razorpayOrderId;
  payment.razorpayPaymentId = razorpayPaymentId; payment.razorpaySignature = razorpaySignature;
  payment.paidAt = Date.now(); await payment.save();

  const course = await Course.findById(payment.course);
  if (!await Enrollment.findOne({ student: req.user.id, course: payment.course })) {
    await Enrollment.create({ student: req.user.id, course: payment.course });
    await Course.findByIdAndUpdate(payment.course, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: payment.course } });
  }

  try {
    await Notification.create({ recipient: req.user.id, type: "payment", title: "Payment Successful",
      message: `Payment for "${course?.title}" confirmed. You are now enrolled!`,
      link: `/learn/${payment.course}`, metadata: { paymentId: payment._id } });
    broadcast.newPayment({ amount: payment.finalAmount, studentName: req.user.name, courseName: course?.title });
    broadcast.newEnrollment({ studentName: req.user.name, courseName: course?.title, courseId: payment.course });
  } catch {}

  res.json({ success: true, message: "Payment verified and enrollment confirmed" });
};

/* ── GET /api/payments/my ────────────────────────────────────── */
exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ student: req.user.id })
    .populate("course", "title thumbnail price").sort({ createdAt: -1 });
  res.json({ success: true, payments });
};

/* ── GET /api/payments/admin/all ─────────────────────────────── */
exports.adminAllPayments = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const pageNum = Math.max(1, Number(page)), limitNum = Math.min(100, Number(limit));
  const query = {}; if (status) query.status = status;
  const [total, payments, revenueAgg] = await Promise.all([
    Payment.countDocuments(query),
    Payment.find(query).populate("student","name email avatar").populate("course","title thumbnail")
      .sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum),
    Payment.aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$finalAmount" } } }]),
  ]);
  res.json({ success: true, payments, total, page: pageNum, totalRevenue: revenueAgg[0]?.total || 0 });
};
