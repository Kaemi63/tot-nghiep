import React from 'react';

const ProductInfo = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat('vi-VN', { 
    style: 'currency', currency: 'VND' 
  }).format(product.base_price || 0);

  const sizes = product.product_variants ? [...new Set(product.product_variants.map(v => v.size).filter(Boolean))] : [];
  const colors = product.product_variants ? [...new Set(product.product_variants.map(v => v.color).filter(Boolean))] : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-3">
          {product.brands?.name || 'High-end Collection'}
        </p>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {product.name}
        </h1>
        <p className="mt-5 text-3xl font-light text-slate-900 tracking-tight">
          {formattedPrice}
        </p>
      </div>

      {/* Hiển thị Lựa chọn Màu sắc */}
      {colors.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Màu sắc</span>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => (
              <button key={color} className="px-5 py-2 rounded-full border border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-600 hover:border-indigo-600 transition-all uppercase">
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hiển thị Lựa chọn Kích thước */}
      {sizes.length > 0 && (
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kích thước</span>
          <div className="flex flex-wrap gap-3">
            {sizes.map(size => (
              <button key={size} className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-xs font-black text-slate-600 hover:bg-white hover:border-indigo-600 transition-all uppercase">
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mô tả ngắn */}
      {product.short_description && (
        <p className="text-slate-500 leading-relaxed font-light text-lg italic border-l-2 border-indigo-50 pl-6">
          {product.short_description}
        </p>
      )}
    </div>
  );
};

export default ProductInfo;