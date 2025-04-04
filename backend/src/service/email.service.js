const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const sendVerificationEmail = async (user) => {
  try {
    // Generate a token for email verification
    
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Verify Your Email",
      html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", user.email);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

const resetPasswordMail = async ({userId, password, email, name }) => {
  try {
    const token = jwt.sign({ userId, password }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const verificationLink = `${process.env.CLIENT_URL}/validate-user?token=${token}`;
        // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });
  
        const mailOptions = {
          from: `"Tasky.io Support" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Password Reset Verification Link",
          html: `
            <p>Hello ${name || "User"},</p>
            <p>We received a request to reset your password. If you initiated this request, please click the link below to reset your password:</p>
            <p><a href="${verificationLink}" style="color: #4F46E5; font-weight: bold;">Reset Password</a></p>
            <p>If you did not request this, please ignore this email. Your account remains secure.</p>
            <p>Regards,<br><strong>Tasky.io Team</strong></p>
          `,
        };        
    
        await transporter.sendMail(mailOptions);
        console.log("✅ Verification email sent to:", email);
    
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
}

module.exports = { sendVerificationEmail, resetPasswordMail };
