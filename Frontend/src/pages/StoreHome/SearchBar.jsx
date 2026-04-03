import React from 'react';
import { NAV_CATEGORIES } from './CategoryShowcase';

const SearchBar = ({ search, onSearchChange, onOpenListing }) => (
  <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-3">
    <div className="max-w-6xl mx-auto flex items-center gap-4">
      {/* Search input */}
      <div className="relative flex-1">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm, thương hiệu..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white focus:outline-none text-sm transition-all"
        />
      </div>


    </div>

    {/* Mobile pills (optional kept) */}
    <div className="md:hidden flex gap-2 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
      {NAV_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onOpenListing(cat.id)}
          className="flex-shrink-0 flex items-center px-5 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-widest shadow-sm hover:border-indigo-300 transition-colors"
        >
          <span>{cat.label}</span>
        </button>
      ))}
    </div>
  </div>
);

export default SearchBar;
