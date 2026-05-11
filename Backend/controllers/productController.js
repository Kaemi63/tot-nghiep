const supabase = require('../config/supabaseClient');

// ===================== GET ALL (PUBLIC - USER) =====================
const getProducts = async (req, res) => {
  try {
    const { category, search, slug, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        brands (id, name, slug, logo_url),
        categories (id, name, slug),
        product_images (id, image_url, sort_order),
        product_specifications (id, spec_name, spec_value),
        product_variants (id, variant_name, sku, price, stock_quantity, color, size)
      `)
      .eq('status', 'active');

    if (slug) {
      const { data, error } = await query.eq('slug', slug).single();
      if (error) return res.status(404).json({ message: error.message });
      return res.status(200).json(data);
    }

    if (category) {
      const { data: cat, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single();

      if (catError || !cat) return res.status(200).json([]);
      query = query.eq('category_id', cat.id);
    }

    if (search) query = query.ilike('name', `%${search}%`);
    query = query.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query;
    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server Nội Bộ" });
  }
};

// ===================== GET ALL FOR ADMIN =====================
const getAdminProducts = async (req, res) => {
  try {
    const { search, category_id, brand_id, status, limit = 50, offset = 0 } = req.query;

    let query = supabase
      .from('products')
      .select(`
        *,
        brands (id, name, slug, logo_url),
        categories (id, name, slug),
        product_images (id, image_url, sort_order),
        product_specifications (id, spec_name, spec_value),
        product_variants (id, variant_name, sku, price, stock_quantity, color, size)
      `);

    if (search) query = query.ilike('name', `%${search}%`);
    if (category_id) query = query.eq('category_id', category_id);
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (status && status !== 'all') query = query.eq('status', status);

    query = query.order('created_at', { ascending: false }).range(Number(offset), Number(offset) + Number(limit) - 1);

    const { data, error } = await query;
    if (error) return res.status(400).json({ message: error.message });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server Nội Bộ" });
  }
};

// ===================== CREATE =====================
const createProduct = async (req, res) => {
  try {
    const {
      name, slug, short_description, description,
      thumbnail_url, base_price, status, is_featured,
      category_id, brand_id,
      product_variants, product_images, product_specifications
    } = req.body;

    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{
        name, slug, short_description, description,
        thumbnail_url, base_price,
        status: status || 'active',
        is_featured: is_featured || false,
        category_id, brand_id
      }])
      .select()
      .single();

    if (productError) return res.status(400).json({ error: productError.message });
    const productId = product.id;

    if (product_variants?.length > 0) {
      const payload = product_variants.map(({ id: _, ...v }) => ({ ...v, product_id: productId }));
      const { error } = await supabase.from('product_variants').insert(payload);
      if (error) return res.status(400).json({ error: 'Lỗi lưu biến thể: ' + error.message });
    }

    if (product_images?.length > 0) {
      const payload = product_images.map(({ id: _, ...img }, idx) => ({
        ...img,
        product_id: productId,
        sort_order: img.sort_order ?? idx
      }));
      const { error } = await supabase.from('product_images').insert(payload);
      if (error) return res.status(400).json({ error: 'Lỗi lưu ảnh: ' + error.message });
    }

    if (product_specifications?.length > 0) {
      const payload = product_specifications.map(({ id: _, ...s }) => ({ ...s, product_id: productId }));
      const { error } = await supabase.from('product_specifications').insert(payload);
      if (error) return res.status(400).json({ error: 'Lỗi lưu thông số: ' + error.message });
    }

    res.status(201).json({ message: "Tạo sản phẩm thành công", product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===================== UPDATE =====================
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, slug, short_description, description,
      thumbnail_url, base_price, status, is_featured,
      category_id, brand_id,
      product_variants, product_images, product_specifications
    } = req.body;

    const { error: productError } = await supabase
      .from('products')
      .update({
        name, slug, short_description, description,
        thumbnail_url, base_price, status, is_featured,
        category_id, brand_id,
        updated_at: new Date()
      })
      .eq('id', id);

    if (productError) return res.status(400).json({ error: productError.message });

    if (product_variants !== undefined) {
      const { error: delErr } = await supabase.from('product_variants').delete().eq('product_id', id);
      if (delErr) return res.status(400).json({ error: 'Lỗi xóa biến thể cũ: ' + delErr.message });

      if (product_variants.length > 0) {
        const payload = product_variants.map(({ id: _, ...v }) => ({ ...v, product_id: id }));
        const { error: insErr } = await supabase.from('product_variants').insert(payload);
        if (insErr) return res.status(400).json({ error: 'Lỗi lưu biến thể: ' + insErr.message });
      }
    }

    if (product_images !== undefined) {
      const { error: delErr } = await supabase.from('product_images').delete().eq('product_id', id);
      if (delErr) return res.status(400).json({ error: 'Lỗi xóa ảnh cũ: ' + delErr.message });

      if (product_images.length > 0) {
        const payload = product_images.map(({ id: _, ...img }, idx) => ({
          ...img,
          product_id: id,
          sort_order: img.sort_order ?? idx
        }));
        const { error: insErr } = await supabase.from('product_images').insert(payload);
        if (insErr) return res.status(400).json({ error: 'Lỗi lưu ảnh: ' + insErr.message });
      }
    }

    if (product_specifications !== undefined) {
      const { error: delErr } = await supabase.from('product_specifications').delete().eq('product_id', id);
      if (delErr) return res.status(400).json({ error: 'Lỗi xóa thông số cũ: ' + delErr.message });

      if (product_specifications.length > 0) {
        const payload = product_specifications.map(({ id: _, ...s }) => ({ ...s, product_id: id }));
        const { error: insErr } = await supabase.from('product_specifications').insert(payload);
        if (insErr) return res.status(400).json({ error: 'Lỗi lưu thông số: ' + insErr.message });
      }
    }

    res.status(200).json({ message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ===================== DELETE =====================
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const { error: delVariants } = await supabase.from('product_variants').delete().eq('product_id', id);
    if (delVariants) return res.status(400).json({ error: 'Lỗi xóa biến thể: ' + delVariants.message });

    const { error: delImages } = await supabase.from('product_images').delete().eq('product_id', id);
    if (delImages) return res.status(400).json({ error: 'Lỗi xóa ảnh: ' + delImages.message });

    const { error: delSpecs } = await supabase.from('product_specifications').delete().eq('product_id', id);
    if (delSpecs) return res.status(400).json({ error: 'Lỗi xóa thông số: ' + delSpecs.message });

    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProducts, getAdminProducts, createProduct, updateProduct, deleteProduct };