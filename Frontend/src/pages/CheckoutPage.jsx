import React, { useState } from 'react';

const CheckoutPage = ({ cartItems, subtotal, onPlaceOrder, onBack }) => {
  const [data, setData] = useState({
    fullname: '', phone: '', email: '', address: '', note: '', payment: 'COD', shipping: 'standard',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!data.fullname || !data.phone || !data.email || !data.address) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('vi-VN'),
      status: 'Chờ xác nhận',
      total: subtotal,
      customer: data,
      products: cartItems,
    };
    onPlaceOrder && onPlaceOrder(order);
    alert('Đơn hàng đã được đặt thành công.');
  };

  if (!cartItems.length) return <div className="p-6">Giỏ hàng trống. Vui lòng thêm sản phẩm.</div>;

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <button onClick={onBack} className="mb-4 text-indigo-600 hover:underline">← Quay lại giỏ hàng</button>
      <h2 className="text-2xl font-bold mb-4">Thanh toán</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
          <h3 className="font-semibold">Thông tin giao hàng</h3>
          <input value={data.fullname} onChange={(e) => setData({ ...data, fullname: e.target.value })} placeholder="Họ tên" className="w-full rounded-lg border px-3 py-2" required />
          <input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="Số điện thoại" className="w-full rounded-lg border px-3 py-2" required />
          <input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="Email" className="w-full rounded-lg border px-3 py-2" required />
          <input value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} placeholder="Địa chỉ giao hàng" className="w-full rounded-lg border px-3 py-2" required />
          <textarea value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} placeholder="Ghi chú" className="w-full rounded-lg border px-3 py-2" rows={3} />

          <h3 className="font-semibold">Phương thức thanh toán</h3>
          <select value={data.payment} onChange={(e) => setData({ ...data, payment: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            <option value="COD">COD</option>
            <option value="bank">Chuyển khoản</option>
            <option value="e-wallet">Ví điện tử</option>
          </select>

          <h3 className="font-semibold">Phương thức vận chuyển</h3>
          <select value={data.shipping} onChange={(e) => setData({ ...data, shipping: e.target.value })} className="w-full rounded-lg border px-3 py-2">
            <option value="standard">Tiêu chuẩn</option>
            <option value="express">Nhanh</option>
          </select>

          <button type="submit" className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-white">Đặt hàng</button>
        </form>

        <aside className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold mb-3">Đơn hàng ({cartItems.length} sản phẩm)</h3>
          <div className="space-y-2 text-sm text-slate-700">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex justify-between"><span>{item.product.name} x {item.quantity}</span><span>{(item.product.priceRaw*item.quantity).toLocaleString('vi-VN')}₫</span></div>
            ))}
          </div>
          <div className="mt-3 border-t pt-3 font-bold flex justify-between">Tổng: <span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
