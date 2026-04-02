const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/update-user', adminController.updateUser);
router.delete('/delete-user/:id', adminController.deleteUser);

module.exports = router;