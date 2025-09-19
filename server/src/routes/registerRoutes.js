import express from "express";
import Pharmacy from "../models/Pharmacy.js";
import Doctor from "../models/Doctor.js";
import Inventory from "../models/Inventory.js";

const router = express.Router();

router.post("/register/pharmacy", async (req, res) => {
  const { name, address, phone_number, location_area, password } = req.body;

  if (!name || !address || !phone_number || !location_area || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existing = await Pharmacy.findOne({ phone_number });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Pharmacy already exists with this phone number" });
    }

    const pharmacy = new Pharmacy({
      name,
      address,
      phone_number,
      location_area,
      password,
    });

    await pharmacy.save();

    await Inventory.create({
      pharmacy_id: pharmacy.id,
      name: pharmacy.name,
      address: pharmacy.address,
      phone_number: pharmacy.phone_number,
      location_area: pharmacy.location_area,
      inventory: [],
    });

    res.status(201).json({
      message: "Pharmacy registered successfully",
      id: pharmacy.id,
    });
  } catch (err) {
    console.error("Error registering pharmacy:", err);
    res
      .status(500)
      .json({ error: "Internal error while registering pharmacy" });
  }
});

router.post("/register/doctor", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  try {
    const doctor = new Doctor({ name, password });
    await doctor.save();

    res.status(201).json({
      message: "Doctor registered successfully",
      id: doctor.id,
    });
  } catch (err) {
    console.error("Error registering doctor:", err);
    res.status(500).json({ error: "Failed to register doctor" });
  }
});

export default router;
