import React from 'react';
import { useBrands } from '../../services/useBrands';

/** Returns a consistent accent colour string for a brand index */
const BRAND_COLORS = [
  '#6366f1', '#f43f5e', '#f59e0b', '#10b981',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
];

const SkeletonBrand = () => (
  <div className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-white border border-slate-100 animate-pulse">
    <div className="w-10 h-10 rounded-xl bg-slate-200 mb-1.5" />
    <div className="h-2.5 w-12 bg-slate-200 rounded" />
  </div>
);

const TopBrands = ({ onOpenListing }) => {
  const { brands, loading, error } = useBrands(12);

  return (
    <section>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Thương hiệu hàng đầu</h2>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4">
          Không thể tải thương hiệu: {error}
        </div>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonBrand key={i} />)
          : brands.map((brand, idx) => (
            <button
              key={brand.id}
              onClick={() => onOpenListing()}
              className="group flex flex-col items-center justify-center py-4 px-2 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              {brand.logo_url ? (
                <img
                  src={brand.logo_url}
                  alt={brand.name}
                  className="w-10 h-10 object-contain rounded-xl mb-1.5 group-hover:scale-110 transition-transform"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-black mb-1.5 group-hover:scale-110 transition-transform"
                  style={{ background: BRAND_COLORS[idx % BRAND_COLORS.length] }}
                >
                  {brand.name[0]}
                </div>
              )}
              <span className="text-[11px] font-semibold text-slate-600">{brand.name}</span>
            </button>
          ))}
      </div>
    </section>
  );
};

export default TopBrands;
