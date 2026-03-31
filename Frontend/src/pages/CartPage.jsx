import React, { useMemo, useState } from 'react';

const CartPage = ({ cartItems, onQuantityChange, onRemoveItem, onApplyCoupon, onCheckout, availableCoupons = [] }) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.product.priceRaw * item.quantity, 0), [cartItems]);
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === 'percent') return Math.floor(subtotal * appliedCoupon.value);
    if (appliedCoupon.type === 'fixed') return appliedCoupon.value;
    return 0;
  }, [appliedCoupon, subtotal]);

  const total = Math.max(0, subtotal - discount);

  const handleApply = (e) => {
    e.preventDefault();
    const coupon = availableCoupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase());
    if (!coupon) {
      alert('Mã giảm giá không hợp lệ');
      return;
    }
    setAppliedCoupon(coupon);
    onApplyCoupon && onApplyCoupon(coupon);
    alert(`Áp dụng mã ${coupon.code} thành công`);
  };

  if (cartItems.length === 0) {
    return (
      <div className="h-full overflow-y-auto bg-white p-6">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng trống</h2>
          <p className="text-slate-500">Hãy thêm sản phẩm của bạn vào giỏ hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item.product.id} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
              <img src={item.product.image} alt={item.product.name} className="h-20 w-20 rounded-lg object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-sm text-slate-500">{item.product.brand}</p>
                <p className="text-indigo-600 font-bold">{item.product.price.toLocaleString('vi-VN')}₫</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => onQuantityChange(item.product.id, Math.max(1, item.quantity - 1))} className="rounded-md border px-2">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => onQuantityChange(item.product.id, item.quantity + 1)} className="rounded-md border px-2">+</button>
                </div>
              </div>
              <button onClick={() => onRemoveItem(item.product.id)} className="text-sm text-red-500">Xóa</button>
            </div>
          ))}
        </div>

        <aside className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h3 className="font-bold text-lg mb-3">Tóm tắt</h3>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Tổng phụ</span><span>{subtotal.toLocaleString('vi-VN')}₫</span></div>
            {appliedCoupon && <div className="flex justify-between text-emerald-700"><span>Giảm ({appliedCoupon.code})</span><span>-{discount.toLocaleString('vi-VN')}₫</span></div>}
            <div className="flex justify-between font-bold"><span>Tổng</span><span>{total.toLocaleString('vi-VN')}₫</span></div>
          </div>

          <form onSubmit={handleApply} className="mt-4">
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Mã giảm giá" className="w-full rounded-lg border border-slate-300 px-3 py-2" />
            <button type="submit" className="mt-2 w-full rounded-lg bg-indigo-600 px-3 py-2 text-white">Áp dụng</button>
          </form>

          <button onClick={onCheckout} className="mt-4 w-full rounded-lg bg-emerald-600 px-3 py-2 text-white">Tiến hành thanh toán</button>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
