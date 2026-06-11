const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// URL thực tế: /api/dashboard/revenue
router.get('/revenue', protect, admin, dashboardController.getRevenueDashboard);

module.exports = router;