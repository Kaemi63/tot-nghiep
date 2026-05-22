const supabase = require('../config/supabaseClient');

// 1. Lấy danh sách banner hiển thị phía Client (Chỉ lấy active, sắp xếp theo sort_order)
exports.getPublicBanners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Lấy TẤT CẢ danh sách banner (Dành cho trang Admin quản lý)
exports.getAllBannersForAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Tạo mới một Banner (Admin)
exports.createBanner = async (req, res) => {
  try {
    const { title, image_url, link, position, status, sort_order } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ success: false, error: "Tiêu đề và đường dẫn ảnh là bắt buộc" });
    }

    const { data, error } = await supabase
      .from('banners')
      .insert([{ title, image_url, link, position, status, sort_order }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, message: "Tạo banner thành công", data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Cập nhật Banner (Admin)
exports.updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image_url, link, position, status, sort_order } = req.body;

    const { data, error } = await supabase
      .from('banners')
      .update({ title, image_url, link, position, status, sort_order, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Cập nhật banner thành công", data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Xóa Banner (Admin)
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('banners')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Xóa banner thành công" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};