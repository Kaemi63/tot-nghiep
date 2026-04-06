import { useState } from 'react';
import { orderService } from '../services/orderService';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useOrder = () => {
  const [ordering, setOrdering] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const placeOrder = async (formData, shippingFee) => {
    setOrdering(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập để thanh toán");

      // Chuẩn bị dữ liệu đúng cấu trúc bảng orders
      const payload = {
        recipient_name: formData.fullname,
        recipient_phone: formData.phone,
        recipient_email: formData.email,
        shipping_address: formData.address,
        province: formData.province || 'Hồ Chí Minh', // Bạn có thể bổ sung select tỉnh thành
        district: formData.district || 'Quận 1',
        ward: formData.ward || 'Phường 1',
        note: formData.note,
        payment_method: formData.payment.toLowerCase(), // cod, bank_transfer...
        shipping_fee: shippingFee,
      };

      const result = await orderService.createOrder(session.access_token, payload);
      toast.success("Đặt hàng thành công!");
      return result; // Trả về để Component xử lý chuyển trang/hiện success
    } catch (error) {
      toast.error(error.message);
      return null;
    } finally {
      setOrdering(false);
    }
  };

  return { placeOrder, ordering, orderHistory };
};