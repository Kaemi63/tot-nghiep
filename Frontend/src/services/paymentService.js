import { supabase } from './supabaseClient'; // Đảm bảo import đúng đường dẫn đến file cấu hình supabase của bạn

const API_URL = 'http://localhost:3001/api/payments';

// Hàm cấu hình Headers lấy trực tiếp Token chuẩn từ Session của Supabase
const getAuthConfig = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session ? `Bearer ${session.access_token}` : '',
    },
  };
};

export const paymentService = {
  // 1. Khởi tạo một giao dịch thanh toán mới (MoMo, COD...)
  createPayment: async (paymentData) => {
    const config = await getAuthConfig();
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: config.headers,
      body: JSON.stringify(paymentData),
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Khởi tạo thanh toán thất bại');
    return result;
  },

  // 2. Lấy lịch sử giao dịch thanh toán cá nhân của khách hàng hiện tại
  getMyPaymentHistory: async () => {
    const config = await getAuthConfig();
    const response = await fetch(`${API_URL}/my-history`, {
      method: 'GET',
      headers: config.headers,
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Không thể tải lịch sử thanh toán');
    return result;
  },

  // 3. Lấy toàn bộ danh sách giao dịch thanh toán hệ thống (Dành cho Admin đối soát)
  getAllPaymentsForAdmin: async () => {
    const config = await getAuthConfig();
    const response = await fetch(`${API_URL}/admin/all`, {
      method: 'GET',
      headers: config.headers,
    });
    
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Lỗi phân quyền truy cập dữ liệu quản trị');
    return result;
  },
};