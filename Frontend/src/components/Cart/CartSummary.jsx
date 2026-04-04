import React from 'react';
import { fmt } from '../../utils/format.js';

const CartSummary = ({ subtotal, discount, total, appliedCoupon, couponCode, setCouponCode, onApplyCoupon, onCheckout, itemCount }) => {
  const shippingFee = subtotal >= 500000 ? 0 : 35000;
  const grandTotal = Math.max(0, total + shippingFee);

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-5 sticky top-4">
      <h3 className="font-extrabold text-slate-800 text-lg">Tóm tắt đơn hàng</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600"><span>Tạm tính ({itemCount} sản phẩm)</span><span className="font-semibold">{fmt(subtotal)}</span></div>
        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          {shippingFee === 0 ? <span className="text-emerald-600 font-semibold">Miễn phí</span> : <span className="font-semibold">{fmt(shippingFee)}</span>}
        </div>
        {appliedCoupon && <div className="flex justify-between text-emerald-600"><span>Giảm ({appliedCoupon.code})</span><span className="font-semibold">−{fmt(discount)}</span></div>}
        {subtotal < 500000 && <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">🚚 Thêm <strong>{fmt(500000 - subtotal)}</strong> để miễn phí vận chuyển</p>}
      </div>
      <form onSubmit={onApplyCoupon} className="space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã giảm giá</label>
        <div className="flex gap-2">
          <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Nhập mã..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-colors" />
          <button type="submit" className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors">Áp dụng</button>
        </div>
      </form>
      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-extrabold text-slate-800">Tổng thanh toán</span>
          <span className="text-2xl font-extrabold text-indigo-600">{fmt(grandTotal)}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Đã bao gồm VAT</p>
      </div>
      <button onClick={onCheckout} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-200">
        Tiến hành thanh toán →
      </button>
      <div className="flex items-center justify-center gap-4 pt-1">
        {['🔒 Bảo mật SSL', '↩️ Đổi trả 30 ngày'].map((t) => <span key={t} className="text-[11px] text-slate-400">{t}</span>)}
      </div>
    </aside>
  );
};

export default CartSummary;
