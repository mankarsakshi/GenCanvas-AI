import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      default: "Creating amazing images with AI and exploring creative ideas with AI Studio.",
    },

    profileImage: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    plan: {
      type: String,
      default: "Free Plan",
    },

    role: {
      type: String,
      default: "Creator",
    },

    settings: {
      theme: {
        type: String,
        default: "Light",
      },
      defaultStyle: {
        type: String,
        default: "Realistic",
      },
      quality: {
        type: String,
        default: "High",
      },
      aspectRatio: {
        type: String,
        default: "1:1",
      },
      generationComplete: {
        type: Boolean,
        default: true,
      },
      weeklyUpdates: {
        type: Boolean,
        default: true,
      },
      favoriteUpdates: {
        type: Boolean,
        default: false,
      },
      privateCreations: {
        type: Boolean,
        default: false,
      },
      saveHistory: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;