import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    userType: { type: String, enum: ['user', 'therapist', 'admin'], required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    bio: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
