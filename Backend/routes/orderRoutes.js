const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/checkout', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/all', admin, orderController.getAllOrders);
router.put('/:orderId/status', admin, orderController.updateOrderStatus);

module.exports = router;