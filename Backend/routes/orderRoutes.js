const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/checkout', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);

module.exports = router;