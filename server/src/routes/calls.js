import express from "express";
import { makeCall } from "../bot/bot.js";

const router = express.Router();

/**
 * POST /api/call
 * Body: { phoneNumber: string, templateContext: object }
 */
router.post("/call", async (req, res) => {
  try {
    const { phoneNumber, templateContext } = req.body;

    console.log(templateContext);
    if (!phoneNumber) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    const result = await makeCall(phoneNumber, {
      twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
      twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
      twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
      ultravoxApiKey: process.env.ULTRAVOX_API_KEY,
      ultravoxAgentId: process.env.ULTRAVOX_AGENT_ID,
      templateContext: templateContext || {},
    });

    res.json(result);
  } catch (err) {
    console.error("Error in /api/call route:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
