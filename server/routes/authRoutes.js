import express from "express";

import {
  signup,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
  getUserSettings,
  updateUserSettings,
  deleteUserAccount,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validateSettingsUpdate,
} from "../middleware/validate.js";

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authRateLimiter);

// ==========================================
// SIGNUP
// ==========================================

router.post("/register", validateRegister, signup);

// ==========================================
// LOGIN
// ==========================================

router.post("/login", validateLogin, login);

// ==========================================
// GET LOGGED-IN USER
// ==========================================

router.get("/me", authMiddleware, getCurrentUser);

// ==========================================
// UPDATE USER PROFILE
// ==========================================

router.put("/profile", authMiddleware, validateProfileUpdate, updateProfile);

// ==========================================
// UPDATE USER AVATAR
// ==========================================

router.post("/avatar", authMiddleware, updateAvatar);

// ==========================================
// USER SETTINGS
// ==========================================

router.get("/settings", authMiddleware, getUserSettings);
router.put("/settings", authMiddleware, validateSettingsUpdate, updateUserSettings);

// ==========================================
// DELETE ACCOUNT
// ==========================================

router.delete("/account", authMiddleware, deleteUserAccount);

export default router;