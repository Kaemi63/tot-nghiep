import React from 'react';
import { StatusBadge, fmt } from '../../shared/ShopUI';

const OrderCard = ({ order, isSelected, onSelect, onClose }) => (
  <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isSelected ? 'border-indigo-300 shadow-md' : 'border-slate-100 bg-white shadow-sm hover:shadow-md'}`}>
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">{order.id}</p>
          <p className="text-xs text-slate-400 mt-0.5">{order.date}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={order.status} />
        <p className="font-extrabold text-slate-800">{fmt(order.total)}</p>
        <button onClick={() => isSelected ? onClose() : onSelect(order)} className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${isSelected ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
          {isSelected ? 'Đóng' : 'Chi tiết'}
        </button>
      </div>
    </div>
    {isSelected && (
      <div className="border-t border-indigo-100 bg-indigo-50/40 p-4 space-y-3">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm đã đặt</p>
        {(order.products || []).map((item) => {
          const p = item.product || item;
          const price = p.priceRaw ?? p.base_price ?? 0;
          const image = p.image || p.thumbnail_url || 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80';
          return (
            <div key={p.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100">
              <img src={image} alt={p.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{p.name}</p>
                <p className="text-xs text-slate-400">x{item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-indigo-600">{fmt(price * item.quantity)}</p>
            </div>
          );
        })}
        <div className="flex justify-end pt-2 border-t border-indigo-100">
          <div className="text-right">
            <p className="text-xs text-slate-500">Tổng đơn hàng</p>
            <p className="text-lg font-extrabold text-slate-800">{fmt(order.total)}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default OrderCard;
