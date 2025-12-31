const Joi = require('joi');

exports.updateTherapistProfileSchema = Joi.object({
  specializations: Joi.array().items(
    Joi.string().valid(
      'anxiety',
      'depression',
      'relationships',
      'stress',
      'trauma',
      'addiction',
      'grief',
      'self-esteem',
      'career',
      'family'
    )
  ),
  qualifications: Joi.string(),
  experienceYears: Joi.number().min(0),
  hourlyRate: Joi.number().min(0),
  availability: Joi.object({
    days: Joi.array().items(
      Joi.string().valid(
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      )
    ),
    timeStart: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
    timeEnd: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/),
  }),
  bio: Joi.string().max(500),
});
