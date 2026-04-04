import React from 'react';
import { fmt } from '../../utils/format.js';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const { product, quantity } = item;
  const image = product.image || product.thumbnail_url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80';
  const price = product.priceRaw ?? product.base_price ?? 0;

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
        <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">{product.name}</h3>
        {product.brand && <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>}
        <p className="text-indigo-600 font-extrabold text-sm mt-1">{fmt(price)}</p>
        <div className="flex items-center gap-1 mt-2.5">
          <button onClick={() => onQuantityChange(product.id, Math.max(1, quantity - 1))} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none">−</button>
          <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
          <button onClick={() => onQuantityChange(product.id, quantity + 1)} className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors text-lg leading-none">+</button>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <p className="font-extrabold text-slate-800 text-sm">{fmt(price * quantity)}</p>
        <button onClick={() => onRemove(product.id)} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          Xóa
        </button>
      </div>
    </div>
  );
};

export default CartItem;
