const supabase = require('../config/supabaseClient');

const protect = async (req, res, next) => {
  let token;

  // Kiểm tra xem có token trong header Authorization không
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Xác thực token với Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ error: 'Phiên đăng nhập hết hạn hoặc không hợp lệ' });
      }

      // Lưu thông tin user vào request để các controller sau có thể dùng
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Không có quyền truy cập' });
    }
  }

  if (!token) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để thực hiện hành động này' });
  }
};

const admin = async (req, res, next) => {
  // Sau khi qua protect, req.user đã có dữ liệu
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', req.user.id)
    .single();

  if (profile && profile.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: "Quyền truy cập bị từ chối. Chỉ dành cho Admin." });
  }
};

module.exports = { protect, admin };
