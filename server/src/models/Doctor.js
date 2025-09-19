import mongoose from "mongoose";
import bcrypt from "bcrypt";

const generateRandomId = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const doctorSchema = new mongoose.Schema(
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
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
