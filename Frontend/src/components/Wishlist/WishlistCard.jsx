import React from 'react';

const WishlistCard = ({ item, onAddToCart, onRemove }) => {
  // Ưu tiên lấy giá từ product, nếu không có thì lấy giá mặc định
  const price = item.price || 0;
  const image = item.image || 'https://via.placeholder.com/400';
  const brand = item.brand || 'Thương hiệu cao cấp';

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="h-56 overflow-hidden bg-slate-50 relative">
        <img 
          src={image} 
          alt={item.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <button 
          onClick={() => onRemove(item.id)} 
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 shadow transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{brand}</p>
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{item.name}</h3>
        <p className="font-extrabold text-indigo-600 text-base mt-2">
          {price.toLocaleString('vi-VN')}₫
        </p>
        <button 
          onClick={() => onAddToCart(item.originalProduct || item)} 
          className="mt-3 w-full py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 active:scale-95 transition-all"
        >
          🛒 Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;