import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    style: {
      type: String,
      default: "Realistic",
    },
    ratio: {
      type: String,
      default: "1:1",
    },
    likes: {
      type: Number,
      default: 0,
    },
    time: {
      type: String,
      default: "",
    },
    date: {
      type: String,
      default: "Today",
    },
  },
  {
    timestamps: true,
  }
);

const History = mongoose.model("History", historySchema);

export default History;
