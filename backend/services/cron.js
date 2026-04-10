const cron = require("node-cron");
const Enrollment = require("./models/Enrollment");
const { broadcast } = require("./socket");

// Runs every day at midnight to check for expired trials
cron.schedule("0 0 * * *", async () => {
  console.log("Running Trial Expiry Check...");
  const now = new Date();
  
  // Find all trials that have passed their 7-day mark
  const expiredTrials = await Enrollment.find({
    status: "trialing",
    trialEndsAt: { $lt: now }
  });

  for (let enrollment of expiredTrials) {
    enrollment.status = "expired";
    await enrollment.save();

    // Use your existing socket.js to notify the user instantly
    try {
      broadcast.toUser(enrollment.student.toString(), "TRIAL_EXPIRED", {
        message: "Your trial has ended. Please pay to continue your course.",
        courseId: enrollment.course
      });
    } catch (err) {
      console.error("Socket notification failed:", err);
    }
  }
});