const express = require("express");
const router = express.Router();

// Import controllers - Ensure the path to otpController is 100% correct
const otpController = require("../controllers/otpController");

/**
 * @route   POST /api/otp/send-otp
 */
router.post("/send-otp", otpController.sendOTP);

/**
 * @route   POST /api/otp/verify-otp
 */
router.post("/verify-otp", otpController.verifyOTP);

/**
 * @route   POST /api/otp/resend-otp
 */
router.post("/resend-otp", otpController.resendOTP);

module.exports = router;