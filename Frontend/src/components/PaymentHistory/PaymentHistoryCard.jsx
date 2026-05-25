import React, { useState } from 'react';
import { fmt, formatDate } from '../../utils/format.js';
import PaymentStatusBadge from './PaymentStatusBadge';
import PaymentMethodIcon from './PaymentMethodIcon';

const PaymentHistoryCard = ({ payment }) => {
  const [expanded, setExpanded] = useState(false);

  // Dữ liệu từ backend payments join orders
  const order = payment.orders || {};
  const createdAt = payment.created_at
    ? new Date(payment.created_at).toLocaleString('vi-VN')
    : '—';
  const paidAt = payment.paid_at
    ? new Date(payment.paid_at).toLocaleString('vi-VN')
    : null;
  const transactionCode = payment.transaction_code || null;

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        expanded
          ? 'border-indigo-200 shadow-lg shadow-indigo-50/50'
          : 'border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-slate-200'
      }`}
    >
      {/* ── HEADER ── */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white cursor-pointer group"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Bên trái: Icon + Mã đơn */}
        <div className="flex items-center gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
            payment.status === 'success'
              ? 'bg-emerald-50'
              : payment.status === 'failed'
              ? 'bg-red-50'
              : 'bg-amber-50'
          }`}>
            {payment.status === 'success' ? (
              <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : payment.status === 'failed' ? (
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đơn hàng</p>
            <p className="text-sm font-black text-slate-700 tracking-tight">
              #{order.order_code || 'N/A'}
            </p>
          </div>
        </div>

        {/* Bên phải: Thông tin tổng quan */}
        <div className="flex items-center gap-5 flex-wrap">
          {/* Phương thức */}
          <div className="hidden sm:block">
            <PaymentMethodIcon method={payment.payment_method} compact />
          </div>

          {/* Ngày giao dịch */}
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ngày tạo</p>
            <p className="text-[11px] font-bold text-slate-600">{createdAt}</p>
          </div>

          {/* Số tiền */}
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Số tiền</p>
            <p className="text-sm font-black text-indigo-600">{fmt(payment.amount)}</p>
          </div>

          {/* Trạng thái */}
          <PaymentStatusBadge status={payment.status} />

          {/* Mũi tên mở rộng */}
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ── CHI TIẾT MỞ RỘNG ── */}
      {expanded && (
        <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Phương thức thanh toán */}
            <DetailBlock title="Phương thức thanh toán">
              <PaymentMethodIcon method={payment.payment_method} />
            </DetailBlock>

            {/* Mã giao dịch */}
            <DetailBlock title="Mã giao dịch">
              {transactionCode ? (
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-bold">
                    {transactionCode}
                  </code>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa có mã giao dịch</p>
              )}
            </DetailBlock>

            {/* Thời gian thanh toán */}
            <DetailBlock title="Thời gian thanh toán">
              {paidAt ? (
                <p className="text-xs font-bold text-emerald-600">{paidAt}</p>
              ) : (
                <p className="text-xs text-slate-400 italic">Chưa thanh toán</p>
              )}
            </DetailBlock>

            {/* Tổng tiền đơn hàng */}
            <DetailBlock title="Tổng tiền đơn hàng">
              <p className="text-lg font-black text-indigo-600">{fmt(order.total_amount || payment.amount)}</p>
            </DetailBlock>
          </div>

          {/* Tên người nhận (nếu có từ orders) */}
          {order.recipient_name && (
            <div className="bg-white/60 p-4 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thông tin người nhận</p>
              <p className="text-sm font-bold text-slate-700">{order.recipient_name}</p>
            </div>
          )}

          {/* Timeline thanh toán */}
          <div className="bg-white/60 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tiến trình thanh toán</p>
            <div className="space-y-3 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              {/* Bước 1: Khởi tạo */}
              <TimelineStep
                active={true}
                status="Khởi tạo giao dịch"
                time={createdAt}
                description={`Phương thức: ${payment.payment_method?.toUpperCase()}`}
              />

              {/* Bước 2: Kết quả */}
              {payment.status === 'success' && (
                <TimelineStep
                  active={true}
                  color="emerald"
                  status="Thanh toán thành công"
                  time={paidAt || '—'}
                  description={transactionCode ? `Mã GD: ${transactionCode}` : 'Đã xác nhận'}
                />
              )}
              {payment.status === 'failed' && (
                <TimelineStep
                  active={true}
                  color="red"
                  status="Thanh toán thất bại"
                  time={createdAt}
                  description="Giao dịch không thành công"
                />
              )}
              {payment.status === 'pending' && (
                <TimelineStep
                  active={false}
                  status="Đang chờ xử lý"
                  time="—"
                  description="Giao dịch đang được xử lý"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/** Block chi tiết nhỏ dùng trong phần mở rộng */
const DetailBlock = ({ title, children }) => (
  <div className="bg-white p-3 rounded-xl border border-slate-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
    {children}
  </div>
);

/** Bước trong timeline thanh toán */
const TimelineStep = ({ active, color = 'indigo', status, time, description }) => (
  <div className="flex gap-4 relative">
    <div
      className={`w-4 h-4 rounded-full border-4 border-white shadow-sm shrink-0 z-10 ${
        active
          ? color === 'emerald'
            ? 'bg-emerald-500 scale-110'
            : color === 'red'
            ? 'bg-red-500 scale-110'
            : 'bg-indigo-500 scale-110'
          : 'bg-slate-300'
      }`}
    />
    <div className="flex-1 -mt-1">
      <div className="flex justify-between items-center">
        <p
          className={`text-[11px] font-black uppercase ${
            active
              ? color === 'emerald'
                ? 'text-emerald-600'
                : color === 'red'
                ? 'text-red-600'
                : 'text-indigo-600'
              : 'text-slate-400'
          }`}
        >
          {status}
        </p>
        <p className="text-[9px] font-bold text-slate-400">{time}</p>
      </div>
      <p className="text-xs text-slate-500 mt-0.5">{description}</p>
    </div>
  </div>
);

export default PaymentHistoryCard;
