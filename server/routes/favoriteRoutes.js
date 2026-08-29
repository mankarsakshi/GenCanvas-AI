import express from "express";
import Favorite from "../mongodb/models/Favorite.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateFavorite } from "../middleware/validate.js";

const router = express.Router();

// Enforce authentication on all favorite routes to prevent IDOR
router.use(authMiddleware);

// ==========================================
// GET USER FAVORITES (Paginated)
// ==========================================

router.get("/", async (req, res) => {
  try {
    // Strictly derive userId from verified JWT
    const userId = req.userId;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      Favorite.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Favorite.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: favorites,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    console.error("Fetch favorites error:", err);
    return res.status(500).json({ success: false, message: "Fetching favorites failed" });
  }
});

// ==========================================
// ADD A FAVORITE
// ==========================================

router.post("/", validateFavorite, async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, photo, name, style, ratio, likes } = req.body;

    // Prevent duplicate favorites for same photo for THIS user
    const existing = await Favorite.findOne({ photo, userId });
    if (existing) {
      return res.status(200).json({
        success: true,
        data: existing,
        message: "Already in favorites",
      });
    }

    const newFavorite = await Favorite.create({
      prompt: prompt || "AI Artwork",
      photo,
      name: name || "GenCanvas Creator",
      userId,
      style: style || "Digital Art",
      ratio: ratio || "1:1",
      likes: likes || 1,
    });

    return res.status(201).json({ success: true, data: newFavorite });
  } catch (err) {
    console.error("Create favorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to save favorite" });
  }
});

// ==========================================
// TOGGLE FAVORITE (IDOR Safe)
// ==========================================

router.post("/toggle", validateFavorite, async (req, res) => {
  try {
    const userId = req.userId;
    const { prompt, photo, name, style, ratio } = req.body;

    const existing = await Favorite.findOne({ photo, userId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({
        success: true,
        favorited: false,
        message: "Removed from favorites",
      });
    }

    const newFav = await Favorite.create({
      prompt: prompt || "AI Artwork",
      photo,
      name: name || "GenCanvas Creator",
      userId,
      style: style || "Digital Art",
      ratio: ratio || "1:1",
    });

    return res.status(201).json({
      success: true,
      favorited: true,
      data: newFav,
      message: "Added to favorites",
    });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to toggle favorite" });
  }
});

// ==========================================
// DELETE FAVORITE BY ID (IDOR Safe)
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const deleted = await Favorite.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Favorite item not found or unauthorized",
      });
    }

    return res.status(200).json({ success: true, message: "Favorite removed successfully" });
  } catch (err) {
    console.error("Delete favorite error:", err);
    return res.status(500).json({ success: false, message: "Failed to remove favorite" });
  }
});

export default router;
