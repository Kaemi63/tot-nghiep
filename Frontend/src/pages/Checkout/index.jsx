import React, { useState } from 'react';
import { PageShell, EmptyState } from '../../shared/ShopUI';
import CheckoutForm from './CheckoutForm';
import OrderSummaryPanel from './OrderSummaryPanel';

const CheckoutPage = ({ cartItems, subtotal, onPlaceOrder, onBack }) => {
  const [data, setData] = useState({ fullname: '', phone: '', email: '', address: '', note: '', payment: 'COD', shipping: 'standard' });
  const [success, setSuccess] = useState(false);

  if (!cartItems.length) return <PageShell><EmptyState icon="🛒" title="Giỏ hàng trống" desc="Không có sản phẩm để thanh toán." action={{ label: 'Quay lại mua sắm', onClick: onBack }} /></PageShell>;

  if (success) return (
    <PageShell>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-4xl mb-5 animate-bounce">✅</div>
        <h2 className="text-2xl font-extrabold text-slate-800">Đặt hàng thành công!</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-sm">Chúng tôi sẽ xác nhận đơn hàng và liên hệ với bạn sớm nhất. Cảm ơn bạn!</p>
        <button onClick={onBack} className="mt-6 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors">Tiếp tục mua sắm</button>
      </div>
    </PageShell>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = { id: `ORD-${Date.now()}`, date: new Date().toLocaleDateString('vi-VN'), status: 'Chờ xác nhận', total: subtotal, customer: data, products: cartItems };
    onPlaceOrder && onPlaceOrder(order);
    setSuccess(true);
  };

  return (
    <PageShell>
      <button onClick={onBack} className="group mb-6 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
        <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại giỏ hàng
      </button>
      <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Thanh toán</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <CheckoutForm data={data} setData={setData} onSubmit={handleSubmit} />
        <OrderSummaryPanel cartItems={cartItems} subtotal={subtotal} />
      </div>
    </PageShell>
  );
};

export default CheckoutPage;
