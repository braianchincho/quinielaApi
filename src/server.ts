import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./database";
import drawsRouter from "./routes/draws";
import { setupSwagger } from "./swagger";
import { scheduleJobs } from "./scripts/jobs";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/draws", drawsRouter);

connectDB();

// Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
  scheduleJobs();
});
