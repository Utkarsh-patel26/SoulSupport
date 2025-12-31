const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    therapistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    therapist: {
      name: String,
      photoUrl: String,
      specializations: [String],
    },
    user: {
      name: String,
      email: String,
      avatarUrl: String,
    },
    sessionDate: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      default: 60,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: 2000,
    },
    meetingLink: {
      type: String,
    },
    cancelReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sessionSchema.index({ therapistId: 1, sessionDate: 1 });
sessionSchema.index({ userId: 1, sessionDate: 1 });
sessionSchema.index({ status: 1, sessionDate: 1 });
sessionSchema.index({ sessionDate: 1 });

// Ensure no double booking
sessionSchema.index(
  { therapistId: 1, sessionDate: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ['pending', 'confirmed'] },
    },
  }
);

module.exports = mongoose.model('Session', sessionSchema);
