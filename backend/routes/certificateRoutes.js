const express = require("express");
const router  = express.Router();

const {
  issueCertificate,
  getMyCertificates,
  verifyCertificate,
} = require("../controllers/certificateController");

const { protect } = require("../middleware/authMiddleware");

// ── Models used directly in this route file ────────────────────
const Certificate = require("../models/Certificate");
const Enrollment  = require("../models/Enrollment");

/**
 * @route   GET /api/certificates
 * @desc    Get all certificates of the logged-in student
 * @access  Private
 */
router.get("/", protect, getMyCertificates);

/**
 * @route   GET /api/certificates/verify/:credentialId
 * @desc    Publicly verify a certificate by its credential ID
 * @access  Public
 * ⚠️  Must be defined BEFORE /:courseId to avoid Express treating "verify" as a courseId
 */
router.get("/verify/:credentialId", verifyCertificate);

/**
 * @route   POST /api/certificates/:courseId
 * @desc    Issue a certificate for a completed course
 * @access  Private
 */
router.post("/:courseId", protect, issueCertificate);

module.exports = router;
