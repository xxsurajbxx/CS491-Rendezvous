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
    await pool.query(
      `INSERT INTO EmailVerifications (UserID, Code, ExpiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 15 MINUTE))`,
      [userId, code]
    );

    // send email
    await transporter.sendMail({
      from: `"Rendezvous" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Rendezvous Verification Code",
      text: `Your verification code is ${code}. `,
    });

    return res.status(200).json({ status: "success", message: "Verification email sent" });

  } catch (error) {
    console.error("Error sending verification code:", error);
    return res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
