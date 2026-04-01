// components/ProductDetail/ProductActions.jsx
import React from 'react';

const ProductActions = ({ product, onAddToCart, onAddToWishlist }) => {
  return (
    <div className="flex flex-col gap-4 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex gap-4">
        {/* Nút Add to Cart - Chủ đạo */}
        <button 
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className="flex-1 bg-slate-900 text-white font-bold py-5 rounded-2xl hover:bg-indigo-600 active:scale-[0.98] transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200 disabled:shadow-none uppercase tracking-widest text-sm"
        >
          {product.inStock ? 'Thêm vào giỏ hàng' : 'Tạm hết hàng'}
        </button>

        {/* Nút Wishlist */}
        <button 
          onClick={() => onAddToWishlist(product)}
          className="group px-6 rounded-2xl border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-100 hover:bg-rose-50 transition-all active:scale-90"
        >
          <span className="text-xl group-hover:scale-125 transition-transform inline-block">♥</span>
        </button>
      </div>

      {/* Nút Yêu cầu tư vấn - Đúng phong cách Luxury Service */}
      <button 
        onClick={() => window.open(`https://zalo.me/your-id`, '_blank')}
        className="w-full py-4 rounded-2xl border border-dashed border-slate-300 text-slate-500 font-medium hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm"
      >
        Trò chuyện với chuyên gia tư vấn
      </button>
    </div>
  );
};

export default ProductActions;