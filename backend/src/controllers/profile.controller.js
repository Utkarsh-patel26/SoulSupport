const User = require('../models/User.model');
const TherapistProfile = require('../models/TherapistProfile.model');
const Session = require('../models/Session.model');
const Review = require('../models/Review.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const uploadService = require('../services/upload.service');

function mapPublicProfile(user, therapistProfile = null) {
  return {
    _id: user._id,
    userType: user.userType,
    fullName: user.fullName,
    username: user.username,
    bio: user.bio,
    location: user.location,
    avatarUrl: user.avatarUrl,
    email: user.email,
    createdAt: user.createdAt,
    lastActive: user.lastActive || user.lastLogin,
    mentalHealthGoals: user.mentalHealthGoals || [],
    preferredTherapyTypes: user.preferredTherapyTypes || [],
    therapistProfile: therapistProfile
      ? {
          specializations: therapistProfile.specializations || [],
          qualifications: therapistProfile.qualifications,
          experienceYears: therapistProfile.experienceYears,
          languages: therapistProfile.languages || [],
          sessionPricing: therapistProfile.sessionPricing || therapistProfile.hourlyRate,
          hourlyRate: therapistProfile.hourlyRate,
          availability: therapistProfile.availability,
          weeklyAvailability: therapistProfile.weeklyAvailability,
          totalSessions: therapistProfile.totalSessions,
          averageRating: therapistProfile.rating,
          reviewCount: therapistProfile.totalReviews,
          professionalPhotoUrl:
            therapistProfile.professionalPhotoUrl || therapistProfile.photoUrl || user.avatarUrl,
        }
      : null,
  };
}

async function buildSessionHistoryForUser(userId) {
  const sessions = await Session.find({ userId }).sort({ sessionDate: -1 }).limit(20);
  return sessions.map((session) => ({
    sessionId: session._id,
    therapistId: session.therapistId,
    sessionDate: session.sessionDate,
    status: session.status,
    meetingStatus: session.meetingStatus,
  }));
}

exports.getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const therapistProfile =
    user.userType === 'therapist'
      ? await TherapistProfile.findOne({ userId: user._id })
      : null;

  const profile = mapPublicProfile(user, therapistProfile);
  if (user.userType === 'user') {
    profile.pastSessionsHistory = await buildSessionHistoryForUser(user._id);
  }

  res.json(new ApiResponse(200, { profile }, 'Profile retrieved successfully'));
});

exports.getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'Profile not found');

  const therapistProfile =
    user.userType === 'therapist'
      ? await TherapistProfile.findOne({ userId: user._id })
      : null;

  const profile = mapPublicProfile(user, therapistProfile);
  profile.email = undefined;

  const latestReviews = therapistProfile
    ? await Review.find({ therapistId: user._id }).sort({ createdAt: -1 }).limit(10)
    : [];

  res.json(
    new ApiResponse(
      200,
      {
        profile,
        latestReviews,
      },
      'Public profile retrieved successfully'
    )
  );
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const {
    fullName,
    username,
    bio,
    location,
    email,
    mentalHealthGoals,
    preferredTherapyTypes,
    specializations,
    qualifications,
    experienceYears,
    languages,
    sessionPricing,
    hourlyRate,
    availability,
    weeklyAvailability,
  } = req.body;

  const userUpdates = {
    ...(fullName !== undefined ? { fullName } : {}),
    ...(username !== undefined ? { username } : {}),
    ...(bio !== undefined ? { bio } : {}),
    ...(location !== undefined ? { location } : {}),
    ...(email !== undefined ? { email } : {}),
    ...(mentalHealthGoals !== undefined ? { mentalHealthGoals } : {}),
    ...(preferredTherapyTypes !== undefined ? { preferredTherapyTypes } : {}),
  };

  await User.findByIdAndUpdate(user._id, userUpdates, {
    new: true,
    runValidators: true,
  });

  if (user.userType === 'therapist') {
    const therapistUpdates = {
      ...(specializations !== undefined ? { specializations } : {}),
      ...(qualifications !== undefined ? { qualifications } : {}),
      ...(experienceYears !== undefined ? { experienceYears } : {}),
      ...(languages !== undefined ? { languages } : {}),
      ...(sessionPricing !== undefined ? { sessionPricing } : {}),
      ...(hourlyRate !== undefined ? { hourlyRate } : {}),
      ...(availability !== undefined ? { availability } : {}),
      ...(weeklyAvailability !== undefined ? { weeklyAvailability } : {}),
    };

    await TherapistProfile.findOneAndUpdate(
      { userId: user._id },
      therapistUpdates,
      { new: true, runValidators: true, upsert: true }
    );
  }

  const updatedUser = await User.findById(user._id);
  const therapistProfile =
    updatedUser.userType === 'therapist'
      ? await TherapistProfile.findOne({ userId: updatedUser._id })
      : null;

  const profile = mapPublicProfile(updatedUser, therapistProfile);
  if (updatedUser.userType === 'user') {
    profile.pastSessionsHistory = await buildSessionHistoryForUser(updatedUser._id);
  }

  res.json(new ApiResponse(200, { profile }, 'Profile updated successfully'));
});

exports.uploadProfilePhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload a photo');
  }

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found');

  const result = await uploadService.uploadImage(req.file, 'profiles');
  await User.findByIdAndUpdate(user._id, { avatarUrl: result.url });

  if (user.userType === 'therapist') {
    await TherapistProfile.findOneAndUpdate(
      { userId: user._id },
      {
        photoUrl: result.url,
        professionalPhotoUrl: result.url,
      },
      { upsert: true }
    );
  }

  res.json(
    new ApiResponse(
      200,
      { photoUrl: result.url },
      'Profile photo uploaded successfully'
    )
  );
});
