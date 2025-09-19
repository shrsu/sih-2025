import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, unique: true },
    name: String,
    gender: String,
    summaries: [
      {
        id: mongoose.Schema.Types.ObjectId,
        aiAnalysis: Object,
        prescription: Object,
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema, "tickets");

export default Ticket;
