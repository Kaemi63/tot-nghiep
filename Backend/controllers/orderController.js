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

  try {
    // 1. Lấy giỏ hàng (Giữ nguyên code gốc của bạn)
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

    if (cartError || !cart || !cart.cart_items || cart.cart_items.length === 0) {
      return res.status(400).json({ error: "Giỏ hàng trống, không thể đặt hàng" });
    }

    // 2. Tính subtotal (Giữ nguyên)
    const subtotal = cart.cart_items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

    // --- PHẦN MỚI: XỬ LÝ COUPON (TÍNH TOÁN LẠI TẠI SERVER) ---
    let discount_amount = 0;
    if (coupon_id) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('id', coupon_id)
        .eq('status', 'active')
        .single();

      if (coupon) {
        if (coupon.discount_type === 'percent') {
          discount_amount = (subtotal * coupon.discount_value) / 100;
          if (coupon.max_discount && discount_amount > coupon.max_discount) {
            discount_amount = coupon.max_discount;
          }
        } else {
          discount_amount = coupon.discount_value;
        }
      }
    }
    // -------------------------------------------------------

    // 3. Tính tổng tiền cuối cùng
    const total_amount = subtotal + Number(shipping_fee) - discount_amount;

    // 4. Tạo đơn hàng (Bổ sung discount_amount và total_amount)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: userId,
        order_code: `ORD-${Math.random().toString(36).toUpperCase().substring(2, 9)}`,
        recipient_name,
        recipient_phone,
        recipient_email,
        shipping_address,
        province,
        district,
        ward,
        note,
        subtotal,
        discount_amount, // Giá trị đã tính ở trên
        shipping_fee,
        total_amount,    // Tổng cuối cùng
        payment_method,
        coupon_id: coupon_id || null
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 5. Insert order_items (Giữ nguyên code gốc)
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

    // --- PHẦN MỚI: GHI LOG SỬ DỤNG COUPON ---
    if (coupon_id) {
      // Lưu vào bảng coupon_usages
      await supabase.from('coupon_usages').insert([{
        coupon_id: coupon_id,
        user_id: userId,
        order_id: order.id
      }]);

      // Cập nhật used_count của coupon
      const { data: cpData } = await supabase.from('coupons').select('used_count').eq('id', coupon_id).single();
      await supabase.from('coupons').update({ used_count: (cpData?.used_count || 0) + 1 }).eq('id', coupon_id);
    }
    // ---------------------------------------

    // 6. Ghi lại lịch sử trạng thái (Thêm changed_by)
    await supabase.from('order_status_histories').insert([{
      order_id: order.id,
      status: 'pending',
      note: 'Khách hàng đặt hàng thành công',
      changed_by: userId // Đảm bảo có cột này để không lỗi DB
    }]);

    // 7. Xóa sạch giỏ hàng (Giữ nguyên)
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

// Hàm lấy danh sách đơn hàng (Giữ nguyên hoặc bổ sung nếu cần)
exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*),
        order_status_histories (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};