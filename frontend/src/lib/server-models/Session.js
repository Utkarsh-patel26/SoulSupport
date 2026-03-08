import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema(
  {
    therapistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    therapist: {
      name: String,
      photoUrl: String,
      specializations: [String],
    },
    sessionDate: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled_by_user', 'cancelled_by_therapist', 'completed', 'expired'],
      default: 'pending',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

export const SessionModel = mongoose.models.Session || mongoose.model('Session', sessionSchema);
