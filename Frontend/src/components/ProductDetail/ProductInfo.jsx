import React from 'react';
import { fmt } from '../../utils/format.js'; // Sử dụng file fmt của bạn
import { Stars } from '../../components/ShopUI/ShopUI.jsx';

const ProductInfo = ({ product }) => {
  const rating = product.rating ?? 4.8;
  const reviews = product.reviews || [];
  
  const sizes = product.product_variants ? [...new Set(product.product_variants.map(v => v.size).filter(Boolean))] : [];
  const colors = product.product_variants ? [...new Set(product.product_variants.map(v => v.color).filter(Boolean))] : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Brand - CSS từ index cũ */}
      {product.brands?.name && (
        <span className="inline-block text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full w-fit">
          {product.brands.name}
        </span>
      )}

      {/* Tên sản phẩm - CSS từ index cũ */}
      <h1 className="text-3xl font-extrabold text-slate-800 leading-snug">
        {product.name}
      </h1>

      {/* Đánh giá Stars - CSS từ index cũ */}
      <div className="flex items-center gap-3">
        <Stars rating={rating} size="md" />
        <span className="text-sm text-slate-500">{rating} / 5</span>
        {reviews.length > 0 && <span className="text-sm text-slate-400">({reviews.length} đánh giá)</span>}
      </div>

      {/* Giá tiền - Sử dụng FMT */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-extrabold text-indigo-600">
          {fmt(product.base_price || 0)}
        </span>
      </div>

      {/* Color Selection */}
      {colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Màu sắc</p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button key={color} className="px-4 py-1.5 rounded-full border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-indigo-600 transition-all uppercase">
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kích thước</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button key={size} className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-600 transition-all">
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;