import React from 'react';
import ProductCard from './ProductCard';
import { useProducts } from '../../hooks/useProducts';

/** Skeleton placeholder while loading */
const SkeletonCard = () => (
  <div className="rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="h-52 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-1/3" />
      <div className="h-4 bg-slate-200 rounded w-4/5" />
      <div className="h-4 bg-slate-200 rounded w-1/2" />
    </div>
  </div>
);

/**
 * FeaturedProducts – fetches and displays featured products from Supabase.
 *
 * Props:
 *   onSelectProduct(product) – navigate to product detail
 *   onAddToCart(product)     – add to cart
 *   onOpenListing()          – navigate to full listing
 */
const FeaturedProducts = ({ onSelectProduct, onAddToCart, onOpenListing }) => {
  const { products, loading, error } = useProducts(6);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Sản phẩm nổi bật</h2>
          <p className="text-sm text-slate-500 mt-0.5">Được yêu thích nhất tuần này</p>
        </div>
        <button
          onClick={() => onOpenListing()}
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
        >
          Xem thêm <span>→</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          Không thể tải sản phẩm: {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => onSelectProduct && onSelectProduct(product)}
                onAddToCart={onAddToCart}
              />
            ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
