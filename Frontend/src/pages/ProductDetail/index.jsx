import React, { useState } from 'react';
import ProductInfo from '../../components/ProductDetail/ProductInfo.jsx';
import ProductActions from '../../components/ProductDetail/ProductActions.jsx';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist }) => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null;

  const image = product.thumbnail_url || product.image || 'https://via.placeholder.com/900';
  const reviews = product.reviews || [];

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <button onClick={onBack} className="group mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại danh sách
        </button>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          {/* Cột trái: Ảnh */}
          <div className="lg:sticky lg:top-8">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
              <img src={image} className="w-full h-full object-cover" alt={product.name} />
            </div>
          </div>

          {/* Cột phải: Đã dọn sạch code vụn */}
          <div className="flex flex-col gap-8">
            <ProductInfo product={product} />
            
            <ProductActions 
              product={product} 
              qty={qty} 
              setQty={setQty} 
              wishlisted={wishlisted} 
              onAddToCart={onAddToCart} 
              onAddToWishlist={() => {
                setWishlisted(!wishlisted); 
                onAddToWishlist(product);
              }} 
            />

            {/* Cam kết SSL giữ lại cuối cột phải */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              {['🔒 Bảo mật SSL', '↩️ Đổi trả 30 ngày', '🚀 Giao hàng nhanh', '✅ Hàng chính hãng'].map((t) => (
                <span key={t} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-xl">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs bên dưới giữ nguyên code của bạn */}
        <div className="mt-14">
           {/* ... code Tab desc và reviews của bạn ... */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;