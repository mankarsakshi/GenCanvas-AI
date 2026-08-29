import * as dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./mongodb/connect.js";

// Load environment variables
dotenv.config();

// ===============================
// START SERVER
// ===============================

const startServer = async () => {
  const PORT = process.env.PORT || 8080;

  // Start Express server first so API endpoints are reachable
  app.listen(PORT, () => {
    console.log("=================================");
    console.log(`Server started on port ${PORT}`);
    console.log(`API: http://localhost:${PORT}`);
    console.log(`Auth API: http://localhost:${PORT}/api/v1/auth`);
    console.log("=================================");
  });

  // Attempt database connection
  if (!process.env.MONGODB_URL) {
    console.warn("⚠️ MONGODB_URL is missing in server/.env");
    return;
  }

  try {
    await connectDB(process.env.MONGODB_URL);
  } catch (error) {
    console.error("⚠️ MongoDB connection failed:", error.message);
    console.error("Please check your database user credentials and IP whitelist in MongoDB Atlas.");
  }
};

startServer();