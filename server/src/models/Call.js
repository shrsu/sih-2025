import mongoose from "mongoose";

const callSchema = new mongoose.Schema(
  {
    phoneNumber: String,
    status: String,
    aiAnalysis: Object,
    processed: { type: Boolean, default: false },
  },
  { strict: false }
);

const Call = mongoose.model("Call", callSchema, "calls");

export default Call;
