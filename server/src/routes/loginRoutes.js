import express from "express";
import bcrypt from "bcrypt";
import Pharmacy from "../models/Pharmacy.js";
import Doctor from "../models/Doctor.js";

const router = express.Router();

router.post("/login/pharmacy", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(400)
      .json({ error: "Pharmacy ID and password are required" });
  }

  try {
    const pharmacy = await Pharmacy.findOne({ id });
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    const isMatch = await bcrypt.compare(password, pharmacy.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Pharmacy login successful",
      pharmacy: {
        id: pharmacy.id,
        name: pharmacy.name,
        location_area: pharmacy.location_area,
      },
    });
  } catch (err) {
    console.error("Pharmacy login error:", err);
    res.status(500).json({ error: "Failed to login pharmacy" });
  }
});

router.post("/login/doctor", async (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res
      .status(400)
      .json({ error: "Doctor ID and password are required" });
  }

  try {
    const doctor = await Doctor.findOne({ id });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.status(200).json({
      message: "Doctor login successful",
      doctor: {
        id: doctor.id,
        name: doctor.name,
      },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ error: "Failed to login doctor" });
  }
});

export default router;
