// ProductInfo.jsx
import React from 'react';
import { fmt } from '../../utils/format.js';
import { Stars } from '../../components/ShopUI/ShopUI.jsx';

const ProductInfo = ({ 
  product, 
  selectedColor, 
  setSelectedColor, 
  selectedSize, 
  setSelectedSize 
}) => {
  if (!product) return null;

  const sizes = product.product_variants 
    ? [...new Set(product.product_variants.map(v => v.size).filter(Boolean))] 
    : [];
  const colors = product.product_variants 
    ? [...new Set(product.product_variants.map(v => v.color).filter(Boolean))] 
    : [];

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-700">
      <div>
        {product.brands?.name && (
          <span className="inline-block text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full mb-3">
            {product.brands.name}
          </span>
        )}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {product.name}
        </h1>
      </div>

      {product.short_description && (
        <p className="text-sm text-slate-500 leading-relaxed border-l-2 border-indigo-100 pl-4 py-1 italic">
          {product.short_description}
        </p>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Stars rating={product.rating ?? 4.8} size="md" />
          <span className="text-sm text-slate-500 font-medium">{product.rating ?? 4.8} / 5</span>
        </div>
        <div className="text-4xl font-black text-indigo-600 tracking-tight">
          {fmt(product.base_price || 0)}
        </div>
      </div>

      {colors.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Màu sắc</p>
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button 
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`px-5 py-2 rounded-full border transition-all text-[11px] font-bold uppercase shadow-sm ${
                  selectedColor === color 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-400 hover:bg-white'
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lựa chọn Kích thước - Kiểm tra selectedSize để đổi Class */}
      {sizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kích thước</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border transition-all text-xs font-black shadow-sm ${
                  selectedSize === size 
                    ? 'border-indigo-600 bg-indigo-600 text-white' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-indigo-400 hover:bg-white'
                }`}
              >
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