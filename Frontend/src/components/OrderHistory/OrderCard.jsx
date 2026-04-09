import React, { useState } from 'react';
import { fmt } from '../../utils/format.js';
import { StatusBadge } from '../ShopUI/ShopUI.jsx';
import ReviewModal from './ReviewModal'; 

const OrderCard = ({ order, isSelected, onSelect, onClose }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const orderDate = order.created_at 
    ? new Date(order.created_at).toLocaleString('vi-VN')
    : 'Đang cập nhật';

  // Điều kiện hiện nút Đánh giá
  const canReview = order.payment_status === 'paid' && order.order_status === 'confirmed';

  const handleOpenReview = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowReviewModal(true);
  };

  return (
    <>
      <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isSelected ? 'border-indigo-300 shadow-md' : 'border-slate-100 bg-white shadow-sm hover:shadow-md'
      }`}>
        {/* --- HEADER ĐƠN HÀNG --- */}
        <div 
          className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white cursor-pointer"
          onClick={() => isSelected ? onClose() : onSelect(order)}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9h11z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mã đơn hàng</p>
              <p className="text-sm font-black text-slate-700 tracking-tight">#{order.order_code}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày đặt</p>
                <p className="text-[11px] font-bold text-slate-600">{orderDate}</p>
             </div>
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng thanh toán</p>
                <p className="text-sm font-black text-indigo-600">{fmt(order.total_amount)}</p>
             </div>
             <StatusBadge status={order.order_status} />
          </div>
        </div>

        {/* --- CHI TIẾT --- */}
        {isSelected && (
          <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
            
            {/* 1. Danh sách sản phẩm - ĐÃ SỬA LẠI DATA MAPPING */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sản phẩm</p>
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative shrink-0">
                      {/* Lưu ý: order_items không có thumbnail, nếu bạn muốn hiện ảnh bạn phải join bảng products ở Backend */}
                      <div className="w-15 h-15 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-100 overflow-hidden">
                         <img 
                            src={item.products?.thumbnail_url} 
                            className="w-full h-full object-cover" 
                            alt={item.product_name}
                         />
                      </div>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="min-w-0">
                      {/* Sửa item.products?.name thành item.product_name */}
                      <p className="text-xs font-bold text-slate-700 line-clamp-1">{item.product_name}</p>
                      {/* Sửa item.unit_price thành item.price và thêm format "Số lượng x Giá" */}
                      <p className="text-[10px] text-slate-500 font-medium">
                        Số lượng: {item.quantity} × {fmt(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Hiển thị Tổng tiền của sản phẩm đó (phải có) */}
                    <div className="text-right">
                      <p className="text-xs font-black text-slate-800">{fmt(item.total)}</p>
                    </div>

                    {/* Nút Đánh giá sản phẩm */}
                    {canReview && (
                    <button 
                      onClick={(e) => handleOpenReview(e, item)}
                      className="ml-4 px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tighter"
                    >
                      Đánh giá
                    </button>
                  )}
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Lịch sử trạng thái */}
            <div className="bg-white/60 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hành trình đơn hàng</p>
              <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {order.order_status_histories?.length > 0 ? (
                  order.order_status_histories.map((h, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      <div className={`w-4 h-4 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${idx === 0 ? 'bg-indigo-500 scale-110' : 'bg-slate-300'}`} />
                      <div className="flex-1 -mt-1">
                        <div className="flex justify-between items-center">
                          <p className={`text-[11px] font-black uppercase ${idx === 0 ? 'text-indigo-600' : 'text-slate-500'}`}>{h.status}</p>
                          <p className="text-[9px] font-bold text-slate-400">{new Date(h.created_at).toLocaleString('vi-VN')}</p>
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

            {/* 3. Thông tin giao hàng & Thanh toán */}
            <div className="grid grid-cols-2 gap-4 bg-white/40 p-3 rounded-xl border border-white text-[11px]">
              <div>
                <p className="text-slate-400 font-bold uppercase mb-1">Địa chỉ nhận hàng</p>
                <p className="font-semibold text-slate-700">{order.recipient_name}</p>
                <p className="text-slate-600">{order.recipient_phone}</p>
                <p className="text-slate-600 line-clamp-2">
                  {order.shipping_address}, {order.ward}, {order.district}, {order.province}
                </p>
              </div>
              <div className="text-right">
                <p className="text-slate-400 font-bold uppercase mb-1">Thanh toán</p>
                <p className="font-semibold text-slate-700 uppercase">{order.payment_method}</p>
                <p className={`font-bold ${order.payment_status === 'paid' ? 'text-emerald-600' : 'text-orange-500'}`}>
                  {order.payment_status === 'paid' ? 'ĐÃ THANH TOÁN' : 'CHƯA THANH TOÁN'}
                </p>
                {order.note && (
                  <div className="mt-2 text-slate-500 italic">
                    <p className="text-[9px] font-bold uppercase">Ghi chú:</p>
                    <p>{order.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Review */}
      {showReviewModal && selectedProduct && (
        <ReviewModal 
          order={order} 
          product={selectedProduct} 
          onClose={() => {
            setShowReviewModal(false);
            setSelectedProduct(null);
          }} 
        />
      )}
    </>
  );
};

export default OrderCard;