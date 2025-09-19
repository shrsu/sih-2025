import express from "express";
import Call from "../models/Call.js";
import Ticket from "../models/Ticket.js";

const router = express.Router();

router.post("/recon/reset", async (req, res) => {
  try {
    const ticketResult = await Ticket.deleteMany({});

    const callResult = await Call.updateMany(
      {},
      { $set: { processed: false } }
    );

    res.status(200).json({
      message: "Recon completed successfully",
      ticketsDeleted: ticketResult.deletedCount,
      callsUpdated: callResult.modifiedCount,
    });
  } catch (error) {
    console.error("Recon failed:", error);
    res.status(500).json({ error: "Internal server error during recon." });
  }
});

export default router;
