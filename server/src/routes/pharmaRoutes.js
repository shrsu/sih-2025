import express from "express";
import Inventory from "../models/Inventory.js";
import Summary from "../models/Summary.js";

const router = express.Router();

router.post("/inventory/add", async (req, res) => {
  const { pharmacy_id, medicine } = req.body;

  if (!pharmacy_id || !medicine?.name) {
    return res
      .status(400)
      .json({ error: "pharmacy_id and valid medicine are required" });
  }

  try {
    const updated = await Inventory.findOneAndUpdate(
      { pharmacy_id },
      {
        $addToSet: { inventory: medicine },
      },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Pharmacy inventory not found" });

    res
      .status(200)
      .json({ message: "Medicine added", inventory: updated.inventory });
  } catch (err) {
    console.error("Error adding medicine:", err);
    res.status(500).json({ error: "Internal error while adding medicine" });
  }
});

router.patch("/inventory/update", async (req, res) => {
  const { pharmacy_id, name, updates, phoneNumber } = req.body;

  if (!pharmacy_id || !name || !phoneNumber) {
    return res.status(400).json({ error: "pharmacy_id, name, and phoneNumber are required" });
  }

  try {
    const user = await Summary.findOne({ phoneNumber });
    if (!user || user.isActive !== "true") {
      return res.status(403).json({ error: "Ticket is not active. Cannot update inventory." });
    }

    const updated = await Inventory.findOneAndUpdate(
      {
        pharmacy_id,
        "inventory.name": name,
      },
      {
        $set: updates,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Medicine not found in inventory" });
    }

    res.status(200).json({
      message: "Medicine updated successfully",
      inventory: updated.inventory,
    });
  } catch (err) {
    console.error("Error updating medicine:", err);
    res.status(500).json({ error: "Failed to update inventory item" });
  }
});

router.delete("/inventory/remove", async (req, res) => {
  const { pharmacy_id, name } = req.body;

  if (!pharmacy_id || !name) {
    return res.status(400).json({ error: "pharmacy_id and name are required" });
  }

  try {
    const updated = await Inventory.findOneAndUpdate(
      { pharmacy_id },
      { $pull: { inventory: { name } } },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ error: "Pharmacy or medicine not found" });

    res
      .status(200)
      .json({ message: "Medicine removed", inventory: updated.inventory });
  } catch (err) {
    console.error("Error removing medicine:", err);
    res.status(500).json({ error: "Internal error while removing medicine" });
  }
});

router.get("/summaries/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const summary = await Summary.findOne({ phoneNumber: "+91" + phoneNumber });
    if (!summary) {
      return res.status(404).json({ error: "No summary found for this phone number" });
    }

    res.json({
      isActive: summary.isActive,
      prescriptions: summary.aiAnalysis?.map((a) => a.prescriptionId) || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/inventory", async (req, res) => {
  const { pharmacy_id } = req.body;

  if (!pharmacy_id) {
    return res.status(400).json({ error: "pharmacy_id is required" });
  }

  try {
    const inventory = await Inventory.findOne({ pharmacy_id });
    if (!inventory) {
      return res.status(404).json({ error: "Pharmacy inventory not found" });
    }
    res.status(200).json({ inventory: inventory.inventory });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Internal error while fetching inventory" });
  }
});

router.get("/summaries/:phoneNumber", async (req, res) => {
  const { phoneNumber } = req.params;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const summary = await Summary.findOne({ phoneNumber: "+91" + phoneNumber });
    if (!summary) {
      return res.status(404).json({ error: "No summary found for this phone number" });
    }

    res.json({
      isActive: summary.isActive,
      prescriptions: summary.aiAnalysis?.map((a) => a.prescriptionId) || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.get("/inventory", async (req, res) => {
  const { pharmacy_id } = req.body;

  if (!pharmacy_id) {
    return res.status(400).json({ error: "pharmacy_id is required" });
  }

  try {
    const inventory = await Inventory.findOne({ pharmacy_id });
    if (!inventory) {
      return res.status(404).json({ error: "Pharmacy inventory not found" });
    }
    res.status(200).json({ inventory: inventory.inventory });
  } catch (err) {
    console.error("Error fetching inventory:", err);
    res.status(500).json({ error: "Internal error while fetching inventory" });
  }
});

export default router;
