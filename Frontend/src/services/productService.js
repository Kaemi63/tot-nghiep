import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products';

export const productService = {
  // Lấy tất cả sản phẩm cho admin (mọi status, có filter)
  getAdminProducts: async (token, params = {}) => {
    const { data } = await axios.get(`${API_URL}/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return data;
  },

  // Tạo sản phẩm mới
  createProduct: async (token, productData) => {
    const { data } = await axios.post(API_URL, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  // Cập nhật sản phẩm
  updateProduct: async (token, id, productData) => {
    const { data } = await axios.put(`${API_URL}/${id}`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  // Xóa sản phẩm
  deleteProduct: async (token, id) => {
    const { data } = await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  }
};
