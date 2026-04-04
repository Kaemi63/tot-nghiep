import React from 'react';

const ListingPagination = ({ page, totalPage, onPage }) => {
  if (totalPage <= 1) return null;

  const pages = Array.from({ length: totalPage }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPage || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        ← Trước
      </button>
      {visible.map((p, idx) => {
        const prev = visible[idx - 1];
        return (
          <React.Fragment key={p}>
            {prev && p - prev > 1 && <span className="text-slate-400 text-sm px-1">…</span>}
            <button onClick={() => onPage(p)} className={`w-9 h-9 rounded-xl text-sm font-bold transition-all ${p === page ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600'}`}>
              {p}
            </button>
          </React.Fragment>
        );
      })}
      <button disabled={page >= totalPage} onClick={() => onPage(page + 1)} className="px-3 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        Sau →
      </button>
    </div>
  );
};

export default ListingPagination;
