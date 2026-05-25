import React from 'react';

const METHODS = {
  cod: {
    label: 'Thanh toán khi nhận hàng',
    shortLabel: 'COD',
    emoji: '💵',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
  },
  bank_transfer: {
    label: 'Chuyển khoản ngân hàng',
    shortLabel: 'Bank',
    emoji: '🏦',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
  },
  momo: {
    label: 'Ví điện tử MoMo',
    shortLabel: 'MoMo',
    emoji: '🍑',
    bg: 'bg-pink-50',
    text: 'text-pink-700',
  },
  vnpay: {
    label: 'Cổng thanh toán VNPAY',
    shortLabel: 'VNPAY',
    emoji: '💳',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
  },
};

const PaymentMethodIcon = ({ method, compact = false }) => {
  const config = METHODS[method?.toLowerCase()] || METHODS.cod;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${config.bg} ${config.text}`}>
        <span>{config.emoji}</span>
        {config.shortLabel}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center text-xl`}>
        {config.emoji}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-700">{config.label}</p>
        <p className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">{config.shortLabel}</p>
      </div>
    </div>
  );
};

export default PaymentMethodIcon;
