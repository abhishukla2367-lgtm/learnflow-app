const { Enrollment, Course, Certificate } = require('../models/index');
const mongoose = require('mongoose');

// Helper to get socket broadcast (won't crash if socket not ready)
function getBroadcast() {
  try { return require('../socket').broadcast; } catch { return null; }
}

// ─── 1. Enroll (Handle Trial & Paid) ─────────────────────────────────────────
exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    // Try Course first, then Certificate
    let product = await Course.findById(courseId);
    let courseModel = "Course";
    if (!product) {
      product = await Certificate.findById(courseId);
      courseModel = "Certificate";
    }
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Course or Certification not found." });
    }

    const existing = await Enrollment.findOne({ student: userId, course: courseId });
    
    if (existing) {
      return res.status(200).json({ 
        success: true, 
        message: "Redirecting to course...", 
        enrollment: existing,
        alreadyEnrolled: true 
      });
    }

    // Build certData snapshot for safety (Lessons fallback)
    const certData = {
      title:       product.title       || "",
      thumbnail:   product.thumbnail   || "",
      instructor:  product.instructor?.toString() || "",
      description: product.description || product.desc || "",
      emoji:       product.emoji       || "",
      tag:         product.tag         || product.category || "",
      lessons:     product.lessons     || [], 
    };

    const isTrial = req.body.type === 'trial' || (product.price !== undefined && product.price === 0);
    const trialEndsAt = isTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;
    
    const newEnrollment = await Enrollment.create({
      student:     userId,
      course:      courseId,
      courseModel,
      certData,
      amount:      req.body.amount || product.price || 0,
      type:        isTrial ? 'trial' : (product.price > 0 ? 'paid' : 'free'),
      status:      isTrial ? 'trialing' : 'enrolled',
      isTrial:     isTrial,
      trialEndsAt: trialEndsAt,
      enrolledAt:  Date.now(),
    });
    
    // Real-time: notify the student's socket room
    const broadcast = getBroadcast();
    if (broadcast) {
      const io = (() => { try { return require('../socket').getIO(); } catch { return null; } })();
      if (io) {
        io.to(`user:${userId}`).emit('enrollment:confirmed', {
          enrollmentId: newEnrollment._id,
          certId:       courseId,
          course:       { ...certData, _id: courseId },
          progress:     0,
          enrolledAt:   newEnrollment.enrolledAt,
        });
      }
      broadcast.newEnrollment({
        studentName: req.user.name || req.user.email,
        courseName:  product.title,
        courseId,
      });
    }

    res.status(201).json({ 
      success: true, 
      enrollment: newEnrollment, 
      courseId: courseId, // Ensure frontend gets the ID explicitly
      isTrial: isTrial,
      trialEndsAt: trialEndsAt 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 2. Get My Enrollments (For Dashboard) ───────────────────────────────────
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id })
      .populate('course')
      .sort({ enrolledAt: -1 })
      .lean();

    const normalized = enrollments.map(e => {
      const populated = e.course && typeof e.course === 'object' ? e.course : null;
      const snap = e.certData || {};

      return {
        ...e,
        courseModel: e.courseModel, // Tells frontend if it's 'Course' or 'Certificate'
        course: {
          ...(populated || {}),
          _id: (populated?._id || e.course || e._id).toString(),
          id: (populated?._id || e.course || e._id).toString(),
          title: populated?.title || snap.title || 'Untitled',
          thumbnail: populated?.thumbnail || snap.thumbnail || '',
          instructor: populated?.instructor || snap.instructor || '',
          description: populated?.description || snap.description || '',
          emoji: populated?.emoji || snap.emoji || '',
          tag: populated?.tag || populated?.category || snap.tag || '',
          lessons: populated?.lessons || snap.lessons || [],
        },
      };
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 3. Get Enrollment Detail (For the Course Player) ────────────────────────
exports.getEnrollmentDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ 
      student: userId, 
      course: courseId 
    }).populate('course').lean();

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // Fallback logic: Ensure 'course' object always has lessons for the player
    if (!enrollment.course || !enrollment.course.lessons) {
      enrollment.course = {
        ...(enrollment.course || {}),
        _id: courseId,
        lessons: enrollment.certData?.lessons || [],
        title: enrollment.certData?.title || "Untitled Course"
      };
    }

    res.status(200).json({ success: true, enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch detail", error: error.message });
  }
};

// ─── 4. Update Progress ──────────────────────────────────────────────────────
exports.updateProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ 
      student: userId, 
      course: courseId 
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    if (req.body.progress !== undefined) {
      enrollment.progress = req.body.progress;
    }
    
    if (req.body.progress === 100) { 
      enrollment.isCompleted = true; 
      enrollment.completedAt = new Date(); 
    }
    
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};