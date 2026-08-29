import express from "express";
import History from "../mongodb/models/History.js";
import Favorite from "../mongodb/models/Favorite.js";
import Post from "../mongodb/models/Post.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Enforce authentication on dashboard data
router.use(authMiddleware);

// ==========================================
// GET DASHBOARD AGGREGATED STATS & DATA
// ==========================================

router.get("/stats", async (req, res) => {
  try {
    // Strictly derive userId from verified JWT
    const userId = req.userId;

    // 1. Fetch user counts and data in parallel
    const [totalGenerations, totalFavorites, totalPosts, recentCreations, communitySpotlight] =
      await Promise.all([
        History.countDocuments({ userId }).catch(() => 0),
        Favorite.countDocuments({ userId }).catch(() => 0),
        Post.countDocuments({ userId }).catch(() => 0),
        History.find({ userId }).sort({ createdAt: -1 }).limit(8).lean().catch(() => []),
        Post.find({}).sort({ likes: -1, createdAt: -1 }).limit(6).lean().catch(() => []),
      ]);

    // Estimated downloads derived from user activity
    const estimatedDownloads = Math.max(0, Math.floor(totalGenerations * 0.85));

    return res.status(200).json({
      success: true,
      stats: {
        totalGenerations,
        totalFavorites,
        totalPosts,
        totalDownloads: estimatedDownloads,
      },
      recentCreations,
      communitySpotlight,
    });
  } catch (error) {
    console.error("Dashboard stats aggregation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
});

export default router;
