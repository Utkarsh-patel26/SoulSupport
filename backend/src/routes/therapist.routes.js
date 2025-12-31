const express = require('express');
const router = express.Router();
const therapistController = require('../controllers/therapist.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  updateTherapistProfileSchema,
} = require('../validators/therapist.validator');

router.get('/', therapistController.getTherapists);
router.get('/search', therapistController.getTherapists);

router.get('/:id', therapistController.getTherapist);

router.put(
  '/:id',
  protect,
  restrictTo('therapist'),
  validate(updateTherapistProfileSchema),
  therapistController.updateProfile
);

router.post(
  '/:id/photo',
  protect,
  restrictTo('therapist'),
  uploadSingle('photo'),
  therapistController.uploadPhoto
);

router.get('/:id/reviews', therapistController.getReviews);

router.get('/:id/availability', therapistController.checkAvailability);

module.exports = router;
