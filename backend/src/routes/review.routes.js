const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.post('/', protect, restrictTo('user'), reviewController.createReview);

router.get(
  '/therapist/:therapistId',
  reviewController.getTherapistReviews
);

router.get(
  '/session/:sessionId',
  protect,
  reviewController.getSessionReview
);

router.get(
  '/user/:userId',
  protect,
  reviewController.getUserReviews
);

module.exports = router;
