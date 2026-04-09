import axios from 'axios';

const API_URL = 'http://localhost:3001/api/reviews';

export const reviewService = {
  // 1. Gửi đánh giá mới lên Backend
  createReview: async (token, reviewData) => {
    try {
      const response = await axios.post(
        `${API_URL}`,
        reviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Không thể gửi đánh giá";
    }
  },

  // 2. Lấy danh sách đánh giá của sản phẩm (Public)
  getProductReviews: async (productId) => {
    try {
      const response = await axios.get(`${API_URL}/product/${productId}`);
      return response.data; // Mảng các review kèm profiles và images
    } catch (error) {
      console.error("Lỗi lấy danh sách review:", error);
      return [];
    }
  },

  // 3. Admin: Ẩn/Duyệt review
  updateStatus: async (token, reviewId, status) => {
    try {
      const response = await axios.patch(
        `${API_URL}/admin/${reviewId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Lỗi cập nhật trạng thái";
    }
  }
};