import cron from "node-cron";
import Call from "../models/Call.js";
import Ticket from "../models/Ticket.js";

async function processCompletedCalls() {
  const phoneMetaMap = JSON.parse(process.env.PHONE_META_MAP || "{}");

  try {
    const unprocessedCalls = await Call.find({
      status: "completed",
      processed: { $ne: true },
    }).limit(5);

    for (const call of unprocessedCalls) {
      const { phoneNumber, aiAnalysis } = call;
      if (!aiAnalysis || !phoneNumber) continue;

      const metadata = phoneMetaMap[phoneNumber] || {
        name: "Unknown",
        gender: "unknown",
      };

      const existing = await Ticket.findOne({ phoneNumber, isActive: true });

      const summaryEntry = {
        id: call._id,
        aiAnalysis,
        prescription: "",
      };

      if (existing) {
        existing.summaries.push(summaryEntry);
        await existing.save();
        console.log(`Updated ticket for ${phoneNumber}`);
      } else {
        await Ticket.create({
          phoneNumber,
          name: metadata.name,
          gender: metadata.gender,
          summaries: [summaryEntry],
          isActive: true,
        });
        console.log(`Created new ticket for ${phoneNumber}`);
      }

      call.processed = true;
      await call.save();
    }

    if (unprocessedCalls.length === 0) {
      console.log("No new completed calls to process.");
    }
  } catch (err) {
    console.error("Error processing calls:", err);
  }
}

export function startCron() {
  cron.schedule("*/30 * * * * *", () => {
    console.log("Cron running: polling completed calls...");
    processCompletedCalls();
  });
}
