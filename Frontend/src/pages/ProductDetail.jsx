import React from 'react';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import ProductActions from '../components/ProductDetail/ProductActions';
import ProductReviews from '../components/ProductDetail/ProductReviews';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist }) => {
  if (!product) return null;

  return (
    <div className="h-full overflow-y-auto bg-white font-sans selection:bg-indigo-50 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        {/* Header điều hướng */}
        <button 
          onClick={onBack} 
          className="group mb-12 flex items-center gap-3 text-xs font-black tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all uppercase"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Quay lại
        </button>

        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* Cột Trái: Hình ảnh */}
          <div className="sticky top-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl shadow-slate-200 border border-white">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-[2s]" 
              />
            </div>
          </div>

          {/* Cột Phải: Thông tin & Hành động */}
          <div className="flex flex-col justify-center min-h-[500px]">
            <ProductInfo product={product} />
            <ProductActions 
              product={product} 
              onAddToCart={onAddToCart} 
              onAddToWishlist={onAddToWishlist} 
            />
          </div>
        </div>

        {/* Danh sách đánh giá (Đã tách ở bước trước) */}
        <ProductReviews reviews={product.reviews || []} />
      </div>
    </div>
  );
};

export default ProductDetail;