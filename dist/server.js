"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./database");
const draws_1 = __importDefault(require("./routes/draws"));
const swagger_1 = require("./swagger");
const jobs_1 = require("./scripts/jobs");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.static("public"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'index.html'));
});
// Routes
app.use("/api/draws", draws_1.default);
(0, database_1.connectDB)();
// Swagger
(0, swagger_1.setupSwagger)(app);
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📖 Swagger docs available at http://localhost:${PORT}/api-docs`);
    (0, jobs_1.scheduleJobs)();
});
