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
  },
  async getAllOrders(token) {
    const res = await fetch(`${API_URL}/all`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Không thể lấy danh sách đơn hàng');
    return res.json();
  },

  async updateOrderStatus(token, orderId, status, note = '') {
    const res = await fetch(`${API_URL}/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, note })
    });

    if (!res.ok) {
      let errorMessage = 'Không thể cập nhật trạng thái đơn hàng';
      try {
        const data = await res.json();
        if (data?.error) errorMessage = data.error;
      } catch (err) {
        console.error('OrderService updateOrderStatus parse error:', err);
      }
      throw new Error(errorMessage);
    }

    return res.json();
  },};