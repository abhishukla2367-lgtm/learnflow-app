const { Enrollment, Course, Certificate } = require('../models/index');
const mongoose = require('mongoose');
const notify   = require('../utils/notify');

// Helper to get socket broadcast
function getBroadcast() {
  try { return require('../socket').broadcast; } catch { return null; }
}

// Helper to reliably extract flat lessons array from product or snapshot
function extractLessons(product) {
  if (!product) return [];
  if (Array.isArray(product.lessons) && product.lessons.length > 0) {
    return product.lessons;
  }
  if (Array.isArray(product.sections)) {
    return product.sections.flatMap(sec =>
      (sec.lessons || []).map(l => ({ ...l, weekLabel: l.weekLabel || sec.title }))
    );
  }
  return [];
}

// ─── 1. Enroll ───────────────────────────────────────────────────────────────
exports.enroll = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid ID format." });
    }

    let product = await Course.findById(courseId);
    let courseModel = "Course";
    if (!product) {
      product = await Certificate.findById(courseId);
      courseModel = "Certificate";
    }
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Course or Certification not found." });
    }

    const existing = await Enrollment.findOne({ 
      student: userId, 
      course: courseId,
      isDeleted: { $ne: true }
    });
    
    if (existing) {
      return res.status(200).json({ 
        success: true, 
        message: "Redirecting to course...", 
        enrollment: existing,
        alreadyEnrolled: true 
      });
    }

    const lessonsList = extractLessons(product);

    // Build certData snapshot
    const certData = {
      title:       product.title       || "",
      thumbnail:   product.thumbnail   || "",
      instructor:  product.instructor?.toString() || "",
      description: product.description || product.desc || "",
      emoji:       product.emoji       || "",
      tag:         product.tag         || product.category || "",
      lessons:     lessonsList
    };

    // Explicit check for trial vs free vs paid
    const isExplicitTrial = req.body.type === 'trial';
    const isFree = product.price === 0 || product.price === undefined;
    const isTrial = isExplicitTrial && !isFree;
    const trialEndsAt = isTrial ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null;
    
    const newEnrollment = await Enrollment.create({
      student:     userId,
      course:      courseId,
      courseModel,
      certData,
      amount:      req.body.amount || product.price || 0,
      type:        isTrial ? 'trial' : (isFree ? 'free' : 'paid'),
      status:      isTrial ? 'trialing' : 'enrolled',
      isTrial:     isTrial,
      trialEndsAt: trialEndsAt,
      enrolledAt:  Date.now(),
    });
    
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

    await notify(userId, {
      type:    'enrollment',
      title:   `You're enrolled in "${product.title}"! 🎉`,
      message: isTrial
        ? `Your 7-day free trial has started. Enjoy full access until ${trialEndsAt?.toLocaleDateString('en-IN')}.`
        : 'Your course is ready. Start learning now and track your progress.',
      link:    '/my-courses',
      metadata: { courseId: String(courseId), courseTitle: product.title },
    }).catch(e => console.error("Notification Error:", e));

    res.status(201).json({ 
      success: true, 
      enrollment: newEnrollment, 
      courseId: courseId,
      isTrial: isTrial,
      trialEndsAt: trialEndsAt 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 2. Get My Enrollments ───────────────────────────────────────────────────
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ 
      student: req.user._id,
      isDeleted: { $ne: true }
    })
      .populate('course')
      .sort({ enrolledAt: -1 })
      .lean();

    const normalized = enrollments.map(e => {
      const populated = e.course && typeof e.course === 'object' ? e.course : null;
      const snap = e.certData || {};
      const lessons = extractLessons(populated) || snap.lessons || [];

      return {
        ...e,
        courseModel: e.courseModel,
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
          lessons: lessons,
        },
      };
    });

    res.status(200).json(normalized);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── 3. Get Enrollment Detail ────────────────────────────────────────────────
exports.getEnrollmentDetail = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    const enrollment = await Enrollment.findOne({ 
      student: userId, 
      course: courseId,
      isDeleted: { $ne: true }
    }).populate('course').lean();

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    const populatedCourse = enrollment.course && typeof enrollment.course === 'object' ? enrollment.course : {};
    const lessons = extractLessons(populatedCourse).length > 0 
      ? extractLessons(populatedCourse) 
      : (enrollment.certData?.lessons || []);

    enrollment.course = {
      ...populatedCourse,
      _id: courseId,
      title: populatedCourse.title || enrollment.certData?.title || "Untitled Course",
      lessons: lessons
    };

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
      course: courseId,
      isDeleted: { $ne: true }
    }).populate('course', 'title');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    const prevProgress = enrollment.progress || 0;
    const newProgress  = req.body.progress !== undefined ? req.body.progress : prevProgress;

    if (req.body.progress !== undefined) {
      enrollment.progress = newProgress;
    }
    
    if (req.body.progress === 100) { 
      enrollment.isCompleted = true; 
      enrollment.completedAt = new Date(); 
    }
    
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();

    // Check milestones in DESCENDING order (100 -> 75 -> 50 -> 25)
    const courseTitle = enrollment.course?.title || enrollment.certData?.title || 'your course';
    const MILESTONES  = [100, 75, 50, 25];

    for (const milestone of MILESTONES) {
      if (prevProgress < milestone && newProgress >= milestone) {
        if (milestone === 100) {
          await notify(userId, {
            type:    'progress',
            title:   `Course Completed! 🎓`,
            message: `Congratulations! You've completed "${courseTitle}". Your certificate is now available.`,
            link:    `/course-certificate/${courseId}`,
            metadata: { courseId: String(courseId), milestone: 100 },
          }).catch(e => console.error("Notification Error:", e));
        } else {
          await notify(userId, {
            type:    'progress',
            title:   `${milestone}% Complete! 🚀`,
            message: `Great progress on "${courseTitle}"! Keep going, you're doing amazing.`,
            link:    '/my-courses',
            metadata: { courseId: String(courseId), milestone },
          }).catch(e => console.error("Notification Error:", e));
        }
        break; // Trigger highest reached milestone only
      }
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};