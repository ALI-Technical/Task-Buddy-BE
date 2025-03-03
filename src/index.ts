import express, { Application, Request, Response } from "express";
import { VercelRequest, VercelResponse } from "@vercel/node/dist";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import mongoose from "mongoose";
import { initSocket } from "./Config/socket";
import authRoutes from "./Routes/authRoutes";
import taskRoutes from "./Routes/taskRoutes";
import { startTaskReminderCronJob } from "./Services/taskReminder";

// Load environment variables
dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Initialize WebSocket
initSocket(httpServer);

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet()); // Security headers
app.use(morgan("dev")); // Logger
app.use(cookieParser());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB Connected");
    startTaskReminderCronJob();
  })
  .catch((err) => console.error(err));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Serving...");
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Start server
const PORT: number = Number(process.env.PORT) || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default function handler(req: VercelRequest, res: VercelResponse) {
  (app as any).handle(req, res);
}
