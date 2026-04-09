const supabase = require('../config/supabaseClient');

// 1. Gửi đánh giá mới (Mặc định status sẽ là 'approved' theo DB của bạn)
exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const { product_id, order_id, rating, comment, images } = req.body;

  try {
    console.log("DEBUG DATA:", { userId, product_id, order_id });
    // A. Kiểm tra xem người dùng đã mua sản phẩm này trong đơn hàng này chưa
    const { data: orderItem, error: orderError } = await supabase
      .from('order_items')
      .select('id')
      .eq('order_id', order_id)
      .eq('product_id', product_id)
      .single();

    if (orderError || !orderItem) {
      return res.status(403).json({ error: "Bạn chỉ có thể đánh giá sản phẩm đã mua" });
    }

    // B. Kiểm tra xem đã review sản phẩm này cho đơn hàng này chưa (Tránh spam)
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('order_id', order_id)
      .eq('product_id', product_id)
      .single();

    if (existingReview) {
      return res.status(400).json({ error: "Bạn đã đánh giá sản phẩm này cho đơn hàng này rồi" });
    }

    // C. Lưu Review vào bảng reviews
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert([{
        user_id: userId,
        product_id,
        order_id,
        rating,
        comment
      }])
      .select()
      .single();

    if (reviewError) throw reviewError;

    // D. Lưu ảnh đi kèm (nếu có) vào bảng review_images
    if (images && Array.isArray(images) && images.length > 0) {
      const imagesPayload = images.map(url => ({
        review_id: review.id,
        image_url: url
      }));

      const { error: imgError } = await supabase
        .from('review_images')
        .insert(imagesPayload);

      if (imgError) console.error("Lỗi lưu ảnh review:", imgError.message);
    }

    res.status(201).json({ message: "Đánh giá của bạn đã được đăng thành công", review });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Lấy danh sách đánh giá của một sản phẩm (Công khai)
exports.getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles (fullname, avatar_url),
        review_images (image_url)
      `)
      .eq('product_id', productId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Admin: Thay đổi trạng thái review (Ẩn review bậy bạ)
exports.updateReviewStatus = async (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  try {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) throw error;
    res.status(200).json({ message: `Đã cập nhật trạng thái review thành ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};