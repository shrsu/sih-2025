import express from "express";
import Inventory from "../models/Inventory.js";

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
  const { pharmacy_id, name, updates } = req.body;

  if (
    !pharmacy_id ||
    !name ||
    typeof updates?.requires_prescription !== "boolean"
  ) {
    return res
      .status(400)
      .json({ error: "pharmacy_id, name, and valid update required" });
  }

  try {
    const updated = await Inventory.findOneAndUpdate(
      {
        id: pharmacy_id,
        "inventory.name": name,
      },
      {
        $set: {
          "inventory.$.requires_prescription": updates.requires_prescription,
        },
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

export default router;
