import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    shortSummary: String,
    detailedSummary: String,
    transcript: String,
  },
  { _id: false }
);

const summarySchema = new mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,
    aiAnalysis: aiAnalysisSchema,
  },
  { _id: false }
);

const ticketSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String },
    name: String,
    gender: String,
    summaries: [summarySchema],
    prescriptions: [
      {
        prescription: String,
        prescribedBy: String,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema, "tickets");

export default Ticket;
