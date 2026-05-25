import React from 'react';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Tất cả', icon: '📋' },
  { value: 'success', label: 'Thành công', icon: '✅' },
  { value: 'pending', label: 'Đang chờ', icon: '⏳' },
  { value: 'failed', label: 'Thất bại', icon: '❌' },
];

const PaymentHistoryFilters = ({ activeFilter, onFilterChange, searchTerm, onSearchChange, totalCount }) => {
  return (
    <div className="space-y-4">
      {/* Thanh tìm kiếm */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm theo mã đơn hàng, mã giao dịch..."
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400"
        />
        {searchTerm && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-300 transition-colors text-xs"
          >
            ×
          </button>
        )}
      </div>

      {/* Bộ lọc pill */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onFilterChange(opt.value)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeFilter === opt.value
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            <span className="text-sm">{opt.icon}</span>
            {opt.label}
          </button>
        ))}

        {/* Counter */}
        <span className="ml-auto text-xs font-bold text-slate-400">
          {totalCount} giao dịch
        </span>
      </div>
    </div>
  );
};

export default PaymentHistoryFilters;
