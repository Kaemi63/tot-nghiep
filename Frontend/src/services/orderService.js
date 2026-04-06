// src/services/orderService.js
const API_URL = 'http://localhost:3001/api/orders';

export const orderService = {
  /**
   * Tạo đơn hàng mới
   * @param {string} token - Lấy từ supabase.auth.getSession()
   * @param {Object} orderData - Dữ liệu từ CheckoutForm
   */
  async createOrder(token, orderData) {
    try {
      // LOG ĐỂ KIỂM TRA (Bạn hãy mở Console F12 để xem token có tồn tại không)
      console.log("Token gửi đi:", token ? "Đã có token" : "THIẾU TOKEN");
      console.log("Dữ liệu đơn hàng:", orderData);

      const res = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Rất quan trọng: Phải có chữ 'Bearer ' trước token
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(orderData)
      });

      const contentType = res.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        
        if (!res.ok) {
          // Đây là nơi bạn nhận lỗi "Giỏ hàng trống" từ Backend
          throw new Error(data.error || `Lỗi ${res.status}: Không thể tạo đơn hàng`);
        }
        
        return data; // Trả về { order_code, id, ... }
      } else {
        const text = await res.text();
        throw new Error("Server trả về định dạng không phải JSON. Có thể lỗi Route.");
      }
    } catch (error) {
      console.error("OrderService Error:", error);
      throw error;
    }
  },

  async getMyOrders(token) {
    const res = await fetch(`${API_URL}/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể lấy lịch sử đơn hàng');
    return res.json();
  }
};