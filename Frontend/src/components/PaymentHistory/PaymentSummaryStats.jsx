import React from 'react';
import { fmt } from '../../utils/format.js';

const PaymentSummaryStats = ({ payments = [] }) => {
  const totalAmount = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  const successCount = payments.filter((p) => p.status === 'success').length;
  const pendingCount = payments.filter((p) => p.status === 'pending').length;
  const failedCount = payments.filter((p) => p.status === 'failed').length;

  const stats = [
    {
      label: 'Tổng đã thanh toán',
      value: fmt(totalAmount),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'indigo',
      bg: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-indigo-100',
    },
    {
      label: 'Thành công',
      value: successCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'emerald',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-emerald-100',
    },
    {
      label: 'Đang chờ',
      value: pendingCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'amber',
      bg: 'bg-amber-50',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-100',
    },
    {
      label: 'Thất bại',
      value: failedCount,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'red',
      bg: 'bg-red-50',
      textColor: 'text-red-600',
      borderColor: 'border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative bg-white rounded-2xl border ${stat.borderColor} p-4 overflow-hidden group hover:shadow-md transition-all duration-300`}
        >
          {/* Gradient decorator */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} rounded-full -translate-y-1/2 translate-x-1/2 opacity-60 group-hover:scale-150 transition-transform duration-500`} />

          <div className="relative">
            <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.textColor} flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-xl font-black ${stat.textColor} tracking-tight`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentSummaryStats;
