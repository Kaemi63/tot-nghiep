import React, { useState } from 'react';
import { Stars, fmt } from '../../shared/ShopUI';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80';

const ProductDetail = ({ product, onBack, onAddToCart, onAddToWishlist }) => {
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('desc');
  const [wishlisted, setWishlisted] = useState(false);

  if (!product) return null;

  const price = product.base_price ?? product.priceRaw ?? 0;
  const image = product.thumbnail_url || product.image || PLACEHOLDER;
  const brand = product.brands?.name || product.brand || '';
  const rating = product.rating ?? 4.8;
  const reviews = product.reviews || [];

  const handleAddToCart = () => onAddToCart && onAddToCart({ ...product, qty });
  const handleWishlist = () => { setWishlisted((w) => !w); onAddToWishlist && onAddToWishlist(product); };

  return (
    <div className="h-full overflow-y-auto bg-[#f8f9ff]">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <button onClick={onBack} className="group mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors font-medium">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại danh sách
        </button>

        <div className="grid gap-12 lg:grid-cols-2 items-start">
          <div className="lg:sticky lg:top-8">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-slate-100">
              <img src={image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[2s]" />
              <button onClick={handleWishlist} className={`absolute top-4 right-4 w-11 h-11 rounded-full border flex items-center justify-center shadow-lg transition-all ${wishlisted ? 'bg-rose-50 border-rose-300 text-rose-500' : 'bg-white/90 border-slate-200 text-slate-400 hover:text-rose-500'}`}>
                <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {brand && <span className="inline-block text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full w-fit">{brand}</span>}
            <h1 className="text-3xl font-extrabold text-slate-800 leading-snug">{product.name}</h1>
            <div className="flex items-center gap-3">
              <Stars rating={rating} size="md" />
              <span className="text-sm text-slate-500">{rating} / 5</span>
              {reviews.length > 0 && <span className="text-sm text-slate-400">({reviews.length} đánh giá)</span>}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-indigo-600">{fmt(price)}</span>
              {product.oldPrice && <span className="text-lg text-slate-400 line-through">{fmt(product.oldPrice)}</span>}
            </div>
            {product.short_description && <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-indigo-200 pl-4">{product.short_description}</p>}
            
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Số lượng</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors">−</button>
                <span className="w-12 text-center font-extrabold text-lg">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-xl text-slate-600 hover:border-indigo-400 transition-colors">+</button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={handleAddToCart} className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-200">
                🛒 Thêm vào giỏ hàng
              </button>
              <button onClick={handleWishlist} className={`px-4 rounded-2xl border font-bold transition-all ${wishlisted ? 'border-rose-300 bg-rose-50 text-rose-500' : 'border-slate-200 hover:border-rose-300 text-slate-400 hover:text-rose-500'}`}>
                {wishlisted ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {['🔒 Bảo mật SSL', '↩️ Đổi trả 30 ngày', '🚀 Giao hàng nhanh', '✅ Hàng chính hãng'].map((t) => (
                <span key={t} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-3 py-1.5 rounded-xl">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <div className="flex gap-1 border-b border-slate-200 mb-6">
            {[{ id: 'desc', label: 'Mô tả sản phẩm' }, { id: 'reviews', label: `Đánh giá (${reviews.length})` }].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-5 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          {activeTab === 'desc' && <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">{product.description || product.short_description || 'Chưa có mô tả chi tiết cho sản phẩm này.'}</div>}
          {activeTab === 'reviews' && (
            reviews.length === 0 ? <p className="text-slate-400 text-sm">Chưa có đánh giá nào. Hãy là người đầu tiên!</p> : (
              <div className="space-y-4">
                {reviews.map((r, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">{(r.name || r.author || 'U')[0]}</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{r.name || r.author || 'Khách hàng'}</p>
                        <Stars rating={r.rating || 5} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{r.comment || r.text || ''}</p>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
