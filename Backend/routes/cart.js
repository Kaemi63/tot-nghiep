const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/item/:itemId', cartController.removeFromCart);
router.put('/update', cartController.updateCartItem);

module.exports = router;