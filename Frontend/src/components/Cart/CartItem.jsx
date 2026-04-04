import React from 'react';
import { fmt } from '../../utils/format.js';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  // Lấy dữ liệu từ cấu trúc Database (products có 's')
  const product = item.products; 
  const quantity = item.quantity;
  const price = item.unit_price;

  // Thông tin hiển thị
  const image = product?.thumbnail_url || product?.image || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80';
  const name = product?.name || 'Sản phẩm';
  const brandName = product?.brands?.name || ''; // Lấy từ bảng brands đã join

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
      {/* Ảnh sản phẩm */}
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">
          {name}
        </h3>
        {brandName && (
          <p className="text-xs text-slate-400 mt-0.5">{brandName}</p>
        )}
        <p className="text-indigo-600 font-extrabold text-sm mt-1">{fmt(price)}</p>
        
        {/* Bộ điều khiển số lượng */}
        <div className="flex items-center gap-1 mt-2.5">
          <button 
            onClick={() => onQuantityChange(item.id, quantity - 1)} 
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
          <button 
            onClick={() => onQuantityChange(item.id, quantity + 1)} 
            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
      </div>

      {/* Tổng tiền và nút xóa */}
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-extrabold text-slate-800 text-sm">{fmt(price * quantity)}</p>
        <button 
          onClick={() => onRemove(item.id)} 
          className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;