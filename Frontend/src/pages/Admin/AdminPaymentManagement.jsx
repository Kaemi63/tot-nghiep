import React, { useState, useEffect, useMemo } from 'react';
import { usePayments } from '../../hooks/usePayments';
import { fmt } from '../../utils/format.js';
import PaymentStatusBadge from '../../components/PaymentHistory/PaymentStatusBadge.jsx';
import PaymentMethodIcon from '../../components/PaymentHistory/PaymentMethodIcon.jsx';

/**
 * Trang quản lý thanh toán dành cho Admin
 * Hiển thị toàn bộ giao dịch trên hệ thống với bảng dữ liệu chi tiết
 */
const AdminPaymentManagement = () => {
  const { paymentHistory, processing, fetchHistory } = usePayments();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHistory(true); // true = admin mode
  }, [fetchHistory]);

  const filteredData = useMemo(() => {
    let result = paymentHistory;
    if (filter !== 'all') {
      result = result.filter((p) => p.status === filter);
    }
    if (searchTerm.trim()) {
      const kw = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const orderCode = p.orders?.order_code?.toLowerCase() || '';
        const name = p.orders?.recipient_name?.toLowerCase() || '';
        const transCode = p.transaction_code?.toLowerCase() || '';
        return orderCode.includes(kw) || name.includes(kw) || transCode.includes(kw);
      });
    }
    return result;
  }, [paymentHistory, filter, searchTerm]);

  // Tổng kê
  const totalSuccess = paymentHistory.filter((p) => p.status === 'success').reduce((s, p) => s + Number(p.amount || 0), 0);
  const totalPending = paymentHistory.filter((p) => p.status === 'pending').length;
  const totalFailed = paymentHistory.filter((p) => p.status === 'failed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Quản lý thanh toán</h1>
          <p className="text-sm text-slate-500 mt-1">Đối soát và theo dõi toàn bộ giao dịch trên hệ thống</p>
        </div>
        <button
          onClick={() => fetchHistory(true)}
          disabled={processing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-50"
        >
          <svg className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-emerald-100 p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tổng thu thành công</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{fmt(totalSuccess)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-amber-100 p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đang chờ xử lý</p>
          <p className="text-2xl font-black text-amber-600 mt-1">{totalPending} giao dịch</p>
        </div>
        <div className="bg-white rounded-2xl border border-red-100 p-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thất bại</p>
          <p className="text-2xl font-black text-red-600 mt-1">{totalFailed} giao dịch</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm mã đơn, tên người nhận, mã giao dịch..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all"
          />
        </div>
        {['all', 'success', 'pending', 'failed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300'
            }`}
          >
            {f === 'all' ? 'Tất cả' : f === 'success' ? 'Thành công' : f === 'pending' ? 'Chờ xử lý' : 'Thất bại'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã đơn</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Người nhận</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức</th>
                <th className="text-right px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                <th className="text-center px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mã GD</th>
                <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {processing && filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-3" />
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-sm">
                    Không tìm thấy giao dịch nào
                  </td>
                </tr>
              ) : (
                filteredData.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-700">#{payment.orders?.order_code || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-slate-600">{payment.orders?.recipient_name || '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <PaymentMethodIcon method={payment.payment_method} compact />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-black text-indigo-600">{fmt(payment.amount)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <PaymentStatusBadge status={payment.status} />
                    </td>
                    <td className="px-4 py-3">
                      {payment.transaction_code ? (
                        <code className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{payment.transaction_code}</code>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {payment.created_at ? new Date(payment.created_at).toLocaleString('vi-VN') : '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer count */}
      <p className="text-xs text-slate-400 text-right">
        Hiển thị {filteredData.length} / {paymentHistory.length} giao dịch
      </p>
    </div>
  );
};

export default AdminPaymentManagement;
