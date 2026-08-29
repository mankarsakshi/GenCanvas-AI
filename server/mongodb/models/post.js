import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    userId: { type: String, default: 'default_user', index: true },
    name: { type: String, required: true },
    prompt: { type: String, required: true },
    photo: { type: String, required: true },
    likes: { type: Number, default: 0 },
    style: { type: String, default: 'Digital Art' },
    ratio: { type: String, default: '1:1' },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;
