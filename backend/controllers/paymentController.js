// controllers/paymentController.js
const crypto     = require("crypto");
const Course     = require("../models/Course");
const Payment    = require("../models/Payment");
const Enrollment = require("../models/Enrollment");
const User       = require("../models/User");
const notify     = require("../utils/notify");
const { broadcast } = require("../socket");

/* ── POST /api/payments/initiate ─────────────────────────────── */
exports.initiatePayment = async (req, res) => {
  const { courseId } = req.body;

  const course = await Course.findById(courseId);
  if (!course)
    return res.status(404).json({ success: false, message: "Course not found" });
  if (!course.isPublished)
    return res.status(400).json({ success: false, message: "Course not available" });
  if (await Enrollment.findOne({ student: req.user.id, course: courseId }))
    return res.status(400).json({ success: false, message: "Already enrolled" });

  /* ── Free / trial path ── */
  if (course.isFree || course.price === 0) {
    const trialDuration = 7;
    const trialEndsAt   = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDuration);

    await Enrollment.create({
      student:    req.user.id,
      course:     courseId,
      status:     "trialing",
      type:       "free",
      trialEndsAt,
      certData: {
        title:      course.title,
        thumbnail:  course.thumbnail,
        instructor: course.instructor?.name || "Instructor",
      },
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: courseId } });

    // Broadcast to admin dashboards
    try {
      broadcast.newEnrollment({
        studentName: req.user.name,
        courseName:  course.title,
        courseId:    course._id,
      });
    } catch { /* non-critical */ }

    // Notify the student
    await notify(req.user.id, {
      type:    "enrollment",
      title:   `Your 7-day free trial has started! 🎉`,
      message: `You now have full access to "${course.title}" until ${trialEndsAt.toLocaleDateString("en-IN")}. Enjoy learning!`,
      link:    "/my-courses",
      metadata: { courseId: String(courseId), courseTitle: course.title, isTrial: true },
    });

    return res.status(201).json({
      success:  true,
      isTrial:  true,
      trialEndsAt,
      message:  "Your 7-day free trial has started!",
    });
  }

  /* ── Paid path — create pending payment ── */
  const discountAmt = course.discount > 0
    ? Math.round((course.price * course.discount) / 100)
    : 0;
  const finalAmount = course.price - discountAmt;

  const payment = await Payment.create({
    student:         req.user.id,
    course:          courseId,
    amount:          course.price,
    finalAmount,
    discountApplied: discountAmt,
    status:          "pending",
    method:          "razorpay",
    invoiceId:       `INV-${Date.now()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
  });

  res.status(201).json({
    success: true,
    free:    false,
    payment: {
      _id:        payment._id,
      amount:     finalAmount,
      currency:   payment.currency,
      invoiceId:  payment.invoiceId,
      courseName: course.title,
    },
  });
};

/* ── POST /api/payments/verify ───────────────────────────────── */
exports.verifyPayment = async (req, res) => {
  const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment || payment.student.toString() !== req.user.id)
    return res.status(404).json({ success: false, message: "Payment not found" });

  /* ── Razorpay signature verification ── */
  if (razorpaySignature && process.env.RAZORPAY_KEY_SECRET) {
    const body     = razorpayOrderId + "|" + razorpayPaymentId;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpaySignature) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  }

  /* ── Mark payment complete ── */
  payment.status              = "completed";
  payment.razorpayOrderId     = razorpayOrderId;
  payment.razorpayPaymentId   = razorpayPaymentId;
  payment.razorpaySignature   = razorpaySignature;
  payment.paidAt              = Date.now();
  await payment.save();

  const course = await Course.findById(payment.course);

  /* ── Create enrollment if it doesn't already exist ── */
  const alreadyEnrolled = await Enrollment.findOne({
    student: req.user.id,
    course:  payment.course,
  });

  if (!alreadyEnrolled) {
    await Enrollment.create({
      student:  req.user.id,
      course:   payment.course,
      type:     "paid",
      status:   "enrolled",
      amount:   payment.finalAmount,
      certData: {
        title:      course?.title      || "",
        thumbnail:  course?.thumbnail  || "",
        instructor: course?.instructor?.toString() || "",
      },
    });
    await Course.findByIdAndUpdate(payment.course, { $inc: { enrollmentCount: 1 } });
    await User.findByIdAndUpdate(req.user.id, { $addToSet: { enrolledCourses: payment.course } });
  }

  /* ── Notify student: payment confirmed ── */
  await notify(req.user.id, {
    type:    "payment",
    title:   "Payment Confirmed ✅",
    message: `Your payment of ₹${payment.finalAmount} for "${course?.title}" was successful. You're now enrolled!`,
    link:    "/my-courses",
    metadata: {
      paymentId:   String(payment._id),
      courseId:    String(payment.course),
      courseTitle: course?.title || "",
      amount:      payment.finalAmount,
    },
  });

  /* ── Notify student: enrollment ── */
  await notify(req.user.id, {
    type:    "enrollment",
    title:   `Welcome to "${course?.title}"! 🎉`,
    message: "Your course is ready. Start learning now and track your progress.",
    link:    "/my-courses",
    metadata: { courseId: String(payment.course), courseTitle: course?.title || "" },
  });

  /* ── Broadcast to admin dashboards ── */
  try {
    broadcast.newPayment({
      amount:      payment.finalAmount,
      studentName: req.user.name,
      courseName:  course?.title,
    });
    broadcast.newEnrollment({
      studentName: req.user.name,
      courseName:  course?.title,
      courseId:    payment.course,
    });
  } catch { /* non-critical */ }

  res.json({ success: true, message: "Payment verified and enrollment confirmed" });
};

/* ── GET /api/payments/my ────────────────────────────────────── */
exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ student: req.user.id })
    .populate("course", "title thumbnail price")
    .sort({ createdAt: -1 });
  res.json({ success: true, payments });
};

/* ── GET /api/payments/admin/all ─────────────────────────────── */
exports.adminAllPayments = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(100, Number(limit));
  const query    = {};
  if (status) query.status = status;

  const [total, payments, revenueAgg] = await Promise.all([
    Payment.countDocuments(query),
    Payment.find(query)
      .populate("student", "name email avatar")
      .populate("course",  "title thumbnail")
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$finalAmount" } } },
    ]),
  ]);

  res.json({
    success:      true,
    payments,
    total,
    page:         pageNum,
    totalRevenue: revenueAgg[0]?.total || 0,
  });
};