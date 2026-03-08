import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String },
    content: { type: String, required: true },
    commentsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ForumPostModel = mongoose.models.ForumPost || mongoose.model('ForumPost', forumPostSchema);
