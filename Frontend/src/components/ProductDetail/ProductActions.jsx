// ProductActions.jsx
import React from 'react';

// CẬP NHẬT DÒNG NÀY: Phải có đầy đủ các biến truyền từ index xuống
const ProductActions = ({ product, qty, setQty, wishlisted, onAddToCart, onAddToWishlist }) => {
  const isAvailable = product.status === 'active';

  return (
    <div className="flex flex-col gap-6 pt-4">
      <div className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Số lượng</p>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors bg-white shadow-sm"
          >
            −
          </button>
          <span className="w-8 text-center font-black text-lg text-slate-800">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors bg-white shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => onAddToCart(product, qty)}
          disabled={!isAvailable}
          className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200 uppercase tracking-widest text-sm"
        >
          {isAvailable ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
        </button>

        <button 
          onClick={() => onAddToWishlist(product)}
          className={`group px-6 rounded-2xl border transition-all active:scale-90 ${
            wishlisted 
              ? 'border-rose-300 bg-rose-50 text-rose-500' 
              : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">
            {wishlisted ? '❤️' : '🤍'}
          </span>
        </button>
      </div>

      <button 
        onClick={() => window.open(`https://zalo.me/your-id`, '_blank')}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-all"
      >
        Trò chuyện với chuyên gia tư vấn về {product.name}
      </button>
    </div>
  );
};

export default ProductActions;