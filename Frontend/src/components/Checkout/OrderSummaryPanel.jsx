import React from 'react';
import { fmt } from '../../utils/format.js';

const OrderSummaryPanel = ({ cartItems, subtotal, shippingMethod }) => {
  // Tính phí vận chuyển dựa trên subtotal
  const shippingFee = subtotal >= 500000 ? 0 : (shippingMethod === 'express' ? 35000 : 20000);
  const total = subtotal + shippingFee;

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
              <div className="relative flex-shrink-0">
                <img 
                  src={image} 
                  alt={product?.name} 
                  className="w-12 h-12 rounded-xl object-cover border border-slate-100" 
                />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                  {quantity}
                </span>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {product?.name || 'Sản phẩm'}
                </p>
                {product?.brands?.name && (
                  <p className="text-[11px] text-slate-400">
                    {product.brands.name}
                  </p>
                )}
              </div>
              
              <p className="text-xs font-bold text-slate-800 flex-shrink-0">
                {fmt(price * quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-sm">
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

        <div className="flex justify-between font-extrabold text-slate-800 text-base pt-2 border-t border-slate-100">
          <span>Tổng cộng</span>
          <span className="text-indigo-600">{fmt(total)}</span>
        </div>
      </div>
    </aside>
  );
};

export default OrderSummaryPanel;