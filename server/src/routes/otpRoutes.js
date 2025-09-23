import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import Ticket from "../models/Ticket.js";

dotenv.config();

const router = express.Router();

const {
  TWILIO_ACCOUNT_SID_OTP,
  TWILIO_AUTH_TOKEN_OTP,
  TWILIO_VERIFY_SERVICE_SID_OTP,
} = process.env;

if (
  !TWILIO_ACCOUNT_SID_OTP ||
  !TWILIO_AUTH_TOKEN_OTP ||
  !TWILIO_VERIFY_SERVICE_SID_OTP
) {
  console.warn(
    "Twilio environment variables are missing. Set TWILIO_ACCOUNT_SID_OTP, TWILIO_AUTH_TOKEN_OTP, TWILIO_VERIFY_SERVICE_SID_OTP."
  );
}

const twilioClient =
  TWILIO_ACCOUNT_SID_OTP && TWILIO_AUTH_TOKEN_OTP
    ? twilio(TWILIO_ACCOUNT_SID_OTP, TWILIO_AUTH_TOKEN_OTP)
    : null;

function normalizeIndianPhone(phoneNumber) {
  const digits = (phoneNumber || "").replace(/\D/g, "");
  if (digits.startsWith("91")) return "+" + digits;
  if (digits.startsWith("+91")) return digits;
  // assume 10-digit Indian number
  return "+91" + digits;
}

// Send OTP
router.post("/otp/send", async (req, res) => {
  try {
    if (!twilioClient)
      return res.status(500).json({ error: "OTP service not configured" });
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      return res.status(400).json({ error: "phoneNumber is required" });

    const to = normalizeIndianPhone(phoneNumber);

    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID_OTP)
      .verifications.create({ to, channel: "sms" });

    res.status(200).json({ status: verification.status, to });
  } catch (err) {
    console.error("/otp/send error", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/otp/verify", async (req, res) => {
  try {
    if (!twilioClient) {
      return res.status(500).json({ error: "OTP service not configured" });
    }

    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res
        .status(400)
        .json({ error: "phoneNumber and code are required" });
    }

    const to = normalizeIndianPhone(phoneNumber);

    const check = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID_OTP)
      .verificationChecks.create({ to, code });

    if (check.status !== "approved") {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const ticket = await Ticket.findOne({ phoneNumber: to });
    if (!ticket) {
      return res
        .status(404)
        .json({ error: "No ticket found for this phone number" });
    }

    const isActive = ticket.isActive === true || ticket.isActive === "true";

    const prescriptions =
      ticket.prescriptions?.map((p) => p.prescription) || [];

    res.status(200).json({
      verified: true,
      isActive,
      prescriptions,
    });
  } catch (err) {
    console.error("/otp/verify error", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
