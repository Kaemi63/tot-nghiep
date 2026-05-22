const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

// 1. Cổng Webhook/IPN này để MỞ HOÀN TOÀN (Không có middleware 'protect') để MoMo có thể bắn dữ liệu về
router.post('/webhook', paymentController.handlePaymentWebhook);

// 2. Các cổng thao tác của người dùng và Admin thì bảo vệ nghiêm ngặt bằng token
router.post('/create', protect, paymentController.createPayment);
router.get('/my-history', protect, paymentController.getMyPayments);
router.get('/admin/all', protect, admin, paymentController.getAllPaymentsForAdmin);

module.exports = router;