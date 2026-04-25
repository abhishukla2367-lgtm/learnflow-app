const mongoose    = require('mongoose');
const bcrypt      = require('bcryptjs');
const User        = require('../models/User');
const Enrollment  = require('../models/Enrollment');
const Certificate = require('../models/Certificate');
const Payment     = require('../models/Payment');

/* ─── helpers ────────────────────────────────────────────────── */

/**
 * Safely coerce req.user._id / req.user.id into a Mongoose ObjectId.
 * Throws a 401-ready error if neither field is present.
 */
function getUserId(req) {
  const raw = req.user?._id ?? req.user?.id;
  if (!raw) throw Object.assign(new Error('Not authenticated'), { status: 401 });
  return new mongoose.Types.ObjectId(String(raw));
}

/* ─── GET /api/profile ───────────────────────────────────────── */
/**
 * Returns the authenticated user's full profile plus related data.
 * Response shape:
 *   { success, user, enrollments, certificates, payments }
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    const [user, enrollments, certificates, payments] = await Promise.all([
      User.findById(userId).select('-password'),

      Enrollment.find({ student: userId })
        .populate('course', 'title thumbnail category difficulty totalLessons totalDuration averageRating')
        .sort({ lastAccessedAt: -1 })
        .lean(),

      Certificate.find({ student: userId })
        .populate('course', 'title thumbnail')
        .sort({ issuedAt: -1 })
        .lean(),

      Payment.find({ student: userId, status: 'completed' })
        .populate('course', 'title price')
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success:      true,
      user,
      enrollments:  enrollments  ?? [],
      certificates: certificates ?? [],
      payments:     payments     ?? [],
    });
  } catch (err) {
    const status = err.status ?? 500;
    console.error('[getProfile]', err.message);
    return res.status(status).json({
      success: false,
      message: status === 401 ? 'Not authenticated' : 'Could not load profile data.',
      error:   process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
};

/* ─── PUT /api/profile/update ────────────────────────────────── */
/**
 * Updates allowed profile fields.
 * Accepted body fields:
 *   name, bio, phone, city, headline, website, avatar,
 *   social   { linkedin, github },
 *   notifications { email_sessions, email_assignments, email_offers,
 *                   whatsapp, weekly_summary },
 *   privacy  (boolean[3])
 *
 * Response shape:
 *   { success, user }
 */
const ALLOWED_FIELDS = [
  'name', 'bio', 'phone', 'city', 'headline',
  'website', 'avatar', 'social', 'notifications', 'privacy',
];

exports.updateProfile = async (req, res) => {
  try {
    const userId = getUserId(req);
    const body   = req.body ?? {};
    const updates = {};

    /* ── only pick allowed top-level fields ── */
    for (const field of ALLOWED_FIELDS) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    /* ── validate name if provided ── */
    if (updates.name !== undefined) {
      if (typeof updates.name !== 'string' || !updates.name.trim()) {
        return res.status(400).json({ success: false, message: 'Name cannot be empty' });
      }
      updates.name = updates.name.trim();
    }

    /* ── validate phone if provided ── */
    if (updates.phone !== undefined && updates.phone !== '') {
      const digits = String(updates.phone).replace(/\s/g, '');
      if (!/^\d{10}$/.test(digits)) {
        return res.status(400).json({ success: false, message: 'Phone must be a 10-digit number' });
      }
    }

    /* ── validate website / social URLs if provided ── */
    const urlFields = [
      updates.website,
      updates.social?.linkedin,
      updates.social?.github,
    ].filter(Boolean);

    for (const url of urlFields) {
      if (!/^https?:\/\//i.test(url)) {
        return res.status(400).json({ success: false, message: 'URLs must start with http:// or https://' });
      }
    }

    /* ── validate notifications shape if provided ── */
    if (updates.notifications !== undefined) {
      const NOTIF_KEYS = ['email_sessions', 'email_assignments', 'email_offers', 'whatsapp', 'weekly_summary'];
      if (typeof updates.notifications !== 'object' || Array.isArray(updates.notifications)) {
        return res.status(400).json({ success: false, message: 'notifications must be an object' });
      }
      for (const k of Object.keys(updates.notifications)) {
        if (!NOTIF_KEYS.includes(k)) {
          return res.status(400).json({ success: false, message: `Unknown notification key: ${k}` });
        }
        if (typeof updates.notifications[k] !== 'boolean') {
          return res.status(400).json({ success: false, message: `Notification value for "${k}" must be boolean` });
        }
      }
    }

    if (updates.privacy !== undefined) {
      if (
        !Array.isArray(updates.privacy) ||
        updates.privacy.length !== 2 ||
        updates.privacy.some(v => typeof v !== 'boolean')
      ) {
        return res.status(400).json({ success: false, message: 'privacy must be an array of 3 booleans' });
      }
    }

    /* ── nothing to update ── */
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    const status = err.status ?? 500;
    console.error('[updateProfile]', err.message);
    return res.status(status).json({
      success: false,
      message: status === 401 ? 'Not authenticated' : 'Profile update failed',
      error:   process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
};

/* ─── PUT /api/auth/password ─────────────────────────────────── */
/**
 * Changes the authenticated user's password.
 * Body: { currentPassword, newPassword }
 * Response: { success, message }
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { currentPassword, newPassword } = req.body ?? {};

    /* ── input validation ── */
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'currentPassword and newPassword are required',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    /* ── fetch user WITH password for comparison ── */
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    /* ── verify current password ── */
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    /* ── guard: new password must differ ── */
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        success: false,
        message: 'New password must be different from the current password',
      });
    }

    /* ── hash & save ── */
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    const status = err.status ?? 500;
    console.error('[changePassword]', err.message);
    return res.status(status).json({
      success: false,
      message: status === 401 ? 'Not authenticated' : 'Password update failed',
      error:   process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
};

/* ─── DELETE /api/auth/account ───────────────────────────────── */
/**
 * Permanently deletes the authenticated user and all related data.
 * Response: { success, message }
 */
exports.deleteAccount = async (req, res) => {
  try {
    const userId = getUserId(req);

    /* ── delete all related data in parallel ── */
    await Promise.all([
      User.findByIdAndDelete(userId),
      Enrollment.deleteMany({ student: userId }),
      Certificate.deleteMany({ student: userId }),
      Payment.deleteMany({ student: userId }),
    ]);

    return res.status(200).json({ success: true, message: 'Account deleted successfully' });
  } catch (err) {
    const status = err.status ?? 500;
    console.error('[deleteAccount]', err.message);
    return res.status(status).json({
      success: false,
      message: status === 401 ? 'Not authenticated' : 'Account deletion failed',
      error:   process.env.NODE_ENV !== 'production' ? err.message : undefined,
    });
  }
};