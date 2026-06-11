const express = require('express');
const router = express.Router();
const adminChatbotController = require('../controllers/adminChatbotController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/sessions', protect, admin, adminChatbotController.createAdminSession);
router.get('/sessions', protect, admin, adminChatbotController.getAdminSessions);
router.put('/sessions/:id', protect, admin, adminChatbotController.updateAdminSessionTitle);
router.get('/sessions/:sessionId/messages', protect, admin, adminChatbotController.getAdminMessageHistory);
router.delete('/sessions/:id', protect, admin, adminChatbotController.deleteAdminSession);
router.post('/analytics-chat', protect, admin, adminChatbotController.handleAdminAnalyticsChat);

module.exports = router;