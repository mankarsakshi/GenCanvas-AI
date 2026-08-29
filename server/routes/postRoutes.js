import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/Post.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { validateCreatePost } from '../middleware/validate.js';

dotenv.config();

const router = express.Router();

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// ==========================================
// GET POSTS (Paginated with filters)
// ==========================================

router.route('/').get(async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 16));
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.userId) {
      query.userId = req.query.userId;
    }

    if (req.query.style && req.query.style !== 'All Styles' && req.query.style !== 'All') {
      query.style = new RegExp(req.query.style, 'i');
    }

    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.$or = [{ prompt: searchRegex }, { name: searchRegex }, { style: searchRegex }];
    }

    const [posts, total] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Post.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (err) {
    console.error('Fetch posts error:', err.message);
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

// ==========================================
// CREATE POST (Protected & Verified JWT)
// ==========================================

router.route('/').post(authMiddleware, validateCreatePost, async (req, res) => {
  try {
    // Strictly derive userId from verified JWT
    const userId = req.userId;
    const { name, prompt, photo, style, ratio } = req.body;

    let photoUrl = photo;

    // If Cloudinary is configured, upload to Cloudinary for optimized CDN delivery
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET &&
      photo.startsWith('data:')
    ) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(photo);
        photoUrl = uploadResponse.url || uploadResponse.secure_url || photo;
      } catch (cloudErr) {
        console.warn('Cloudinary upload warning:', cloudErr.message);
      }
    }

    const newPost = await Post.create({
      userId,
      name: name || 'GenCanvas Creator',
      prompt,
      photo: photoUrl,
      style: style || 'Digital Art',
      ratio: ratio || '1:1',
    });

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    console.error('Post creation error:', err.message);
    res.status(500).json({ success: false, message: 'Unable to create post. Please try again.' });
  }
});

export default router;
