import axios from 'axios';

// Giữ URL gốc đến prefix api
const API_URL = 'http://localhost:3001/api/coupons';

const couponService = {
  applyCoupon: async (token, code, orderValue) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply`, // Chỉ cần /apply vì API_URL đã có /api/coupons
        { code, orderValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Không thể áp dụng mã giảm giá";
    }
  },

  getPublicCoupons: async () => {
    try {
      const response = await axios.get(`${API_URL}/public`);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách coupon:", error);
      return [];
    }
  }
};

export default couponService; // Dùng export default để hook import dễ hơn