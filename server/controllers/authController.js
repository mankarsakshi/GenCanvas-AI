import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../mongodb/models/User.js";

// ==========================================
// SIGNUP
// ==========================================

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const username = name.toLowerCase().trim().replace(/[@\s]/g, "");
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      username: username,
    });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        bio: user.bio,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        plan: user.plan,
        role: user.role,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, ""),
        bio: user.bio,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        plan: user.plan,
        role: user.role,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, ""),
        bio: user.bio,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        plan: user.plan,
        role: user.role,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Get user error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { name, username, bio, profileImage, coverImage } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name && name.trim()) user.name = name.trim();
    if (username !== undefined) user.username = username.toLowerCase().trim().replace(/[@\s]/g, "");
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;
    if (coverImage !== undefined) user.coverImage = coverImage;

    await user.save();

    const updatedUser = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username || user.name.toLowerCase().replace(/\s+/g, ""),
      bio: user.bio,
      profileImage: user.profileImage,
      coverImage: user.coverImage,
      plan: user.plan,
      role: user.role,
      settings: user.settings,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// ==========================================
// UPDATE AVATAR
// ==========================================

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.profileImage = profileImage;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      profileImage: user.profileImage,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username || user.name.toLowerCase().replace(/\s+/g, ""),
        bio: user.bio,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
        plan: user.plan,
        role: user.role,
        settings: user.settings,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Update avatar error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update avatar",
    });
  }
};

// ==========================================
// GET USER SETTINGS
// ==========================================

export const getUserSettings = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const defaultSettings = {
      theme: "Light",
      defaultStyle: "Realistic",
      quality: "High",
      aspectRatio: "1:1",
      generationComplete: true,
      weeklyUpdates: true,
      favoriteUpdates: false,
      privateCreations: false,
      saveHistory: true,
    };

    const userSettings = user.settings
      ? { ...defaultSettings, ...(user.settings.toObject ? user.settings.toObject() : user.settings) }
      : defaultSettings;

    return res.status(200).json({
      success: true,
      settings: userSettings,
    });
  } catch (error) {
    console.log("Get settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get settings",
    });
  }
};

// ==========================================
// UPDATE USER SETTINGS
// ==========================================

export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;
    const newSettings = req.body.settings || req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.settings) {
      user.settings = {};
    }

    if (newSettings.theme !== undefined) user.settings.theme = newSettings.theme;
    if (newSettings.defaultStyle !== undefined) user.settings.defaultStyle = newSettings.defaultStyle;
    if (newSettings.quality !== undefined) user.settings.quality = newSettings.quality;
    if (newSettings.aspectRatio !== undefined) user.settings.aspectRatio = newSettings.aspectRatio;
    if (newSettings.generationComplete !== undefined) user.settings.generationComplete = Boolean(newSettings.generationComplete);
    if (newSettings.weeklyUpdates !== undefined) user.settings.weeklyUpdates = Boolean(newSettings.weeklyUpdates);
    if (newSettings.favoriteUpdates !== undefined) user.settings.favoriteUpdates = Boolean(newSettings.favoriteUpdates);
    if (newSettings.privateCreations !== undefined) user.settings.privateCreations = Boolean(newSettings.privateCreations);
    if (newSettings.saveHistory !== undefined) user.settings.saveHistory = Boolean(newSettings.saveHistory);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      settings: user.settings,
    });
  } catch (error) {
    console.log("Update settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

// ==========================================
// DELETE USER ACCOUNT
// ==========================================

export const deleteUserAccount = async (req, res) => {
  try {
    const userId = req.userId || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log("Delete account error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};