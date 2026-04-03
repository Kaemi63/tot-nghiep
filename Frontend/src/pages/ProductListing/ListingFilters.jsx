import React, { useState } from 'react';

const PRICE_RANGES = [
  { value: '', label: 'Tất cả mức giá' },
  { value: 'under500', label: 'Dưới 500.000₫' },
  { value: '500to1000', label: '500K – 1.000K' },
  { value: 'above1000', label: 'Trên 1.000.000₫' },
];

const SORT_OPTS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'bestseller', label: 'Bán chạy nhất' },
  { value: 'priceAsc', label: 'Giá tăng dần' },
  { value: 'priceDesc', label: 'Giá giảm dần' },
];

const SELECT_CLS = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 transition-colors cursor-pointer';

const ListingFilters = ({ brandFilter, setBrandFilter, priceRange, setPriceRange, sort, setSort, brands = [], totalCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
      <button className="md:hidden w-full flex items-center justify-between text-sm font-semibold text-slate-700" onClick={() => setMobileOpen((o) => !o)}>
        <span>🔎 Bộ lọc & Sắp xếp</span>
        <svg className={`w-4 h-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>

      <div className={`flex flex-wrap items-center gap-3 ${mobileOpen ? 'mt-3' : 'hidden md:flex'}`}>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider hidden md:block">Lọc:</span>
        <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className={SELECT_CLS}>
          <option value="">Thương hiệu</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          {brands.length === 0 && ['Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas'].map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className={SELECT_CLS}>
          {PRICE_RANGES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp:</span>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={SELECT_CLS}>
          {SORT_OPTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-xs text-slate-400 flex-shrink-0">{totalCount} sản phẩm</span>
      </div>
    </div>
  );
};

export default ListingFilters;
