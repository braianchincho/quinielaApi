import express from "express";
import dotenv from "dotenv";
import drawsRouter from "./routes/draws";
import { setupSwagger } from "./swagger";
import { scheduleJobs } from "./scripts/jobs";
import cors from "cors";
import path from 'path';
import { Database } from "./database";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const database = Database.getInstance();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

// Routes
app.use("/api/draws", drawsRouter);

database.connect();

// Swagger
setupSwagger(app);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
  scheduleJobs();
});
