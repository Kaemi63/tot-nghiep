const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');


router.get('/public', bannerController.getPublicBanners);

// Lấy tất cả danh sách banner để hiển thị trong bảng quản lý của Admin Dashboard
router.get('/admin/all', protect, admin, bannerController.getAllBannersForAdmin);

// Tạo mới một banner
router.post('/admin/create', protect, admin, bannerController.createBanner);

// Cập nhật thông tin một banner theo ID
router.put('/admin/update/:id', protect, admin, bannerController.updateBanner);

// Xóa một banner theo ID
router.delete('/admin/delete/:id', protect, admin, bannerController.deleteBanner);

module.exports = router;