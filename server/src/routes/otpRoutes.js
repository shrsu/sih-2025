import express from "express";
import dotenv from "dotenv";
import twilio from "twilio";
import Summary from "../models/Summary.js";

dotenv.config();

const router = express.Router();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_VERIFY_SERVICE_SID,
} = process.env;

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
  console.warn(
    "Twilio environment variables are missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID."
  );
}

const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
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
    if (!twilioClient) return res.status(500).json({ error: "OTP service not configured" });
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ error: "phoneNumber is required" });

    const to = normalizeIndianPhone(phoneNumber);

    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to, channel: "sms" });

    res.status(200).json({ status: verification.status, to });
  } catch (err) {
    console.error("/otp/send error", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP and return status + prescriptions
router.post("/otp/verify", async (req, res) => {
  try {
    if (!twilioClient) return res.status(500).json({ error: "OTP service not configured" });
    const { phoneNumber, code } = req.body;
    if (!phoneNumber || !code) {
      return res.status(400).json({ error: "phoneNumber and code are required" });
    }

    const to = normalizeIndianPhone(phoneNumber);

    const check = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to, code });

    if (check.status !== "approved") {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // After successful verification, fetch the user's status and prescriptions
    const summary = await Summary.findOne({ phoneNumber: to });

    if (!summary) {
      return res.status(404).json({ error: "No summary found for this phone number" });
    }

    const isActive = summary.isActive; // Note: in current schema this is a string
    const prescriptions = (summary.aiAnalysis || []).map((a) => a.prescriptionId).filter(Boolean);

    res.status(200).json({ verified: true, isActive, prescriptions });
  } catch (err) {
    console.error("/otp/verify error", err);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
