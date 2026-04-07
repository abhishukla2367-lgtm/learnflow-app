// controllers/authController.js
const jwt    = require("jsonwebtoken");
const crypto = require("crypto");
const User   = require("../models/User");
const { broadcast } = require("../socket");
const sendEmail     = require("../utils/sendEmail");

/* ── Token helper ────────────────────────────────────────────── */
const sendToken = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "90d" }
  );
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:     user._id,
      name:   user.name,
      email:  user.email,
      role:   user.role,
      avatar: user.avatar,
    },
  });
};

/* ── POST /api/auth/register ─────────────────────────────────── */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password)
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  if (password.length < 6)
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(400).json({ success: false, message: "Email already registered" });

  // NEVER allow role to be set from request body — always default to student
  const user = await User.create({ name: name.trim(), email, password, role: "student" });

  // Broadcast new user to admin dashboards
  try { broadcast.newUser(user); } catch {}

  sendToken(user, 201, res);
};

/* ── POST /api/auth/login ────────────────────────────────────── */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  if (!user.isActive)
    return res.status(403).json({ success: false, message: "Account deactivated. Contact support." });

  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  sendToken(user, 200, res);
};

/* ── GET /api/auth/me ────────────────────────────────────────── */
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("enrolledCourses",  "title thumbnail category")
    .populate("createdCourses",   "title thumbnail enrollmentCount averageRating");
  res.json({ success: true, user });
};

/* ── PUT /api/auth/profile ───────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  const ALLOWED = ["name", "bio", "avatar", "headline", "website", "social"];
  const updates = {};
  ALLOWED.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (updates.name && !updates.name.trim())
    return res.status(400).json({ success: false, message: "Name cannot be empty" });

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
};

/* ── PUT /api/auth/password ──────────────────────────────────── */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)
    return res.status(400).json({ success: false, message: "Both passwords are required" });
  if (newPassword.length < 6)
    return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.comparePassword(currentPassword)))
    return res.status(400).json({ success: false, message: "Current password is incorrect" });

  user.password = newPassword;
  await user.save();
  sendToken(user, 200, res);
};

/* ── POST /api/auth/forgot-password ─────────────────────────── */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ success: false, message: "Email is required" });

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user)
    return res.status(404).json({ success: false, message: "No account found with that email" });

  const resetToken   = crypto.randomBytes(32).toString("hex");
  const hashedToken  = crypto.createHash("sha256").update(resetToken).digest("hex");

  user.resetPasswordToken  = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to:      user.email,
      subject: "LearnFlow — Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your LearnFlow account.</p>
        <p>Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;border-radius:8px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
    res.json({ success: true, message: "Password reset link sent to your email" });
  } catch (err) {
    user.resetPasswordToken  = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ success: false, message: "Email could not be sent" });
  }
};

/* ── POST /api/auth/reset-password/:token ────────────────────── */
exports.resetPassword = async (req, res) => {
  const { token }       = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken:  hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user)
    return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

  user.password            = newPassword;
  user.resetPasswordToken  = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
};

/* ── DELETE /api/auth/account ────────────────────────────────── */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const Enrollment  = require('../models/Enrollment');
    const Certificate = require('../models/Certificate');

    // Remove all enrollments and certificates belonging to this user
    await Enrollment.deleteMany({ student: userId });
    await Certificate.deleteMany({ user: userId }).catch(() => {}); // soft fail if model differs

    await User.findByIdAndDelete(userId);

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
