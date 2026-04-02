const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/profile/:id', protect, authController.getProfile);
router.post('/update-profile',protect, authController.updateProfile);
router.post('/change-password', protect, authController.changePassword);
module.exports = router;