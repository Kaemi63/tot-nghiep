import React from 'react';

// BƯỚC 1: Thêm 'wishlisted', 'qty', 'setQty' vào danh sách nhận từ Props
const ProductActions = ({ product, qty, setQty, wishlisted, onAddToCart, onAddToWishlist }) => {
  const isAvailable = product.status === 'active';

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* PHẦN CHỌN SỐ LƯỢNG (Đã chuyển từ index sang) */}
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số lượng</p>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center font-extrabold text-lg">{qty}</span>
          <button 
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Nút Giỏ hàng */}
        <button 
          onClick={() => onAddToCart(product, qty)}
          disabled={!isAvailable}
          className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200 uppercase tracking-widest text-sm"
        >
          {isAvailable ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
        </button>

        {/* BƯỚC 2: Nút Wishlist sử dụng biến 'wishlisted' */}
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

      {/* Nút Zalo */}
      <button 
        onClick={() => window.open(`https://zalo.me/your-id`, '_blank')}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 font-bold text-sm hover:border-indigo-300 hover:text-indigo-600 transition-all"
      >
        Tư vấn trực tiếp qua Zalo
      </button>
    </div>
  );
};

export default ProductActions;