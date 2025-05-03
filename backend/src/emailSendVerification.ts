import { Request, Response } from "express";
import { pool } from "./db";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PW,
  },
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PW:", process.env.EMAIL_PW);


export const sendVerificationCode = async (req: Request, res: Response) => {
  const { userId, email } = req.body;

  if (!userId || !email) {
    return res.status(400).json({ status: "fail", message: "Missing userId or email" });
  }

  // generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // fetch username
    const [userRows] = await pool.query("SELECT Username FROM Users WHERE UserID = ?", [userId]);
    const user = (userRows as any[])[0];
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    const username = user.Username;
    const verificationURL = `http://localhost:3000/verify`;

    await pool.query(
      `INSERT INTO EmailVerifications (UserID, Code, ExpiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 DAY))`,
      [userId, code]
    );

    // send email
    await transporter.sendMail({
      from: `"Rendezvous" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Rendezvous Email Verification",
      html: `
      <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.4;">
        <p style="margin: 0 0 10px;">Hi <strong>${username}</strong>,</p>
        <p style="margin: 0 0 10px;">Thank you for signing up for Rendezvous! We're excited to have you on board.</p>
        <p style="margin: 0 0 10px;">Your verification code is:</p>
        <h2 style="margin: 0 0 20px;">${code}</h2>
        <p style="margin: 0 0 10px;">
          To complete your registration and get started, please verify your email address by clicking the button below:
        </p>
        <p style="margin: 0 0 20px;">
          <a href="${verificationURL}" 
             style="background-color:#007bff;color:#fff;padding:10px 15px;text-decoration:none;border-radius:5px;">
             Verify Email
          </a>
        </p>
        <p style="margin: 0 0 10px;">If the button above doesn't work, simply copy and paste the following URL into your web browser:</p>
        <p style="margin: 0 0 20px;"><a href="${verificationURL}">${verificationURL}</a></p>
        <p style="margin: 0 0 10px;">If you did not create an account with us, please disregard this email.</p>
        <p style="margin: 0 0 10px;">Thank you for joining Rendezvous!</p>
        <p style="margin: 0;"><em>Best regards,</em></p>
        <p style="margin: 0;"><em>The Rendezvous Team</em></p>
      </div>
    `
    });

    return res.status(200).json({ status: "success", message: "Verification email sent" });

  } catch (error: any) {
    console.error("sendVerificationCode error:", error);
    return res
      .status(500)
      .json({ status: "fail", message: error.message });
  }
};
