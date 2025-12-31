const Joi = require('joi');

exports.createSessionSchema = Joi.object({
  therapistId: Joi.string().required(),
  sessionDate: Joi.date().min('now').required(),
  durationMinutes: Joi.number().valid(30, 60, 90).default(60),
  notes: Joi.string().max(2000).optional().allow(''),
});

exports.updateSessionSchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'completed', 'cancelled'),
  notes: Joi.string().max(2000).allow(''),
  meetingLink: Joi.string().uri(),
  cancelReason: Joi.string().max(500),
});

exports.updateSessionDetailsSchema = Joi.object({
  sessionDate: Joi.date().min('now'),
  durationMinutes: Joi.number().valid(30, 60, 90),
  notes: Joi.string().max(2000).allow(''),
});
