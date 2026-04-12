const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, chatbotController.handleChat);
router.get('/history/:sessionId', protect, chatbotController.getHistory);
router.post('/session', protect, chatbotController.createSession);

module.exports = router;