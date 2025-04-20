import express from "express";
import { confirmVerificationCode } from "./emailConfirmVerification";
import { sendVerificationCode } from "./emailSendVerification";

const router = express.Router();

// send verification code to user's email
router.post("/send", async (req, res) => {
  await sendVerificationCode(req, res);
});

// confirm verification code
router.post("/confirm", async (req, res) => {
  await confirmVerificationCode(req, res);
});

export default router;
