const supabase = require('../config/supabaseClient');

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { 
    recipient_name, 
    recipient_phone, 
    recipient_email,
    shipping_address, 
    province, 
    district, 
    ward,
    note, 
    payment_method, 
    shipping_fee, 
    coupon_id 
  } = req.body;

  console.log("DEBUG: Đang tìm giỏ hàng cho UserID:", userId);

  try {
    const { data: cart, error: cartError } = await supabase
      .from('carts')
      .select(`
        id, 
        cart_items (
          product_id, 
          product_variant_id, 
          quantity, 
          unit_price,
          products ( name )
        )
      `) 
      .eq('user_id', userId)
      .single();

    console.log("DEBUG: Kết quả trả về từ Supabase:", cart);
    console.log("DEBUG: Lỗi từ Supabase (nếu có):", cartError);

    if (cartError || !cart || !cart.cart_items || cart.cart_items.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống, không thể đặt hàng" });
    }

    // Tính toán tiền bạc
    const subtotal = cart.cart_items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);
    const total_amount = subtotal + (shipping_fee || 0);
    const order_code = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

    //Tạo đơn hàng chính (orders)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_code,
        recipient_name, 
        recipient_phone, 
        recipient_email,
        shipping_address, 
        province, 
        district, 
        ward,
        note, 
        subtotal, 
        shipping_fee: shipping_fee || 0, 
        total_amount,
        payment_method,
        payment_status: 'unpaid',
        order_status: 'pending'
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // Lưu chi tiết đơn hàng (order_items) 
    const orderItemsPayload = cart.cart_items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_variant_id: item.product_variant_id,
      product_name: item.products?.name || 'Sản phẩm không xác định',
      price: item.unit_price,
      quantity: item.quantity,
      total: item.unit_price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) throw itemsError;

    //Ghi lại lịch sử trạng thái đầu tiên
    await supabase.from('order_status_histories').insert([{
      order_id: order.id,
      status: 'pending',
      note: 'Khách hàng đặt hàng thành công'
    }]);

    //Xóa sạch giỏ hàng sau khi đặt thành công
    await supabase.from('cart_items').delete().eq('cart_id', cart.id);

    res.status(201).json({ 
      message: "Đặt hàng thành công", 
      order_code: order.order_code,
      order_id: order.id 
    });

  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách đơn hàng của tôi
exports.getMyOrders = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};