import React from 'react';

/** Format VND price number → string */
export const fmt = (num) =>
  typeof num === 'number' ? num.toLocaleString('vi-VN') + '₫' : (num ?? '—');

/** Blank-slate empty state for any page */
export const EmptyState = ({ icon, title, desc, action }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center">
    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-4xl mb-5">{icon}</div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm max-w-xs">{desc}</p>
    {action && (
      <button onClick={action.onClick} className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors">
        {action.label}
      </button>
    )}
  </div>
);

/** Consistent page wrapper */
export const PageShell = ({ children, className = '' }) => (
  <div className={`h-full overflow-y-auto bg-[#f8f9ff] ${className}`}>
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">{children}</div>
  </div>
);

/** Status badge for order states */
const STATUS_STYLES = {
  'Chờ xác nhận': 'bg-amber-50 text-amber-700 border-amber-200',
  'Đang xử lý':   'bg-blue-50 text-blue-700 border-blue-200',
  'Đang giao':    'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Đã giao':      'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Đã hủy':       'bg-red-50 text-red-700 border-red-200',
};
export const StatusBadge = ({ status }) => {
  const s = STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s}`}>
      {status}
    </span>
  );
};

/** Star rating row */
export const Stars = ({ rating = 5 }) => (
  <span className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </span>
);
