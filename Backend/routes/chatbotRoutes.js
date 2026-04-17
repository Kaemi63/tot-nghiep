const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

// Gửi tin nhắn và nhận stream từ AI
router.post('/', protect, chatbotController.handleChat);

// Lấy danh sách tất cả các phiên chat (để hiện ở Sidebar)
router.get('/sessions', protect, chatbotController.getSessions); 

// Lấy lịch sử tin nhắn của một phiên chat cụ thể
router.get('/history/:sessionId', protect, chatbotController.getHistory);

// Tạo mới một phiên chat (khi bấm nút "New Chat")
router.post('/session', protect, chatbotController.createSession);

module.exports = router;