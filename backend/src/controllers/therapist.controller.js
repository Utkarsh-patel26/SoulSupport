const TherapistProfile = require('../models/TherapistProfile.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const uploadService = require('../services/upload.service');
const { getPaginationMetadata } = require('../utils/helpers');

// Find therapist profile by profile id or fallback to user id
async function findTherapistByIdOrUser(id) {
  let therapist = await TherapistProfile.findById(id);
  if (!therapist) {
    therapist = await TherapistProfile.findOne({ userId: id });
  }
  return therapist;
}

/**
 * @desc    Get all therapists
 * @route   GET /api/therapists
 * @access  Public
 */
exports.getTherapists = asyncHandler(async (req, res) => {
  const {
    specialization,
    minRating = 0,
    maxRate,
    page = 1,
    limit = 12,
  } = req.query;

  const filter = { isVerified: true };

  if (specialization) {
    filter.specializations = specialization;
  }

  if (minRating) {
    filter.rating = { $gte: parseFloat(minRating) };
  }

  if (maxRate) {
    filter.hourlyRate = { $lte: parseFloat(maxRate) };
  }

  const skip = (page - 1) * limit;

  const therapists = await TherapistProfile.find(filter)
    .populate('userId', 'fullName email avatarUrl bio')
    .sort({ rating: -1, totalReviews: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  // Transform to include user data
  const transformedTherapists = therapists.map((t) => ({
    _id: t._id,
    user: t.userId,
    ...t.toObject(),
  }));

  const total = await TherapistProfile.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        therapists: transformedTherapists,
        pagination: getPaginationMetadata(page, limit, total),
      },
      'Therapists retrieved successfully'
    )
  );
});

/**
 * @desc    Get single therapist
 * @route   GET /api/therapists/:id
 * @access  Public
 */
exports.getTherapist = asyncHandler(async (req, res) => {
  const therapist = await findTherapistByIdOrUser(req.params.id);

  if (therapist) {
    await therapist.populate('userId', 'fullName email avatarUrl bio');
  }

  if (!therapist) {
    throw new ApiError(404, 'Therapist not found');
  }

  res.json(
    new ApiResponse(
      200,
      { therapist: { ...therapist.toObject(), user: therapist.userId } },
      'Therapist retrieved successfully'
    )
  );
});

/**
 * @desc    Update therapist profile
 * @route   PUT /api/therapists/:id
 * @access  Private (Therapist only)
 */
exports.updateProfile = asyncHandler(async (req, res) => {
  const therapist = await findTherapistByIdOrUser(req.params.id);

  if (!therapist) {
    throw new ApiError(404, 'Therapist profile not found');
  }

  if (therapist.userId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to update this profile');
  }

  const updateData = req.body;

  // Persist name/bio changes to the base User document
  const { fullName, bio } = updateData;
  if (fullName !== undefined || bio !== undefined) {
    await User.findByIdAndUpdate(
      therapist.userId,
      {
        ...(fullName !== undefined ? { fullName } : {}),
        ...(bio !== undefined ? { bio } : {}),
      },
      { new: true }
    );
  }

  const updatedTherapist = await TherapistProfile.findByIdAndUpdate(
    therapist._id,
    updateData,
    { new: true, runValidators: true }
  ).populate('userId', 'fullName email avatarUrl bio');

  res.json(
    new ApiResponse(
      200,
      { therapist: updatedTherapist },
      'Profile updated successfully'
    )
  );
});

/**
 * @desc    Upload therapist photo
 * @route   POST /api/therapists/:id/photo
 * @access  Private (Therapist only)
 */
exports.uploadPhoto = asyncHandler(async (req, res) => {
  const therapist = await findTherapistByIdOrUser(req.params.id);

  if (!therapist) {
    throw new ApiError(404, 'Therapist profile not found');
  }

  if (therapist.userId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Not authorized to update this profile');
  }

  if (!req.file) {
    throw new ApiError(400, 'Please upload a photo');
  }

  const result = await uploadService.uploadImage(req.file, 'therapists');

  therapist.photoUrl = result.url;
  await therapist.save();

  // Keep user avatar in sync
  await User.findByIdAndUpdate(therapist.userId, { avatarUrl: result.url });

  res.json(
    new ApiResponse(
      200,
      { photoUrl: result.url },
      'Photo uploaded successfully'
    )
  );
});

/**
 * @desc    Get therapist reviews
 * @route   GET /api/therapists/:id/reviews
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res) => {
  const therapist = await findTherapistByIdOrUser(req.params.id);

  if (!therapist) {
    throw new ApiError(404, 'Therapist not found');
  }

  const Review = require('../models/Review.model');
  const reviews = await Review.find({ therapistId: therapist.userId })
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(
    new ApiResponse(200, { reviews }, 'Reviews retrieved successfully')
  );
});

/**
 * @desc    Check therapist availability
 * @route   GET /api/therapists/:id/availability
 * @access  Public
 */
exports.checkAvailability = asyncHandler(async (req, res) => {
  const { date, time } = req.query;

  if (!date || !time) {
    throw new ApiError(400, 'Date and time are required');
  }

  const therapist = await findTherapistByIdOrUser(req.params.id);

  if (!therapist) {
    throw new ApiError(404, 'Therapist not found');
  }

  const Session = require('../models/Session.model');
  const sessionDate = new Date(`${date}T${time}`);

  const existingSession = await Session.findOne({
    therapistId: therapist.userId,
    sessionDate,
    status: { $in: ['pending', 'confirmed'] },
  });

  res.json(
    new ApiResponse(
      200,
      { available: !existingSession },
      existingSession ? 'Time slot not available' : 'Time slot available'
    )
  );
});
