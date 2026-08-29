import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

const app = express();

// ===============================
// CORS CONFIGURATION (Environment Driven)
// ===============================

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// General API rate limiter for DDoS/flood mitigation (disabled in test env)
if (process.env.NODE_ENV !== "test") {
  app.use("/api", apiRateLimiter);
}

// ===============================
// BODY PARSER
// ===============================

app.use(express.json({ limit: "50mb" }));

// ===============================
// DB CONNECTION CHECK MIDDLEWARE (Skipped in test env)
// ===============================

app.use((req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  if (
    req.path.startsWith("/api/v1/auth") ||
    req.path.startsWith("/api/v1/post") ||
    req.path.startsWith("/api/v1/favorite") ||
    req.path.startsWith("/api/v1/history") ||
    req.path.startsWith("/api/v1/dashboard")
  ) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: "Database connection is not ready. Please verify your MongoDB credentials in server/.env.",
      });
    }
  }
  next();
});

// ===============================
// AUTHENTICATION, FAVORITE, HISTORY & DASHBOARD ROUTES
// ===============================

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/favorite", favoriteRoutes);
app.use("/api/v1/history", historyRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ===============================
// EXISTING ROUTES
// ===============================

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

// ===============================
// TEST / HEALTH ROUTE
// ===============================

app.get("/", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.status(200).json({
    success: true,
    message: "GenCanvas AI Server is Running",
    database: dbStatus,
  });
});

export default app;
