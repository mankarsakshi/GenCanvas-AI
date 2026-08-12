import express from "express";

import {
  signup,
  login,
  getCurrentUser,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// SIGNUP
// ==========================================

router.post("/register", signup);

// ==========================================
// LOGIN
// ==========================================

router.post("/login", login);

// ==========================================
// GET LOGGED-IN USER
// ==========================================

router.get("/me", authMiddleware, getCurrentUser);

export default router;