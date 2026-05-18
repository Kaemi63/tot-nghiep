import React from 'react';
import { fmt } from '../../utils/format.js';

const CartSummary = ({ subtotal, discount, total, appliedCoupon, onCheckout, itemCount }) => {
  const shippingFee = 20000;
  const grandTotal = Math.max(0, total + shippingFee);

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 space-y-5 sticky top-4">
      <h3 className="font-extrabold text-slate-800 text-lg">Tóm tắt đơn hàng</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Tạm tính ({itemCount} sản phẩm)</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          <span className="font-semibold">{fmt(shippingFee)}</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600">
            <span>Giảm ({appliedCoupon.code})</span>
            <span className="font-semibold">−{fmt(discount)}</span>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="flex justify-between items-center">
          <span className="font-extrabold text-slate-800">Tổng thanh toán</span>
          <span className="text-2xl font-extrabold text-indigo-600">{fmt(grandTotal)}</span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Đã bao gồm VAT</p>
      </div>

      <button onClick={onCheckout} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-200">
        Tiến hành đặt hàng
      </button>
    </aside>
  );
};

export default CartSummary;
