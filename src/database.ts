import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const c = process.env.MONGO_URI || "mongodb://localhost:27017/drawsdb";
    console.log(c)
    await mongoose.connect(c);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB", err);
    process.exit(1);
  }
};
