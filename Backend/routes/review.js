const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/product/:productId', reviewController.getProductReviews);
router.post('/', protect, reviewController.createReview);
router.patch('/admin/:reviewId/status', protect, admin, reviewController.updateReviewStatus);

module.exports = router;