const jwt  = require("jsonwebtoken");
const User = require("../models/User");

/* ── Require valid JWT ───────────────────────────────────────── */
const protect = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : req.cookies?.token;

  if (!token)
    return res.status(401).json({ success: false, message: "Not authorized — no token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, message: "User no longer exists" });
    if (!user.isActive)
      return res.status(401).json({ success: false, message: "Account suspended" });
    req.user = user;
    next();
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
    return res.status(401).json({ success: false, message: msg });
  }
};

/* ── Require specific roles ─────────────────────────────────── */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: "Not authenticated" });
  if (!roles.includes(req.user.role))
    return res.status(403).json({
      success: false,
      message: `Role '${req.user.role}' is not authorized for this action`,
    });
  next();
};

/* ── Shorthand — admin only ─────────────────────────────────── */
const admin = authorize("admin");

/* ── Optional auth — attach user if token present ───────────── */
const optionalAuth = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch {
      // ignore — token invalid or expired, continue as unauthenticated
    }
  }
  next();
};

const checkAccess = async (req, res, next) => {
  const Enrollment = require("../models/Enrollment");
  
  // Find enrollment for this user and the requested course
  const enrollment = await Enrollment.findOne({ 
    student: req.user.id, 
    course: req.params.courseId || req.body.courseId 
  });

  if (!enrollment) {
    return res.status(403).json({ success: false, message: "Not enrolled in this course" });
  }

  // If trial is over, block access
  if (enrollment.status === "expired") {
    return res.status(402).json({ 
      success: false, 
      message: "Your 7-day trial has ended. Please purchase the course to continue.",
      requiresPayment: true 
    });
  }

  next();
};

module.exports = { protect, authorize, admin, optionalAuth, checkAccess };

