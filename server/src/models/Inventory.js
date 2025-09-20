// src/models/Inventory.js
import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicine_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  requires_prescription: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["in stock", "out of stock"],
    required: true,
  },
});

const inventorySchema = new mongoose.Schema(
  {
    pharmacy_id: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    location_area: {
      type: String,
      required: true,
    },
    inventory: [medicineSchema],
  },
  { timestamps: true }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
