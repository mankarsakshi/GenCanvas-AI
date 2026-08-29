import express from "express";
import History from "../mongodb/models/History.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validateCreateHistory } from "../middleware/validate.js";

const router = express.Router();

// Enforce authentication on all history routes to prevent IDOR
router.use(authMiddleware);

// ==========================================
// GET USER GENERATION HISTORY (Paginated)
// ==========================================

router.get("/", async (req, res) => {
  try {
    // Strictly derive userId from verified JWT
    const userId = req.userId;

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [historyItems, total] = await Promise.all([
      History.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      History.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: historyItems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    console.error("Fetch history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
});

// ==========================================
// ADD CREATION TO HISTORY
// ==========================================

router.post("/", validateCreateHistory, async (req, res) => {
  try {
    // Strictly derive userId from verified JWT
    const userId = req.userId;
    const { prompt, photo, style, ratio, likes, time, date } = req.body;

    const newHistoryItem = await History.create({
      userId,
      prompt,
      photo,
      style: style || "Realistic",
      ratio: ratio || "1:1",
      likes: likes || 0,
      time: time || "",
      date: date || "Today",
    });

    return res.status(201).json({
      success: true,
      data: newHistoryItem,
    });
  } catch (error) {
    console.error("Save history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save history",
    });
  }
});

// ==========================================
// DELETE SPECIFIC HISTORY ITEM (IDOR Safe)
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    // Must match both ID AND owner userId
    const deleted = await History.findOneAndDelete({ _id: id, userId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "History item not found or you do not have permission to delete it",
      });
    }

    return res.status(200).json({
      success: true,
      message: "History item deleted successfully",
    });
  } catch (error) {
    console.error("Delete history item error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete history item",
    });
  }
});

// ==========================================
// CLEAR ALL HISTORY FOR USER (IDOR Safe)
// ==========================================

router.delete("/", async (req, res) => {
  try {
    const userId = req.userId;

    await History.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "User history cleared successfully",
    });
  } catch (error) {
    console.error("Clear user history error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to clear history",
    });
  }
});

export default router;
