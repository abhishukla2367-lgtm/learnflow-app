// controllers/certificateController.js
const { randomBytes } = require("crypto");
const Certificate  = require("../models/Certificate");
const Enrollment   = require("../models/Enrollment");
const notify       = require("../utils/notify");
const { broadcast } = require("../socket");

/* ── POST /api/certificates/:courseId ────────────────────────── */
exports.issueCertificate = async (req, res) => {
  const enrollment = await Enrollment.findOne({
    student: req.user.id,
    course:  req.params.courseId,
  }).populate("course", "title");

  if (!enrollment || !enrollment.isCompleted)
    return res.status(400).json({
      success: false,
      message: "You must complete the course first",
    });

  if (enrollment.isTrial)
    return res.status(403).json({
      success: false,
      message:
        "Certificates are not available during the 7-day trial. Please upgrade to a paid plan to unlock your official certification.",
    });

  let cert = await Certificate.findOne({
    student: req.user.id,
    course:  req.params.courseId,
  });

  if (!cert) {
    cert = await Certificate.create({
      student:      req.user.id,
      course:       req.params.courseId,
      enrollment:   enrollment._id,
      credentialId: `LF-${Date.now()}-${randomBytes(4).toString("hex").toUpperCase()}`,
    });

    const courseTitle = enrollment.course?.title || "your course";

    // Notify student — creates DB record + pushes socket event
    await notify(req.user.id, {
      type:    "certificate",
      title:   "🎓 Certificate Issued!",
      message: `Your certificate for "${courseTitle}" is ready. Download and share it with the world!`,
      link:    `/course-certificate/${req.params.courseId}`,
      metadata: { certificateId: String(cert._id), courseId: String(req.params.courseId) },
    });

    // Also push a raw socket event so any open tab gets it instantly
    try {
      broadcast.sendNotification(String(req.user.id), {
        _id:     cert._id,
        type:    "certificate",
        title:   "🎓 Certificate Issued!",
        message: `Your certificate for "${courseTitle}" is ready to download.`,
        link:    `/course-certificate/${req.params.courseId}`,
        isRead:  false,
        createdAt: new Date().toISOString(),
      });
    } catch { /* socket not ready — notification already saved in DB */ }
  }

  await cert.populate([
    { path: "student",    select: "name email" },
    { path: "course",     select: "title instructor" },
    { path: "enrollment", select: "completedAt progress" },
  ]);

  res.json({ success: true, certificate: cert });
};

/* ── GET /api/certificates ───────────────────────────────────── */
exports.getMyCertificates = async (req, res) => {
  const certs = await Certificate.find({ student: req.user.id })
    .populate("course", "title thumbnail instructor")
    .sort({ issuedAt: -1 });
  res.json({ success: true, certificates: certs });
};

/* ── GET /api/certificates/verify/:credentialId ─────────────── */
exports.verifyCertificate = async (req, res) => {
  const cert = await Certificate.findOne({ credentialId: req.params.credentialId })
    .populate("student", "name")
    .populate("course",  "title instructor");

  if (!cert)
    return res.status(404).json({ success: false, message: "Certificate not found or invalid" });

  res.json({
    success:  true,
    isValid:  true,
    certificate: {
      credentialId: cert.credentialId,
      studentName:  cert.student?.name,
      courseTitle:  cert.course?.title,
      issuedAt:     cert.issuedAt,
      grade:        cert.grade,
    },
  });
};