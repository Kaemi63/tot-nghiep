/**
 * 1. Định dạng số thành tiền tệ Việt Nam (VND)
 * @param {number|string} num - Số tiền cần định dạng
 * @returns {string} - Ví dụ: 200000 -> "200.000₫"
 */
export const fmt = (num) => {
  if (num === null || num === undefined || num === '') return '0₫';
  
  // Chuyển đổi về kiểu số nếu đầu vào là chuỗi
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '0₫';

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0, // Không hiển thị số thập phân cho VND
  }).format(value);
};

/**
 * 2. Định dạng ngày tháng năm
 * @param {string|Date} dateStr - Chuỗi ngày từ Database (ISO string)
 * @returns {string} - Ví dụ: "2026-04-03" -> "03/04/2026"
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('vi-VN').format(date);
};

/**
 * 3. Rút gọn văn bản (Dùng cho mô tả ngắn sản phẩm)
 * @param {string} text - Văn bản gốc
 * @param {number} limit - Số ký tự tối đa
 */
export const truncateText = (text, limit = 100) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

/**
 * 4. Tạo Slug từ tên sản phẩm (Hữu ích cho Backend)
 * @param {string} title - Ví dụ: "Áo Thun Nam" -> "ao-thun-nam"
 */
export const convertToSlug = (title) => {
  if (!title) return '';
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/([^0-9a-z-\s])/g, '')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};