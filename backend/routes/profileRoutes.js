/**
 * profileRoutes.js
 *
 * ── Mount in server.js / app.js ──────────────────────────────
 *   app.use('/api/profile', require('./routes/profileRoutes'));
 *
 * ── Resulting endpoints ───────────────────────────────────────
 *   GET    /api/profile         → getProfile
 *   PUT    /api/profile/update  → updateProfile
 * ─────────────────────────────────────────────────────────────
 */

const express = require('express');
const router  = express.Router();

const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect }                   = require('../middleware/authMiddleware');

/**
 * @route   GET /api/profile
 * @desc    Fetch full profile — user, enrollments, certificates, payments
 * @access  Private
 */
router.get('/', protect, getProfile);

/**
 * @route   PUT /api/profile/update
 * @desc    Update profile fields:
 *            name, bio, phone, city, headline, website, avatar,
 *            social        { linkedin, github }
 *            notifications { email_sessions, email_assignments,
 *                            email_offers, whatsapp, weekly_summary }
 *            privacy       boolean[3]
 * @access  Private
 */
router.put('/update', protect, updateProfile);

module.exports = router;