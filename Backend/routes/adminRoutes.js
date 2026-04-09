const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);
router.use(admin);

router.post('/update-user', adminController.updateUser);
router.delete('/delete-user/:id', adminController.deleteUser);

module.exports = router;