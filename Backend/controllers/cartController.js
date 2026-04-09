const supabase = require('../config/supabaseClient');

// 1. Lấy giỏ hàng của User
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ token sau khi qua middleware
    const { data, error } = await supabase
      .from('carts')
      .select(`
        id,
        cart_items (
          id,
          quantity,
          unit_price,
          products ( id, name, thumbnail_url, base_price, brands ( name ) ),
          product_variants (id, variant_name, sku, price, stock_quantity, color, size)
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 là lỗi không tìm thấy dòng nào (giỏ trống)
    
    // Nếu chưa có giỏ hàng, trả về mảng rỗng thay vì lỗi
    res.status(200).json(data || { cart_items: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const { product_id, product_variant_id, quantity, unit_price } = req.body;
  const userId = req.user.id;

  try {
    // BƯỚC 1: Lấy hoặc Tạo giỏ hàng cho User
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single();
      if (createError) throw createError;
      cart = newCart;
    }

    // BƯỚC 2: Kiểm tra sản phẩm đã có trong giỏ chưa (để tăng quantity thay vì chèn dòng mới)
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', product_id)
      .eq('product_variant_id', product_variant_id || null) // Xử lý trường hợp null
      .single();

    if (existingItem) {
      // Cập nhật số lượng
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + (quantity || 1) })
        .eq('id', existingItem.id);
      if (updateError) throw updateError;
    } else {
      // Chèn dòng mới
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert([{
          cart_id: cart.id,
          product_id,
          product_variant_id,
          quantity: quantity || 1,
          unit_price
        }]);
      if (insertError) throw insertError;
    }

    res.status(200).json({ message: "Đã cập nhật giỏ hàng" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  const { itemId } = req.params;
  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    res.status(200).json({ message: "Đã xóa sản phẩm khỏi giỏ" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// 4. Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
  const { cart_item_id, quantity } = req.body;
  const userId = req.user.id;

  try {
    // Kiểm tra xem cart_item này có thuộc về giỏ hàng của user này không (để bảo mật)
    const { data: item, error: findError } = await supabase
      .from('cart_items')
      .select('id, carts!inner(user_id)')
      .eq('id', cart_item_id)
      .eq('carts.user_id', userId)
      .single();

    if (findError || !item) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm trong giỏ" });
    }

    // Cập nhật số lượng mới
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: Math.max(1, quantity) }) // Đảm bảo số lượng ít nhất là 1
      .eq('id', cart_item_id);

    if (updateError) throw updateError;

    res.status(200).json({ message: "Đã cập nhật số lượng" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};