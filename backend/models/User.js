const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: [true, "Name is required"],  trim: true, maxlength: 60 },
  email:    { type: String, required: [true, "Email is required"], unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, "Invalid email"] },
  password: { type: String, required: [true, "Password is required"], minlength: 6, select: false },
  role:     { type: String, enum: ["student", "instructor", "admin"], default: "student" },
  avatar:   { type: String, default: "" },
  bio:      { type: String, default: "", maxlength: 500 },
  headline: { type: String, default: "" },
  website:  { type: String, default: "" },
  phone:    { type: String, default: "", trim: true },
  city:     { type: String, default: "" },
  social: {
    twitter:  { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github:   { type: String, default: "" },
  },
privacy: {
  type: [Boolean],
  default: [true, false]
},
  enrolledCourses:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  createdCourses:   [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  isActive:            { type: Boolean, default: true },
  isVerified:          { type: Boolean, default: false },
  lastLogin:           { type: Date },
  resetPasswordToken:  { type: String },
  resetPasswordExpire: { type: Date },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (pw) {
  return bcrypt.compare(pw, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
