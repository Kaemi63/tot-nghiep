const API_URL = 'http://localhost:3001/api/cart';

export const cartService = {
  async getCart(token) {
  const res = await fetch(`${API_URL}/`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!res.ok) {
    // Thêm dòng này để debug
    const errorData = await res.json().catch(() => ({}));
    console.error(`Server Error ${res.status}:`, errorData);
    throw new Error(errorData.error || `Lỗi server (${res.status})`);
  }
  return res.json();
},

  async addToCart(token, payload) {
    const res = await fetch(`${API_URL}/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async removeItem(token, itemId) {
    const res = await fetch(`${API_URL}/item/${itemId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  }
};