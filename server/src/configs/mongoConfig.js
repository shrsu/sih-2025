import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "voice_assistant",
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectToMongo;
