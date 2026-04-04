import React from 'react';
import Stars from './Stars';

/**
 * Formats a VND price number into display string.
 * e.g. 125000000 → "125.000.000đ"
 */
const formatPrice = (num) =>
  num ? num.toLocaleString('vi-VN') + 'đ' : '—';

/**
 * Determines badge label based on product fields.
 */
const getBadge = (product) => {
  if (product.is_featured) return 'Nổi bật';
  return null;
};

const ProductCard = ({ product, onSelect, onAddToCart }) => {
  const badge = getBadge(product);
  const price = formatPrice(product.base_price);
  const image = product.thumbnail_url || `https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80`;
  const brandName = product.brands?.name || '';
  const rating = 4.8; // placeholder until ratings table exists

  return (
    <article
      className="group relative rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
      onClick={onSelect}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow bg-indigo-600">
          {badge}
        </span>
      )}

      {/* Wishlist heart */}
      <button
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-slate-400 hover:text-rose-500 shadow transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {/* Image */}
      <div className="overflow-hidden h-52">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        {brandName && (
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{brandName}</p>
        )}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{product.name}</h3>

        <div className="flex items-center gap-2 mt-1.5">
          <Stars rating={rating} />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-extrabold text-indigo-600 text-base">{price}</span>
        </div>

        {/* Add to cart – appears on hover */}
        <button
          className="mt-3 w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors opacity-0 group-hover:opacity-100 duration-200"
          onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(product); }}
        >
          + Thêm vào giỏ
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
