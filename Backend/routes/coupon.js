const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware')

router.get('/public', couponController.getPublicCoupons);
router.get('/my', protect, couponController.getUserCoupons);
router.post('/apply', protect, couponController.applyCoupon);
router.post('/admin/create', protect, admin, couponController.createCoupon);

module.exports = router;