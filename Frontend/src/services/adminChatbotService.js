import axios from 'axios';
import { API_BASE_URL } from '../config/api';
const API_URL = `${API_BASE_URL}/api/admin-chatbot`;

// Helper để tạo header xác thực
const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const adminChatbotService = {
  // 1. Gửi tin nhắn và nhận luồng Stream (Dành cho khung chat)
  sendAnalyticsMessage: async (token, sessionId, messages) => {
    const response = await fetch(`${API_URL}/analytics-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        sessionId,
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`Lỗi kết nối AI (${response.status})`);
    }

    return response.body; 
  },

  // 2. Lấy danh sách các cuộc hội thoại (Hiện ở Sidebar Admin)
  getSessions: async (token) => {
    const response = await axios.get(`${API_URL}/sessions`, getAuthHeaders(token));
    return response.data;
  },

  // 3. Lấy lịch sử tin nhắn của 1 session (Đổ vào khung chat)
  getHistory: async (sessionId, token) => {
    const response = await axios.get(`${API_URL}/sessions/${sessionId}/messages`, getAuthHeaders(token));
    return response.data;
  },

  // 4. Tạo cuộc hội thoại mới
  createSession: async (token) => {
    const response = await axios.post(`${API_URL}/sessions`, {}, getAuthHeaders(token));
    return response.data;
  },

  // 5. Xóa một session
  deleteSession: async (sessionId, token) => {
    const response = await axios.delete(`${API_URL}/sessions/${sessionId}`, getAuthHeaders(token));
    return response.data;
  },

  // 6. Đổi tên cuộc hội thoại
  renameSession: async (sessionId, title, token) => {
    const response = await axios.put(
      `${API_URL}/sessions/${sessionId}`, 
      { title }, 
      getAuthHeaders(token)
    );
    return response.data;
  }
};