const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');

router.get('/:id', protect, userController.getUser);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);
router.put('/:id/avatar', protect, uploadSingle('avatar'), userController.updateAvatar);
router.get('/:id/stats', protect, userController.getUserStats);

module.exports = router;
