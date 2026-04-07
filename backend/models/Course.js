const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url:  { type: String, required: true },
  type: { type: String, enum: ["pdf", "zip", "link", "doc"], default: "link" },
});

const lessonSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, default: "" },
  videoUrl:    { type: String, default: "" },
  duration:    { type: Number, default: 0 }, // minutes
  isPreview:   { type: Boolean, default: false },
  resources:   [resourceSchema],
  order:       { type: Number, required: true },
  isPublished: { type: Boolean, default: true },
});

const sectionSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  lessons: [lessonSchema],
  order:   { type: Number, required: true },
});

const courseSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  subtitle:    { type: String, default: "" },
  description: { type: String, required: true },
  instructor:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  thumbnail:   { type: String, default: "" },
  promoVideo:  { type: String, default: "" },
  category: {
    type: String,
    enum: [
      "Marketing",
      "Web Development",
      "AI / Machine Learning",
      "Design",
      "Data Science",
      "Cloud Computing",
      "Cybersecurity",
      "DSA"
    ],
    required: true,
  },
  subcategory:  { type: String, default: "" },
  difficulty:   { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  language:     { type: String, default: "English" },
  price:        { type: Number, default: 0, min: 0 },
  isFree:       { type: Boolean, default: true },
  discount:     { type: Number, default: 0, min: 0, max: 100 },
  sections:     [sectionSchema],
  outcomes:     [String],
  requirements: [String],
  tags:         [String],
  totalDuration:   { type: Number, default: 0 }, // minutes
  totalLessons:    { type: Number, default: 0 },
  enrollmentCount: { type: Number, default: 0 },
  averageRating:   { type: Number, default: 0, min: 0, max: 5 },
  totalReviews:    { type: Number, default: 0 },
  isPublished:      { type: Boolean, default: false },
  isFeatured:       { type: Boolean, default: false },
  certificate:      { type: Boolean, default: true },
  isCertification:  { type: Boolean, default: false },
  emoji:            { type: String, default: "" },
  tag:              { type: String, default: "" },
}, { timestamps: true });

// Recalculate totals before save
courseSchema.pre("save", function (next) {
  this.totalLessons  = this.sections.reduce((a, s) => a + s.lessons.length, 0);
  this.totalDuration = this.sections.reduce(
    (a, s) => a + s.lessons.reduce((b, l) => b + (l.duration || 0), 0), 0
  );
  this.isFree = this.price === 0;
  next();
});

courseSchema.index({ title: "text", description: "text", tags: "text" });
courseSchema.index({ category: 1, isPublished: 1 });
courseSchema.index({ enrollmentCount: -1 });

module.exports = mongoose.models.Course || mongoose.model("Course", courseSchema);
