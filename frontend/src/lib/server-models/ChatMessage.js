import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    collection: 'chat_messages',
    versionKey: false,
  }
);

chatMessageSchema.index({ userId: 1, timestamp: -1 });

export const ChatMessageModel =
  mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);
