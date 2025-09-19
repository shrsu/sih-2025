import mongoose from "mongoose";

const summarySchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true },
    name: String,
    gender: String,
    aiAnalysis: [Object],
  },
  { timestamps: true }
);

const Summary = mongoose.model("Summary", summarySchema, "summaries");

export default Summary;
