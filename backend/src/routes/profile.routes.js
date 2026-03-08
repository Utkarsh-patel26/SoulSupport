const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');
const validate = require('../middlewares/validate.middleware');
const { updateProfileSchema } = require('../validators/profile.validator');

router.get('/me', protect, profileController.getMyProfile);
router.put('/update', protect, validate(updateProfileSchema), profileController.updateProfile);
router.post('/upload-photo', protect, uploadSingle('photo'), profileController.uploadProfilePhoto);
router.get('/:id', profileController.getPublicProfile);

module.exports = router;
