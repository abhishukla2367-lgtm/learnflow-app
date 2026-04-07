// controllers/discussionController.js
const Discussion = require("../models/Discussion");
const Enrollment = require("../models/Enrollment");
const { broadcast } = require("../socket");

/* ── GET /api/discussions/course/:courseId ───────────────────── */
exports.getCourseDiscussions = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum  = Math.max(1, Number(page));
  const limitNum = Math.min(50, Number(limit));

  const query = { course: req.params.courseId, isDeleted: false };

  const [total, discussions] = await Promise.all([
    Discussion.countDocuments(query),
    Discussion.find(query)
      .populate("author", "name avatar role")
      .populate("replies.author", "name avatar role")
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
  ]);

  res.json({ success: true, discussions, total, page: pageNum });
};

/* ── POST /api/discussions/course/:courseId ──────────────────── */
exports.createDiscussion = async (req, res) => {
  const { title, body, lessonId } = req.body;
  if (!title?.trim() || !body?.trim())
    return res.status(400).json({ success: false, message: "Title and body are required" });

  // Must be enrolled or instructor/admin
  if (req.user.role === "student") {
    const enrolled = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId });
    if (!enrolled)
      return res.status(403).json({ success: false, message: "You must be enrolled in this course" });
  }

  const discussion = await Discussion.create({
    course: req.params.courseId,
    author: req.user.id,
    title:  title.trim(),
    body:   body.trim(),
    lesson: lessonId || undefined,
  });

  await discussion.populate("author", "name avatar role");

  // Broadcast to course room in realtime
  try {
    broadcast.courseDiscussion(req.params.courseId, {
      type:       "discussion:new",
      discussion: { _id: discussion._id, title: discussion.title, author: discussion.author },
    });
  } catch {}

  res.status(201).json({ success: true, discussion });
};

/* ── POST /api/discussions/:id/reply ─────────────────────────── */
exports.addReply = async (req, res) => {
  const { body } = req.body;
  if (!body?.trim())
    return res.status(400).json({ success: false, message: "Reply body is required" });

  const discussion = await Discussion.findById(req.params.id);
  if (!discussion || discussion.isDeleted)
    return res.status(404).json({ success: false, message: "Discussion not found" });

  discussion.replies.push({ author: req.user.id, body: body.trim() });
  await discussion.save();

  await discussion.populate("replies.author", "name avatar role");

  const latestReply = discussion.replies[discussion.replies.length - 1];

  // Broadcast reply to course room
  try {
    broadcast.courseDiscussion(discussion.course.toString(), {
      type:         "discussion:reply",
      discussionId: discussion._id,
      reply:        latestReply,
    });
  } catch {}

  res.status(201).json({ success: true, reply: latestReply });
};

/* ── PATCH /api/discussions/:id/pin ──────────────────────────── */
exports.pinDiscussion = async (req, res) => {
  const discussion = await Discussion.findByIdAndUpdate(
    req.params.id,
    { isPinned: req.body.isPinned ?? true },
    { new: true }
  );
  if (!discussion)
    return res.status(404).json({ success: false, message: "Discussion not found" });
  res.json({ success: true, discussion });
};

/* ── DELETE /api/discussions/:id ─────────────────────────────── */
exports.deleteDiscussion = async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion)
    return res.status(404).json({ success: false, message: "Discussion not found" });

  if (discussion.author.toString() !== req.user.id && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorized" });

  discussion.isDeleted = true;
  await discussion.save();

  res.json({ success: true, message: "Discussion deleted" });
};

/* ── PATCH /api/discussions/:id/like ─────────────────────────── */
exports.likeDiscussion = async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion)
    return res.status(404).json({ success: false, message: "Discussion not found" });

  const userId   = req.user._id;
  const likeIdx  = discussion.likes.indexOf(userId);
  if (likeIdx === -1) discussion.likes.push(userId);
  else discussion.likes.splice(likeIdx, 1);
  await discussion.save();

  res.json({ success: true, likes: discussion.likes.length });
};
