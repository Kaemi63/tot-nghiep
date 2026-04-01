import React, { useState, useEffect } from 'react';
import ProductInfo from '../components/ProductDetail/ProductInfo';
import ProductActions from '../components/ProductDetail/ProductActions';
import ProductReviews from '../components/ProductDetail/ProductReviews';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist }) => {
  // Quản lý ảnh đang được chọn để hiển thị ở khung lớn
  const [selectedImage, setSelectedImage] = useState(product?.thumbnail_url);

  useEffect(() => {
    if (product) setSelectedImage(product.thumbnail_url);
  }, [product]);

  if (!product) return null;

  return (
    <div className="h-full overflow-y-auto bg-white font-sans selection:bg-indigo-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        <button 
          onClick={onBack} 
          className="group mb-12 flex items-center gap-3 text-xs font-black tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-all uppercase"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Quay lại
        </button>

        <div className="grid gap-16 lg:grid-cols-2 items-start">
          {/* CỘT TRÁI: Gallery Hình ảnh */}
          <div className="space-y-6 sticky top-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] shadow-2xl border border-slate-50 bg-slate-50">
              <img 
                src={selectedImage}
                className="h-full w-full object-cover transition-all duration-700" 
              />
            </div>
            
            {/* Hiển thị danh sách ảnh phụ từ product_images */}
            {product.product_images && product.product_images.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {/* Ảnh thumbnail chính */}
                <button 
                  onClick={() => setSelectedImage(product.thumbnail_url)}
                  className={`h-24 w-20 flex-shrink-0 rounded-2xl border-2 transition-all overflow-hidden ${selectedImage === product.thumbnail_url ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-50'}`}
                >
                  <img src={product.thumbnail_url} className="h-full w-full object-cover" />
                </button>
                {/* Các ảnh phụ khác */}
                {product.product_images.map((img) => (
                  <button 
                    key={img.id}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`h-24 w-20 flex-shrink-0 rounded-2xl border-2 transition-all overflow-hidden ${selectedImage === img.image_url ? 'border-indigo-600 shadow-md' : 'border-transparent opacity-50'}`}
                  >
                    <img src={img.image_url} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: Thông tin */}
          <div className="flex flex-col space-y-10">
            <ProductInfo product={product} />

            <ProductActions 
              product={product} 
              onAddToCart={onAddToCart} 
              onAddToWishlist={onAddToWishlist} 
            />

            {/* Hiển thị Thông số kỹ thuật (Chất liệu, Xuất xứ...) */}
            {product.product_specifications && product.product_specifications.length > 0 && (
              <div className="pt-10 border-t border-slate-100">
                <h5 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Chi tiết nghệ thuật</h5>
                <dl className="grid grid-cols-1 gap-y-4">
                  {product.product_specifications.map((spec) => (
                    <div key={spec.id} className="flex justify-between py-3 border-b border-slate-50">
                      <dt className="text-sm text-slate-400 font-light">{spec.spec_name}</dt>
                      <dd className="text-sm font-medium text-slate-800 tracking-tight">{spec.spec_value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Câu chuyện sản phẩm (Description) */}
            {product.description && (
              <div className="pt-10 border-t border-slate-100">
                <h5 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-widest">Câu chuyện sản phẩm</h5>
                <div className="text-slate-600 leading-loose font-light whitespace-pre-line text-sm">
                  {product.description}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-slate-100">
          <ProductReviews reviews={product.reviews || []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;