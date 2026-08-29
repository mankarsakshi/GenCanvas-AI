import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: "default_user",
    },
    postId: {
      type: String,
    },
    name: {
      type: String,
      default: "GenCanvas Creator",
    },
    prompt: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 1,
    },
    style: {
      type: String,
      default: "Digital Art",
    },
    ratio: {
      type: String,
      default: "1:1",
    },
  },
  {
    timestamps: true,
  }
);

const Favorite = mongoose.model("Favorite", favoriteSchema);

export default Favorite;
