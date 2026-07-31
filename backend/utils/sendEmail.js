const nodemailer = require("nodemailer");

/**
 * Utility to send emails via Gmail SMTP
 * @param {Object} options - { to, subject, html }
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // 16-character App Password
      },
    });

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `"Learnodays Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Email Sending Failed:", error.message);
    // We throw the error so the calling controller (like OTP) knows it failed
    throw new Error("Could not send email. Please try again later.");
  }
};

module.exports = sendEmail;