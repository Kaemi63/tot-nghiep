import React from 'react';
import { fmt } from '../../utils/format.js';
import { StatusBadge } from '../ShopUI/ShopUI.jsx';

const OrderCard = ({ order, isSelected, onSelect, onClose }) => {
  const orderDate = order.created_at 
    ? new Date(order.created_at).toLocaleString('vi-VN')
    : 'Đang cập nhật';

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isSelected ? 'border-indigo-300 shadow-md' : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
    }`}>
      {/* Header Đơn hàng */}
      <div 
        className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white cursor-pointer"
        onClick={() => isSelected ? onClose() : onSelect(order)}
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{order.order_code}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{orderDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right mr-2">
            <p className="text-xs text-slate-400">Tổng cộng</p>
            <p className="text-sm font-black text-indigo-600">{fmt(order.total_amount)}</p>
          </div>
          <StatusBadge status={order.order_status} />
        </div>
      </div>

      {/* Chi tiết đơn hàng & Lịch sử trạng thái */}
      {isSelected && (
        <div className="border-t border-indigo-100 bg-indigo-50/30 p-4 space-y-5">
          
          {/* 1. Danh sách sản phẩm */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</p>
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3 bg-white/60 rounded-xl p-2 border border-white">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.product_name}</p>
                  <p className="text-[11px] text-slate-500">Số lượng: {item.quantity} × {fmt(item.price)}</p>
                </div>
                <p className="text-sm font-bold text-slate-800">{fmt(item.total)}</p>
              </div>
            ))}
          </div>

          {/* 2. LỊCH SỬ TRẠNG THÁI (Dữ liệu từ bảng order_status_histories) */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trình theo dõi đơn hàng</p>
            <div className="relative pl-4 space-y-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-200">
              {order.order_status_histories?.length > 0 ? (
                order.order_status_histories.map((h, idx) => (
                  <div key={h.id} className="relative">
                    {/* Nút tròn biểu tượng */}
                    <div className={`absolute -left-[15px] w-2.5 h-2.5 rounded-full border-2 border-white ${idx === 0 ? 'bg-indigo-600 ring-4 ring-indigo-100' : 'bg-slate-300'}`}></div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold uppercase ${idx === 0 ? 'text-indigo-600' : 'text-slate-500'}`}>
                          {h.status}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(h.created_at).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{h.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có lịch sử trạng thái</p>
              )}
            </div>
          </div>

          {/* 3. Thông tin giao hàng */}
          <div className="grid grid-cols-2 gap-4 bg-white/40 p-3 rounded-xl border border-white text-[11px]">
            <div>
              <p className="text-slate-400 font-bold uppercase mb-1">Địa chỉ nhận hàng</p>
              <p className="font-semibold text-slate-700">{order.recipient_name}</p>
              <p className="text-slate-600">{order.recipient_phone}</p>
              <p className="text-slate-600 line-clamp-2">{order.shipping_address}, {order.ward}, {order.district}, {order.province}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-bold uppercase mb-1">Thanh toán</p>
              <p className="font-semibold text-slate-700 uppercase">{order.payment_method}</p>
              <p className={`font-bold ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-orange-500'}`}>
                {order.payment_status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;