import "dotenv/config";

import express, { type Express } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@/lib/auth.js";
import { connectDB } from "@/db/config.js";
import cors from "cors";
import apiRouter from "@/api/router.js";
import path from "path";
import { fileURLToPath } from "url";
import Limiter from "@/lib/rate-limiter.js";
import SpeedLimiter from "@/lib/speed-limiter.js";
import { makeURL } from "./utils/URL.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
connectDB();

const app: Express = express();
const PORT = process.env.PORT;

app.all("/api/auth/*splat", toNodeHandler(auth)); // For Express v5

// Middleware to parse JSON bodies
app.use(
  "/static",
  SpeedLimiter,
  Limiter,
  express.static(path.join(__dirname, "../public"))
);
app.use(express.json());

// Middleware to handle CORS
app.use(
  cors({
    origin: "http://localhost:5713", // Adjust this to your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    maxAge: 3600, // 1 hour
  })
);

app.use("/api", apiRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Local: http://localhost:${PORT}`);
  console.log(`Remote: ${process.env.BETTER_AUTH_URL}`);
});
