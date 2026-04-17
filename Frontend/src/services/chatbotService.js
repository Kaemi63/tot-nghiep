import axios from 'axios';

const API_URL = 'http://localhost:3001/api/chat';

// Helper để tạo header
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const chatbotService = {
  // 1. Lấy danh sách các cuộc hội thoại (Hiện ở Sidebar)
  getSessions: async (token) => {
    const response = await axios.get(`${API_URL}/sessions`, getAuthHeaders(token));
    return response.data;
  },

  // 2. Lấy lịch sử tin nhắn của 1 session (Đổ vào khung chat)
  getHistory: async (sessionId, token) => {
    const response = await axios.get(`${API_URL}/history/${sessionId}`, getAuthHeaders(token));
    return response.data;
  },

  // 3. Tạo cuộc hội thoại mới
  createSession: async (token) => {
    const response = await axios.post(`${API_URL}/session`, {}, getAuthHeaders(token));
    return response.data;
  }
};