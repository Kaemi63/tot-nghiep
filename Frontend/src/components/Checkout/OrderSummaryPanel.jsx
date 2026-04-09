import React from 'react';
import { fmt } from '../../utils/format.js';

const OrderSummaryPanel = ({ 
  cartItems, 
  subtotal, 
  shippingMethod,
  couponCode, 
  setCouponCode, 
  onApplyCoupon, 
  appliedCoupon, 
  discount = 0 
}) => {
  const shippingFee = subtotal >= 500000 ? 0 : (shippingMethod === 'express' ? 35000 : 20000);
  // Cập nhật tính tổng: cộng phí ship và trừ đi tiền giảm giá
  const total = Math.max(0, subtotal + shippingFee - discount);

  return (
    <aside className="rounded-2xl border border-slate-100 bg-white shadow-sm p-6 sticky top-4">
      <h3 className="font-extrabold text-slate-800 mb-4">Đơn hàng ({cartItems.length} sản phẩm)</h3>
      
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        {cartItems.map((item) => {
          const product = item.products; 
          const quantity = item.quantity;
          const price = item.unit_price ?? product?.base_price ?? 0;
          const image = product?.thumbnail_url || product?.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=200&q=80';

          return (
            <div key={item.id} className="flex items-center gap-3">
              <div className="relative flex-shrink-0 w-12 h-12 rounded-lg border border-slate-100 overflow-hidden">
                <img src={image} alt={product?.name} className="w-full h-full object-cover" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-slate-800 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                  {quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{product?.name}</p>
                <p className="text-[10px] text-slate-500">{fmt(price)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2 text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Tạm tính</span>
          <span className="font-semibold">{fmt(subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-slate-600">
          <span>Phí vận chuyển</span>
          <span className={`font-semibold ${shippingFee === 0 ? 'text-emerald-600' : ''}`}>
            {shippingFee === 0 ? 'Miễn phí' : fmt(shippingFee)}
          </span>
        </div>

        {/* Hiển thị dòng giảm giá nếu có mã được áp dụng */}
        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600">
            <span>Giảm giá ({appliedCoupon.code})</span>
            <span className="font-semibold">−{fmt(discount)}</span>
          </div>
        )}

        {/* --- PHẦN MÃ GIẢM GIÁ DỜI QUA ĐÂY --- */}
        <form onSubmit={onApplyCoupon} className="py-2 space-y-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mã giảm giá</label>
          <div className="flex gap-2">
            <input 
              value={couponCode} 
              onChange={(e) => setCouponCode(e.target.value)} 
              placeholder="Nhập mã..." 
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-colors" 
            />
            <button 
              type="submit" 
              className="px-3 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition-colors"
            >
              Áp dụng
            </button>
          </div>
        </form>

        <div className="flex justify-between font-extrabold text-lg text-slate-900 pt-2 border-t border-slate-50">
          <span>Tổng cộng</span>
          <span className="text-indigo-600">{fmt(total)}</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummaryPanel;