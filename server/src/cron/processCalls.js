import cron from "node-cron";
import Call from "../models/Call.js";
import Summary from "../models/Summary.js";

const phoneMetaMap = JSON.parse(process.env.PHONE_META_MAP || "{}");

async function processCompletedCalls() {
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

      const existing = await Summary.findOne({ phoneNumber });
      if (existing) {
        existing.aiAnalysis.push(aiAnalysis);
        await existing.save();
        console.log(`Updated summary for ${phoneNumber}`);
      } else {
        await Summary.create({
          phoneNumber,
          name: metadata.name,
          gender: metadata.gender,
          aiAnalysis: [aiAnalysis],
        });
        console.log(`Created summary for ${phoneNumber}`);
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
