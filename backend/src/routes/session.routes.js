const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const {
  createSessionSchema,
  updateSessionSchema,
  updateSessionDetailsSchema,
} = require('../validators/session.validator');

router.get('/', protect, sessionController.getSessions);
router.get('/upcoming', protect, sessionController.getUpcoming);
router.get('/available-slots/:therapistId', sessionController.getAvailableSlots);

router.post(
  '/',
  protect,
  restrictTo('user'),
  validate(createSessionSchema),
  sessionController.createSession
);

router.get('/:id', protect, sessionController.getSession);

router.put(
  '/:id',
  protect,
  validate(updateSessionDetailsSchema),
  sessionController.updateSession
);

router.put(
  '/:id/status',
  protect,
  restrictTo('therapist'),
  validate(updateSessionSchema),
  sessionController.updateSessionStatus
);

router.delete('/:id', protect, sessionController.cancelSession);

module.exports = router;
