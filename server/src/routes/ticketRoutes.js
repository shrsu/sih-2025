import express from "express";
import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find({ isActive: true });
    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching tickets:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

router.patch("/tickets/prescription", async (req, res) => {
  const { ticketId, doctor_name, prescription } = req.body;

  if (!ticketId || !doctor_name || !prescription) {
    return res.status(400).json({
      error: "ticketId, doctor_name, and prescription are required",
    });
  }

  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          prescriptions: {
            prescription,
            prescribedBy: doctor_name,
          },
        },
      },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ message: "Prescription appended", ticket });
  } catch (err) {
    console.error("Error appending prescription:", err);
    res.status(500).json({ error: "Failed to append prescription" });
  }
});

router.patch("/tickets/status", async (req, res) => {
  const { ticket_id, isActive } = req.body;

  if (!ticket_id || typeof isActive !== "boolean") {
    return res
      .status(400)
      .json({ error: "ticket_id and valid isActive status are required" });
  }

  try {
    const updated = await Ticket.findByIdAndUpdate(
      ticket_id,
      { isActive },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json({ message: "Ticket status updated", ticket: updated });
  } catch (err) {
    console.error("Error updating ticket status:", err);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
});

router.get("/tickets/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    res.status(200).json(ticket);
  } catch (err) {
    console.error("Error fetching ticket by id:", err);
    res.status(500).json({ error: "Failed to fetch ticket" });
  }
});

router.post("/tickets/by-phone", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "phoneNumber is required" });
  }

  try {
    const tickets = await Ticket.find({ phoneNumber });

    if (!tickets || tickets.length === 0) {
      return res
        .status(404)
        .json({ error: "No tickets found for this phone number" });
    }

    res.status(200).json(tickets);
  } catch (err) {
    console.error("Error fetching tickets by phone number:", err);
    res.status(500).json({ error: "Failed to fetch tickets" });
  }
});

export default router;
