const API_URL = 'http://localhost:3001/api/banners';

// Hàm helper để lấy token từ localStorage (phục vụ cho các quyền Admin)
const getAuthConfig = () => {
  const token = localStorage.getItem('fsa_token');
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

export const bannerService = {
  // 1. Lấy banner công khai cho Trang chủ (Không cần token)
  getPublicBanners: async () => {
    const response = await fetch(`${API_URL}/public`);
    if (!response.ok) throw new Error('Không thể tải danh sách banner trang chủ');
    return await response.json();
  },

  // 2. Lấy tất cả danh sách banner (Yêu cầu quyền Admin)
  getAllBannersForAdmin: async () => {
    const response = await fetch(`${API_URL}/admin/all`, {
      method: 'GET',
      ...getAuthConfig(),
    });
    if (!response.ok) throw new Error('Không có quyền lấy dữ liệu quản trị banner');
    return await response.json();
  },

  // 3. Tạo mới Banner (Yêu cầu quyền Admin)
  createBanner: async (bannerData) => {
    const response = await fetch(`${API_URL}/admin/create`, {
      method: 'POST',
      ...getAuthConfig(),
      body: JSON.stringify(bannerData),
    });
    if (!response.ok) throw new Error('Lỗi khi tạo mới banner');
    return await response.json();
  },

  // 4. Cập nhật Banner (Yêu cầu quyền Admin)
  updateBanner: async (id, bannerData) => {
    const response = await fetch(`${API_URL}/admin/update/${id}`, {
      method: 'PUT',
      ...getAuthConfig(),
      body: JSON.stringify(bannerData),
    });
    if (!response.ok) throw new Error('Lỗi khi cập nhật banner');
    return await response.json();
  },

  // 5. Xóa Banner (Yêu cầu quyền Admin)
  deleteBanner: async (id) => {
    const response = await fetch(`${API_URL}/admin/delete/${id}`, {
      method: 'DELETE',
      ...getAuthConfig(),
    });
    if (!response.ok) throw new Error('Lỗi khi xóa banner');
    return await response.json();
  },
};