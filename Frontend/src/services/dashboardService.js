import { API_BASE_URL } from '../config/api';
const API_URL = `${API_BASE_URL}/api/dashboard`;

export const dashboardService = {
  /**
   * Lấy dữ liệu phân tích doanh thu cho Dashboard
   * @param {string} token - Mã xác thực của phiên đăng nhập
   * @param {string} startDate - Định dạng YYYY-MM-DD (Tùy chọn)
   * @param {string} endDate - Định dạng YYYY-MM-DD (Tùy chọn)
   */
  async getRevenueData(token, startDate = '', endDate = '') {
    let url = `${API_URL}/revenue`;
    const params = new URLSearchParams();
    
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error(`Server Error ${res.status}:`, errorData);
      throw new Error(errorData.error || `Lỗi server (${res.status})`);
    }

    return res.json();
  }
};