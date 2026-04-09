const supabase = require('../config/supabaseClient');

// 1. Kiểm tra và áp dụng mã giảm giá (Dành cho khách hàng tại Checkout)
exports.applyCoupon = async (req, res) => {
  const { code, orderValue } = req.body;
  const userId = req.user.id; // Lấy từ middleware protect

  try {
    // A. Tìm coupon còn hoạt động và trong thời hạn
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('status', 'active')
      .single();

    if (error || !coupon) {
      return res.status(404).json({ error: "Mã giảm giá không tồn tại hoặc đã hết hạn" });
    }

    // B. Kiểm tra ngày hiệu lực
    const now = new Date();
    if (new Date(coupon.start_date) > now) {
      return res.status(400).json({ error: "Chương trình giảm giá chưa bắt đầu" });
    }
    if (coupon.end_date && new Date(coupon.end_date) < now) {
      return res.status(400).json({ error: "Mã giảm giá đã hết hạn sử dụng" });
    }

    // C. Kiểm tra giới hạn lượt dùng của hệ thống
    if (coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ error: "Mã giảm giá đã hết lượt sử dụng" });
    }

    // D. KIỂM TRA: User này đã dùng mã này chưa? (Chống spam)
    const { data: usage } = await supabase
      .from('coupon_usages')
      .select('id')
      .eq('coupon_id', coupon.id)
      .eq('user_id', userId)
      .single();

    if (usage) {
      return res.status(400).json({ error: "Bạn đã sử dụng mã giảm giá này cho một đơn hàng trước đó" });
    }

    // E. Kiểm tra giá trị đơn hàng tối thiểu
    if (orderValue < coupon.min_order_value) {
      return res.status(400).json({ 
        error: `Đơn hàng tối thiểu ${Number(coupon.min_order_value).toLocaleString()}đ để dùng mã này` 
      });
    }

    // F. Tính toán số tiền giảm
    let discountAmount = 0;
    if (coupon.discount_type === 'percent') {
      discountAmount = (orderValue * coupon.discount_value) / 100;
      // Nếu có giá trị giảm tối đa (max_discount), thực hiện giới hạn
      if (coupon.max_discount && discountAmount > coupon.max_discount) {
        discountAmount = coupon.max_discount;
      }
    } else {
      discountAmount = coupon.discount_value;
    }

    // Đảm bảo số tiền giảm không vượt quá giá trị đơn hàng
    if (discountAmount > orderValue) discountAmount = orderValue;

    res.status(200).json({
      message: "Áp dụng mã thành công",
      coupon_id: coupon.id,
      code: coupon.code,
      name: coupon.name,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount: Math.round(discountAmount) // Làm tròn số tiền
    });

  } catch (error) {
    console.error("Apply Coupon Error:", error);
    res.status(500).json({ error: "Lỗi hệ thống khi áp dụng mã giảm giá" });
  }
};

// 2. Lấy danh sách Coupon khả dụng (Hiện công khai cho khách xem)
exports.getPublicCoupons = async (req, res) => {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('coupons')
      .select('id, code, name, description, discount_type, discount_value, min_order_value, max_discount, end_date')
      .eq('status', 'active')
      .or(`end_date.is.null,end_date.gt.${now}`) // Hết hạn hoặc end_date chưa tới
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Admin: Tạo Coupon mới
exports.createCoupon = async (req, res) => {
  try {
    const { 
      code, name, description, 
      discount_type, discount_value, 
      min_order_value, max_discount, 
      usage_limit, start_date, end_date 
    } = req.body;

    const { data, error } = await supabase
      .from('coupons')
      .insert([{
        code: code.toUpperCase(),
        name,
        description,
        discount_type,
        discount_value,
        min_order_value: min_order_value || 0,
        max_discount,
        usage_limit: usage_limit || 100,
        start_date: start_date || new Date(),
        end_date,
        status: 'active'
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: "Tạo mã giảm giá thành công", data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};