const supabase = require('../config/supabaseClient');

// 1. Lấy danh sách yêu thích
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const { data, error } = await supabase
      .from('wishlists')
      .select(`
        id,
        created_at,
        products:product_id (
          id,
          name,
          base_price,
          thumbnail_url,
          brands:brand_id (
            name
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Lỗi Supabase:", error);
      throw error;
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 2. Thêm sản phẩm vào yêu thích
exports.addToWishlist = async (req, res) => {
  const { user_id, product_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('wishlists') // Phải là 'wishlists' (có s)
      .insert([{ user_id, product_id }])
      .select();

    if (error) {
      console.error("Supabase Error:", error); // Xem log ở terminal backend
      if (error.code === '23505') {
        return res.status(400).json({ error: "Sản phẩm đã có trong danh sách yêu thích" });
      }
      // Trả về lỗi chi tiết từ DB để Frontend hiển thị
      return res.status(400).json({ error: error.message, detail: error.details });
    }
    
    res.status(201).json({ message: "Đã thêm vào yêu thích", data });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống" });
  }
};

// 3. Xóa khỏi danh sách yêu thích
exports.removeFromWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from('wishlists') // Đổi từ wishlists thành wishlist
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: "Đã xóa khỏi danh sách yêu thích" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};