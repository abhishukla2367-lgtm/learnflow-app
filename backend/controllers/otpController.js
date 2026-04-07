const jwt = require("jsonwebtoken");
const OTP = require("../models/OTP");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");
const { broadcast } = require("../socket");

// Helper to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ── POST /api/otp/send-otp ──────────────────────────────────── */
exports.sendOTP = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // 1. Validation
    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required" });
    }
    
    const cleanEmail = email.toLowerCase().trim();

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    
    // Check if user already exists in the main User collection
    if (await User.findOne({ email: cleanEmail })) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // 2. Generate Data
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    // 3. Upsert OTP (Delete old pending record for this email, Create new)
    await OTP.findOneAndDelete({ email: cleanEmail });
    await OTP.create({ 
      email: cleanEmail, 
      otp, 
      name: name.trim(), 
      password, // Stored temporarily until verification
      expiresAt 
    });

    // 4. Send Email
    await sendEmail({
      to: cleanEmail,
      subject: "LearnFlow — Your OTP Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
          <h2 style="color: #0891b2;">Welcome to LearnFlow!</h2>
          <p>Hi ${name.trim()},</p>
          <p>Use the code below to verify your email and complete your registration:</p>
          <div style="background: #f1f5f9; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0891b2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 14px; color: #64748b;">This OTP is valid for <b>10 minutes</b>. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error("❌ sendOTP Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to send OTP. Please check your email configuration." });
  }
};

/* ── POST /api/otp/verify-otp ────────────────────────────────── */
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const record = await OTP.findOne({ email: cleanEmail });

    // 1. Checks
    if (!record) {
      return res.status(400).json({ success: false, message: "OTP not found. Request a new one." });
    }
    
    if (new Date() > record.expiresAt) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    if (record.otp !== otp.toString()) {
      return res.status(400).json({ success: false, message: "Invalid OTP code." });
    }

    // 2. Final Check for existing registration
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      await OTP.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "User already verified and registered." });
    }

    // 3. Create User from the data stored in the OTP record
    const user = await User.create({
      name: record.name,
      email: record.email,
      password: record.password, // Mongoose pre-save hook in User model hashes this
      role: "student",
      isVerified: true,
      isActive: true
    });

    // 4. Cleanup OTP & Generate Token
    await OTP.deleteOne({ _id: record._id });

    try { broadcast.newUser(user); } catch (e) { /* ignore socket errors */ }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "30d" }
    );

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    console.error("❌ verifyOTP Error:", err.message);
    res.status(500).json({ success: false, message: "Registration failed.", error: err.message });
  }
};

/* ── POST /api/otp/resend-otp ────────────────────────────────── */
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    
    // 1. Find the existing pending registration record
    const record = await OTP.findOne({ email: cleanEmail });
    if (!record) {
      return res.status(404).json({ 
        success: false, 
        message: "No pending registration found for this email. Please sign up again." 
      });
    }

    // 2. Generate new OTP and reset expiration
    const newOtp = generateOTP();
    record.otp = newOtp;
    record.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Reset to 10 more minutes
    await record.save();

    // 3. Resend the Email
    await sendEmail({
      to: cleanEmail,
      subject: "LearnFlow — Your NEW OTP Code",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px;">
          <h2 style="color: #0891b2;">Resending your OTP</h2>
          <p>Hi ${record.name},</p>
          <p>We received a request to resend your verification code. Here is your new code:</p>
          <div style="background: #f1f5f9; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #0891b2; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            ${newOtp}
          </div>
          <p style="font-size: 14px; color: #64748b;">This OTP is valid for <b>10 minutes</b>.</p>
        </div>
      `,
    });

    res.json({ success: true, message: "A new OTP has been sent to your email." });
  } catch (err) {
    console.error("❌ resendOTP Error:", err.message);
    res.status(500).json({ success: false, message: "Failed to resend OTP." });
  }
};