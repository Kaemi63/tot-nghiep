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
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile || profile.role !== 'admin') {
      return res.status(403).json({ error: "Quyền truy cập bị từ chối. Chỉ dành cho Admin." });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Lỗi kiểm tra quyền admin" });
  }
};

module.exports = { protect, admin };
