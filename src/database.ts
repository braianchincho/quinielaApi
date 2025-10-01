import mongoose from "mongoose";
import { logger } from "./helpers/logger";

export const connectDB = async () => {
  try {
    const c = process.env.MONGO_URI || "mongodb://localhost:27017/drawsdb";
    await mongoose.connect(c);
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error("❌ Error connecting to MongoDB");
    process.exit(1);
  }
};
