const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile/:id', authController.getProfile);
router.post('/update-profile', authController.updateProfile);
router.post('/change-password', authController.changePassword);
module.exports = router;