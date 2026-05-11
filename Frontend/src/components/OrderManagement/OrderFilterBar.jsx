import React from 'react';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'shipped', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const OrderFilterBar = ({ searchTerm, statusFilter, onSearchChange, onStatusChange, onReset }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Tìm kiếm đơn hàng</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm theo mã, tên khách, số điện thoại..."
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Lọc theo trạng thái</label>
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-end justify-end">
        <button
          onClick={onReset}
          className="w-full rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition"
        >
          Đặt lại bộ lọc
        </button>
      </div>
    </div>
  );
};

export default OrderFilterBar;
