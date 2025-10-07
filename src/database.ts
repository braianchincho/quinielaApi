import mongoose, { Connection } from "mongoose";
import { logError, logger } from "./helpers/logger";
import dotenv from "dotenv";
dotenv.config();

export class Database {
  private static instance: Database;
  private connection?: Connection;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<Connection | null> {
    if (this.connection) {
      logger.info("⚡ Reusing existing MongoDB connection");
      return this.connection;
    }

    try {
      const uri = process.env.MONGO_URI || "mongodb://localhost:27017/drawsdb";

      await mongoose.connect(uri);
      this.connection = mongoose.connection;

      logger.info("✅ MongoDB connected successfully");
      return this.connection;
    } catch (error) {
      logError("❌ Error connecting to MongoDB", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.connection) {
      logger.warn("⚠️ No active MongoDB connection to close");
      return;
    }

    try {
      await mongoose.disconnect();
      this.connection = undefined;
      logger.info("🔌 MongoDB disconnected");
    } catch (error) {
      logError("❌ Error disconnecting from MongoDB", error);
    }
  }
}

