import React, { useState } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import CheckoutForm from '../../components/Checkout/CheckoutForm.jsx';
import OrderSummaryPanel from '../../components/Checkout/OrderSummaryPanel.jsx';
import { orderService } from '../../services/orderService';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';
import { useCoupon } from '../../hooks/useCoupon'; // Import hook xử lý coupon

const CheckoutPage = ({ cartItems, subtotal, onBack, onPlaceOrder }) => {
  const [data, setData] = useState({ 
    fullname: '', phone: '', email: '', 
    province: '', district: '', ward: '', address: '', 
    note: '', payment: 'COD', shipping: 'standard' 
  });
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // --- 1. TÍCH HỢP HOOK COUPON ---
  const { 
    couponCode, 
    setCouponCode, 
    appliedCoupon, 
    discount, 
    handleApplyCoupon 
  } = useCoupon(subtotal);

  const shippingFee = subtotal >= 500000 ? 0 : (data.shipping === 'express' ? 35000 : 20000);
  
  // --- 2. CẬP NHẬT TỔNG THANH TOÁN (TRỪ CHIẾT KHẤU) ---
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleSubmit = async () => {
    if (!data.fullname || !data.phone || !data.address || !data.province || !data.district || !data.ward) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập lại");

      const orderData = {
        recipient_name: data.fullname,
        recipient_phone: data.phone,
        recipient_email: data.email,
        shipping_address: data.address,
        province: data.province,
        district: data.district,
        ward: data.ward,
        note: data.note,
        payment_method: data.payment,
        shipping_fee: shippingFee,
        // --- 3. GỬI ID COUPON LÊN BACKEND ---
        coupon_id: appliedCoupon?.coupon_id || null 
      };

      const result = await orderService.createOrder(session.access_token, orderData);
      setOrderResult(result);
      toast.success('Đặt hàng thành công!');
      if (onPlaceOrder) onPlaceOrder();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

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

  if (orderResult) return (
    <PageShell>
      <div className="max-w-2xl mx-auto text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xl">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-black text-slate-800 mb-2">ĐẶT HÀNG THÀNH CÔNG!</h2>
        <p className="text-slate-500 mb-4">Mã đơn hàng: <span className="font-bold text-indigo-600">{orderResult.order_code}</span></p>
        <p className="px-8 text-slate-400">Cảm ơn bạn đã tin tưởng. Chúng tôi sẽ liên hệ sớm để xác nhận đơn hàng.</p>
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
            {loading ? 'ĐANG XỬ LÝ...' : `XÁC NHẬN THANH TOÁN - ${grandTotal.toLocaleString()}₫`}
          </button>
        </div>

        <div className="lg:col-span-1">
          {/* --- 4. TRUYỀN PROPS COUPON VÀO PANEL TỔNG HỢP --- */}
          <OrderSummaryPanel 
            cartItems={cartItems} 
            subtotal={subtotal} 
            shippingMethod={data.shipping}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            onApplyCoupon={handleApplyCoupon}
            appliedCoupon={appliedCoupon}
            discount={discount}
          />
        </div>
      </div>
    </PageShell>
  );
};

export default CheckoutPage;