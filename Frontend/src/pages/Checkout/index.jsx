import React, { useState } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import CheckoutForm from '../../components/Checkout/CheckoutForm.jsx';
import OrderSummaryPanel from '../../components/Checkout/OrderSummaryPanel.jsx';
import { orderService } from '../../services/orderService';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

const CheckoutPage = ({ cartItems, subtotal, onBack, onPlaceOrder }) => {
  // Cập nhật State: Thêm province, district, ward
  const [data, setData] = useState({ 
    fullname: '', phone: '', email: '', 
    province: '', district: '', ward: '', address: '', 
    note: '', payment: 'COD', shipping: 'standard' 
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const shippingFee = subtotal >= 500000 ? 0 : (data.shipping === 'express' ? 35000 : 20000);
  const grandTotal = subtotal + shippingFee;

  if (!cartItems.length && !orderResult) {
    return (
      <PageShell>
        <EmptyState 
          icon="🛒" 
          title="Giỏ hàng trống" 
          desc="Không có sản phẩm để thanh toán." 
          action={{ label: 'Quay lại mua sắm', onClick: onBack }} 
        />
      </PageShell>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra sơ bộ xem người dùng đã chọn đủ địa chỉ chưa
    if (!data.province || !data.district || !data.ward) {
      toast.error("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã!");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập lại");

      // Sử dụng dữ liệu thực từ state thay vì hardcode
      const payload = {
        recipient_name: data.fullname,
        recipient_phone: data.phone,
        recipient_email: data.email,
        shipping_address: data.address, // Số nhà, tên đường
        province: data.province,        // Tỉnh/Thành phố đã chọn
        district: data.district,        // Quận/Huyện đã chọn
        ward: data.ward,                // Phường/Xã đã chọn
        note: data.note,
        payment_method: data.payment.toLowerCase(),
        shipping_fee: shippingFee
      };

      const result = await orderService.createOrder(session.access_token, payload);
      setOrderResult(result);
      toast.success("Đặt hàng thành công!");
      
      onPlaceOrder?.(); 
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (orderResult) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-4xl mb-5 animate-bounce">✅</div>
        <h2 className="text-2xl font-extrabold text-slate-800">Đặt hàng thành công!</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">
          Mã đơn hàng: <span className="font-bold text-indigo-600">#{orderResult.order_code}</span>
        </p>
        <p className="text-slate-400 text-xs mt-1">Chúng tôi sẽ liên hệ sớm để xác nhận đơn hàng.</p>
        <button onClick={onBack} className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">
          Tiếp tục mua sắm
        </button>
      </div>
    </PageShell>
  );

  return (
    <PageShell>
      <button onClick={onBack} className="group mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại giỏ hàng
      </button>
      <h1 className="text-2xl font-black text-slate-800 mb-8 tracking-tight">THANH TOÁN ĐƠN HÀNG</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CheckoutForm data={data} setData={setData} onSubmit={handleSubmit} />
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white font-extrabold shadow-xl hover:bg-indigo-600 disabled:bg-slate-300 transition-all active:scale-[0.98]"
          >
            {loading ? "ĐANG XỬ LÝ..." : `THANH TOÁN ${new Intl.NumberFormat('vi-VN').format(grandTotal)}₫`}
          </button>
        </div>
        <div>
          <OrderSummaryPanel cartItems={cartItems} subtotal={subtotal} shippingMethod={data.shipping} />
        </div>
      </div>
    </PageShell>
  );
};

export default CheckoutPage;