// import express from 'express';
// import * as dotenv from 'dotenv';
// import cors from 'cors';

// import connectDB from './mongodb/connect.js';
// import postRoutes from './routes/postRoutes.js';
// import dalleRoutes from './routes/dalleRoutes.js';

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));

// app.use('/api/v1/post', postRoutes);
// app.use('/api/v1/dalle', dalleRoutes);

// app.get('/', async (req, res) => {
//   res.status(200).json({
//     message: 'Hello from DALL.E!',
//   });
// });

// const startServer = async () => {
//   try {
//     connectDB(process.env.MONGODB_URL);
//     app.listen(8080, () => console.log('Server started on port 8080'));
//   } catch (error) {
//     console.log(error);
//   }
// };

// startServer();
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import connectDB from "./mongodb/connect.js";

import postRoutes from "./routes/postRoutes.js";
import dalleRoutes from "./routes/dalleRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// ===============================
// CHECK ENVIRONMENT VARIABLES
// ===============================

console.log("=================================");
console.log("Environment Variables");
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET);
console.log("MONGODB_URL loaded:", !!process.env.MONGODB_URL);
console.log("=================================");

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json({ limit: "50mb" }));

// ===============================
// AUTHENTICATION ROUTES
// ===============================

app.use("/api/v1/auth", authRoutes);

// ===============================
// EXISTING ROUTES
// ===============================

app.use("/api/v1/post", postRoutes);
app.use("/api/v1/dalle", dalleRoutes);

// ===============================
// TEST ROUTE
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Hello from DALL.E!",
  });
});

// ===============================
// START SERVER
// ===============================

const startServer = async () => {
  try {
    // Check MongoDB URL
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is missing in .env");
    }

    // Check JWT Secret
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    // Connect to MongoDB
    await connectDB(process.env.MONGODB_URL);

    console.log("MongoDB connected successfully");

    // Start Express server
    app.listen(8080, () => {
      console.log("=================================");
      console.log("Server started on port 8080");
      console.log("API: http://localhost:8080");
      console.log("Auth API: http://localhost:8080/api/v1/auth");
      console.log("=================================");
    });
  } catch (error) {
    console.error("Server error:", error.message);
  }
};

startServer();