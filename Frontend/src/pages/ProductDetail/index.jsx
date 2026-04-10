import React, { useState } from 'react';
import ProductInfo from '../../components/ProductDetail/ProductInfo.jsx';
import ProductActions from '../../components/ProductDetail/ProductActions.jsx';
import ProductReviews from '../../components/ProductDetail/ProductReviews.jsx';
import { useReview } from '../../hooks/useReview';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist }) => {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeTab, setActiveTab] = useState('desc');

  // Fetch reviews theo product.id
  const { reviews, loading: loadingReviews, currentUserId, editReview, fetchReviews } = useReview(product?.id);

  if (!product) return null;

  const image = product.thumbnail_url || product.image || 'https://via.placeholder.com/900';

  // Tính rating trung bình từ reviews thực tế
  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <button onClick={onBack} className="group mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại danh sách
        </button>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="lg:sticky lg:top-8">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
              <img src={image} className="w-full h-full object-cover" alt={product.name} />
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              avgRating={avgRating}
              reviewCount={reviews.length}
            />

            <ProductActions
              product={product}
              qty={qty}
              setQty={setQty}
              wishlisted={wishlisted}
              onAddToCart={() => onAddToCart({ ...product, selected_color: selectedColor, selected_size: selectedSize }, qty)}
              onAddToWishlist={() => {
                setWishlisted(!wishlisted);
                onAddToWishlist(product);
              }}
            />

            <div className="flex flex-wrap gap-3 pt-6 border-t border-slate-100">
              {['🔒 Bảo mật SSL', '↩️ Đổi trả 30 ngày', '🚀 Giao hàng nhanh', '✅ Hàng chính hãng'].map((t) => (
                <span key={t} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-xl">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab mô tả & đánh giá */}
        <div className="mt-14">
          <div className="flex gap-8 border-b border-slate-100 mb-8">
            {[
              { id: 'desc', label: 'Mô tả chi tiết' },
              { id: 'reviews', label: `Đánh giá (${reviews.length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full animate-in fade-in zoom-in duration-300" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'desc' ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed font-medium">
                  {product.description || "Sản phẩm đang được cập nhật mô tả chi tiết từ nhà sản xuất."}
                </p>
              </div>
            ) : loadingReviews ? (
              <div className="text-center py-16 text-slate-400 font-semibold">Đang tải đánh giá...</div>
            ) : (
              <ProductReviews
                reviews={reviews}
                currentUserId={currentUserId}
                onEditReview={fetchReviews}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
