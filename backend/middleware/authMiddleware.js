// middleware/authMiddleware.js
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

module.exports = { protect, authorize, admin, optionalAuth };
