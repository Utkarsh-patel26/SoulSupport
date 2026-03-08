const Session = require('../models/Session.model');
const User = require('../models/User.model');
const TherapistProfile = require('../models/TherapistProfile.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const notificationService = require('../services/notification.service');
const emailService = require('../services/email.service');
const ratingService = require('../services/rating.service');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/**
 * @desc    Parse "HH:MM" to hour number
 */
function parseHour(timeStr) {
  return parseInt(timeStr.split(':')[0], 10);
}

/**
 * @desc    Get user or therapist sessions
 * @route   GET /api/sessions
 * @access  Private
 */
exports.getSessions = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter =
    req.user.userType === 'therapist'
      ? { therapistId: req.user._id }
      : { userId: req.user._id };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const sessions = await Session.find(filter)
    .sort({ sessionDate: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Session.countDocuments(filter);

  res.json(
    new ApiResponse(
      200,
      {
        sessions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Sessions retrieved successfully'
    )
  );
});

/**
 * @desc    Update session details (reschedule / notes)
 * @route   PUT /api/sessions/:id
 * @access  Private (User or Therapist on the session)
 */
exports.updateSession = asyncHandler(async (req, res) => {
  const { sessionDate, durationMinutes, notes } = req.body;

  const session = await Session.findById(req.params.id);
  if (!session) throw new ApiError(404, 'Session not found');

  if (
    session.userId.toString() !== req.user.id.toString() &&
    session.therapistId.toString() !== req.user.id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to update this session');
  }

  if (session.status === 'completed' || session.status === 'cancelled') {
    throw new ApiError(400, 'Cannot update completed or cancelled sessions');
  }

  if (sessionDate) session.sessionDate = new Date(sessionDate);
  if (durationMinutes) session.durationMinutes = durationMinutes;
  if (notes !== undefined) session.notes = notes;

  await session.save();

  res.json(new ApiResponse(200, { session }, 'Session updated successfully'));
});

/**
 * @desc    Get upcoming sessions
 * @route   GET /api/sessions/upcoming
 * @access  Private
 */
exports.getUpcoming = asyncHandler(async (req, res) => {
  const filter =
    req.user.userType === 'therapist'
      ? { therapistId: req.user._id }
      : { userId: req.user._id };

  const sessions = await Session.find({
    ...filter,
    sessionDate: { $gte: new Date() },
    status: { $in: ['pending', 'confirmed'] },
  })
    .sort({ sessionDate: 1 })
    .limit(10);

  res.json(new ApiResponse(200, { sessions }, 'Upcoming sessions retrieved'));
});

/**
 * @desc    Get available time slots for a therapist on a specific date
 * @route   GET /api/sessions/available-slots/:therapistId
 * @access  Public
 */
exports.getAvailableSlots = asyncHandler(async (req, res) => {
  const { therapistId } = req.params;
  const { date } = req.query;

  if (!date) {
    throw new ApiError(400, 'Date is required');
  }

  // Check if therapist exists - try both direct user lookup and therapist profile lookup
  let therapistUser = await User.findById(therapistId);
  
  if (!therapistUser) {
    // Maybe it's a therapist profile lookup
    const therapistProfile = await TherapistProfile.findOne({ userId: therapistId }).populate('userId');
    if (!therapistProfile) {
      throw new ApiError(404, 'Therapist not found');
    }
    therapistUser = therapistProfile.userId;
  }

  if (therapistUser.userType !== 'therapist') {
    throw new ApiError(404, 'Therapist not found');
  }

  // Get therapist profile for availability
  const therapistProfile = await TherapistProfile.findOne({ userId: therapistUser._id });

  // Parse date string (YYYY-MM-DD)
  const [year, month, day] = date.split('-').map(Number);
  const requestedDate = new Date(year, month - 1, day);
  const requestedDay = DAY_NAMES[requestedDate.getDay()];

  // Check if therapist is available on this day
  const availableDays = therapistProfile?.availability?.days || [];
  if (availableDays.length > 0 && !availableDays.includes(requestedDay)) {
    return res.json(
      new ApiResponse(
        200,
        { bookedHours: [], availableDays, isAvailableDay: false },
        `Therapist is not available on ${requestedDay}`
      )
    );
  }

  // Determine working hours from therapist profile
  const startHour = parseHour(therapistProfile?.availability?.timeStart || '09:00');
  const endHour = parseHour(therapistProfile?.availability?.timeEnd || '17:00');

  const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

  // Find all booked sessions for this therapist on this date
  const bookedSessions = await Session.find({
    therapistId: therapistUser._id,
    sessionDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $in: ['pending', 'confirmed'] },
  });

  // Extract booked hours
  const bookedHours = bookedSessions.map((session) => {
    const hour = new Date(session.sessionDate).getHours();
    return hour;
  });

  res.json(
    new ApiResponse(
      200,
      { bookedHours, startHour, endHour, availableDays, isAvailableDay: true },
      'Available slots retrieved successfully'
    )
  );
});

/**
 * @desc    Create a new session (book)
 * @route   POST /api/sessions
 * @access  Private (User only)
 */
exports.createSession = asyncHandler(async (req, res) => {
  const { therapistId, sessionDate, durationMinutes, notes } = req.body;

  // Prevent therapists from booking sessions
  if (req.user.userType === 'therapist') {
    throw new ApiError(403, 'Therapists cannot book sessions');
  }

  // Check if therapist exists
  const therapistProfile = await TherapistProfile.findOne({
    userId: therapistId,
  }).populate('userId');

  if (!therapistProfile) {
    throw new ApiError(404, 'Therapist not found');
  }

  const sessionDateTime = new Date(sessionDate);
  const sessionHour = sessionDateTime.getHours();

  // Normalize to start of hour to prevent duplicate bookings within the same slot
  sessionDateTime.setMinutes(0, 0, 0);

  // Validate booking day against therapist's availability
  const bookingDay = DAY_NAMES[sessionDateTime.getDay()];
  const availableDays = therapistProfile.availability?.days || [];

  if (availableDays.length > 0 && !availableDays.includes(bookingDay)) {
    throw new ApiError(
      400,
      `Therapist is not available on ${bookingDay}. Available days: ${availableDays.join(', ')}`
    );
  }

  // Validate time is within therapist's working hours
  const startHour = parseHour(therapistProfile.availability?.timeStart || '09:00');
  const endHour = parseHour(therapistProfile.availability?.timeEnd || '17:00');

  if (sessionHour < startHour || sessionHour >= endHour) {
    throw new ApiError(
      400,
      `Sessions must be booked between ${therapistProfile.availability?.timeStart || '09:00'} and ${therapistProfile.availability?.timeEnd || '17:00'}`
    );
  }

  // Check for double-booking - same therapist, same hour slot
  const existingSession = await Session.findOne({
    therapistId: therapistProfile.userId._id,
    sessionDate: sessionDateTime,
    status: { $in: ['pending', 'confirmed'] },
  });

  if (existingSession) {
    throw new ApiError(409, 'This time slot is already reserved. Please select another time.');
  }

  // Get user info
  const user = await User.findById(req.user.id);

  // Create session (use the actual therapist User ID, not the passed parameter)
  const session = await Session.create({
    therapistId: therapistProfile.userId._id,
    userId: req.user._id,
    therapist: {
      name: therapistProfile.userId.fullName,
      photoUrl: therapistProfile.photoUrl,
      specializations: therapistProfile.specializations,
    },
    user: {
      name: user.fullName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    sessionDate: sessionDateTime,
    durationMinutes: durationMinutes || 60,
    notes,
    status: 'pending',
  });

  // Send notification and email (non-blocking)
  notificationService.notifySessionBooked(
    therapistId,
    req.user._id,
    session._id,
    user.fullName
  ).catch(err => console.error('Failed to send notification:', err));

  emailService.sendSessionBookingEmail(
    therapistProfile.userId.email,
    user.fullName,
    sessionDateTime.toLocaleString()
  ).catch(err => console.error('Failed to send booking email:', err));

  res
    .status(201)
    .json(new ApiResponse(201, { session }, 'Session booked successfully'));
});

/**
 * @desc    Get single session
 * @route   GET /api/sessions/:id
 * @access  Private
 */
exports.getSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  // Check authorization
  if (
    session.userId.toString() !== req.user.id.toString() &&
    session.therapistId.toString() !== req.user.id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to view this session');
  }

  res.json(
    new ApiResponse(200, { session }, 'Session retrieved successfully')
  );
});

