// components/ProductDetail/ProductInfo.jsx
import React from 'react';

const ProductInfo = ({ product }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
      <div>
        {/* Brand Tag - Phong cách High-end */}
        <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 mb-3">
          {product.brand}
        </p>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {product.name}
        </h1>
        <p className="mt-5 text-3xl font-light text-slate-900 tracking-tight">
          {product.price}
        </p>
      </div>

      {/* Trạng thái kho hàng */}
      <div className="flex items-center gap-4 py-4 border-y border-slate-50">
        <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          product.inStock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${product.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
          {product.inStock ? 'Còn hàng' : 'Hết hàng'}
        </span>
        <span className="text-xs text-slate-400 font-medium italic">Sản phẩm chính hãng FSA AI</span>
      </div>

      {/* Mô tả sản phẩm */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Chi tiết sản phẩm</h3>
        <p className="text-slate-600 leading-relaxed font-light text-lg">
          {product.description || 'Sản phẩm được tuyển chọn kỹ lưỡng từ những chất liệu cao cấp nhất, mang lại sự tinh tế và thoải mái tuyệt đối cho người mặc trong mọi hoàn cảnh.'}
        </p>
      </div>
    </div>
  );
};

export default ProductInfo;