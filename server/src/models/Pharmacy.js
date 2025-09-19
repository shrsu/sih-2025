import mongoose from "mongoose";
import bcrypt from "bcrypt";

const generateRandomId = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const pharmacySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      default: generateRandomId,
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
      unique: true,
    },
    location_area: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

pharmacySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

const Pharmacy = mongoose.model("Pharmacy", pharmacySchema);

export default Pharmacy;
