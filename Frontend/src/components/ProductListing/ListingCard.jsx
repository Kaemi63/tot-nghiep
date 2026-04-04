import React from 'react';
import { Stars } from '../ShopUI/ShopUI.jsx';

const fmt = (num) => typeof num === 'number' ? num.toLocaleString('vi-VN') + '₫' : num;

const ListingCard = ({ product, onSelect, onAddToCart, onAddToWishlist }) => {
  const price = product.base_price ?? product.priceRaw ?? 0;
  const displayPrice = typeof price === 'number' ? fmt(price) : product.price;
  const image = product.thumbnail_url || product.image || `https://images.unsplash.com/photo-1516762689617-e6dea80a0c72?auto=format&fit=crop&w=600&q=80`;
  const brand = product.brands?.name || product.brand || '';
  const rating = product.rating ?? 4.7;
  const reviews = product.reviewCount ?? product.reviews ?? 0;

  return (
    <article className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col" onClick={() => onSelect(product)}>
      <button className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-200 border border-slate-200 shadow transition-all" onClick={(e) => { e.stopPropagation(); onAddToWishlist && onAddToWishlist(product); }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
      </button>
      <div className="h-56 overflow-hidden bg-slate-50">
        <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        {brand && <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{brand}</p>}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 flex-1">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-2">
          <Stars rating={rating} />
          {reviews > 0 && <span className="text-xs text-slate-400">({reviews})</span>}
        </div>
        <p className="font-extrabold text-indigo-600 text-base mt-2">{displayPrice}</p>
        <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors" onClick={(e) => { e.stopPropagation(); onSelect(product); }}>Xem chi tiết</button>
          <button className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all" onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          </button>
        </div>
      </div>
    </article>
  );
};

export default ListingCard;
