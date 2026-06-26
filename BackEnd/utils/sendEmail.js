const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (!emailUser || !emailPass) {
    throw new Error("EMAIL_USER and EMAIL_PASS must be set in BackEnd/.env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"Snap2Fix" <${emailUser}>`,
      to: to?.trim(),
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    console.log("OTP email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("OTP email failed:", {
      code: err.code,
      command: err.command,
      response: err.response,
      message: err.message,
    });
    throw err;
  }
};

module.exports = sendEmail;
