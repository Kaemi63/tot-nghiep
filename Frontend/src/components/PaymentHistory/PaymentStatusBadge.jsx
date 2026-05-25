import React from 'react';

const STATUS_MAP = {
  pending: {
    label: 'Chờ thanh toán',
    style: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  success: {
    label: 'Thành công',
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  failed: {
    label: 'Thất bại',
    style: 'bg-red-50 text-red-700 border-red-200',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  refunded: {
    label: 'Đã hoàn tiền',
    style: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
};

const PaymentStatusBadge = ({ status }) => {
  const config = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${config.style}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default PaymentStatusBadge;