/**
 * @desc    Update session status
 * @route   PUT /api/sessions/:id/status
 * @access  Private (Therapist only)
 */
exports.updateSessionStatus = asyncHandler(async (req, res) => {
  const { status, meetingLink, cancelReason } = req.body;

  const session = await Session.findById(req.params.id);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  if (session.therapistId.toString() !== req.user.id.toString()) {
    throw new ApiError(403, 'Only therapist can update session status');
  }

  session.status = status;
  if (meetingLink) session.meetingLink = meetingLink;
  if (cancelReason) session.cancelReason = cancelReason;
  await session.save();

  // Send notifications (non-blocking)
  if (status === 'confirmed') {
    notificationService.notifySessionConfirmed(
      session.userId,
      session.therapistId,
      session._id,
      session.therapist.name
    ).catch(err => console.error('Failed to send confirmation notification:', err));

    emailService.sendSessionConfirmationEmail(
      session.user.email,
      session.therapist.name,
      session.sessionDate.toLocaleString()
    ).catch(err => console.error('Failed to send confirmation email:', err));
  }

  if (status === 'completed') {
    ratingService.incrementSessionCount(session.therapistId).catch(err => 
      console.error('Failed to increment session count:', err)
    );
  }

  res.json(
    new ApiResponse(200, { session }, 'Session status updated successfully')
  );
});

/**
 * @desc    Cancel session
 * @route   DELETE /api/sessions/:id
 * @access  Private
 */
exports.cancelSession = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;

  const session = await Session.findById(req.params.id);

  if (!session) {
    throw new ApiError(404, 'Session not found');
  }

  // Only user or therapist can cancel
  if (
    session.userId.toString() !== req.user.id.toString() &&
    session.therapistId.toString() !== req.user.id.toString()
  ) {
    throw new ApiError(403, 'Not authorized to cancel this session');
  }

  session.status = 'cancelled';
  session.cancelReason = cancelReason;
  await session.save();

  // Notify the other party
  const notifyUserId =
    req.user.id.toString() === session.userId.toString()
      ? session.therapistId
      : session.userId;

  await notificationService.notifySessionCancelled(
    notifyUserId,
    session._id,
    cancelReason
  );

  res.json(new ApiResponse(200, { session }, 'Session cancelled successfully'));
});
