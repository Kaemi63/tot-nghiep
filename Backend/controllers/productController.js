const supabase = require('../config/supabaseClient'); 

const getProducts = async (req, res) => {
  try {
    const { category, search, slug } = req.query;

    // Khởi tạo query lấy đầy đủ quan hệ
    let query = supabase
      .from('products')
      .select(`
        *,
        brands (id, name, slug, logo_url),
        categories!inner (id, name, slug),
        product_images (id, image_url, sort_order),
        product_specifications (id, spec_name, spec_value),
        product_variants (id, variant_name, sku, price, stock_quantity, color, size)
      `)
      .eq('status', 'active');

    // 1. Nếu tìm theo slug (cho trang chi tiết)
    if (slug) {
      query = query.eq('slug', slug).single();
    } 
    // 2. Nếu lọc theo danh mục
    else if (category && category !== '') {
      query = query.eq('categories.slug', category);
    }

    // 3. Tìm kiếm theo tên
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return res.status(403).json({ message: error.message });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ message: "Lỗi Server Nội Bộ" });
  }
};

module.exports = { getProducts };