import React, { useState, useEffect, useMemo } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import PaymentHistoryCard from '../../components/PaymentHistory/PaymentHistoryCard.jsx';
import PaymentHistoryFilters from '../../components/PaymentHistory/PaymentHistoryFilters.jsx';
import PaymentSummaryStats from '../../components/PaymentHistory/PaymentSummaryStats.jsx';
import { usePayments } from '../../hooks/usePayments';

const PaymentHistoryPage = () => {
  const { paymentHistory, processing, paymentError, fetchHistory } = usePayments();
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch lịch sử thanh toán khi mount
  useEffect(() => {
    fetchHistory(false); // false = user mode
  }, [fetchHistory]);

  // Lọc theo trạng thái + tìm kiếm
  const filteredPayments = useMemo(() => {
    let result = paymentHistory;

    // Lọc theo status
    if (activeFilter !== 'all') {
      result = result.filter((p) => p.status === activeFilter);
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm.trim()) {
      const keyword = searchTerm.toLowerCase().trim();
      result = result.filter((p) => {
        const orderCode = p.orders?.order_code?.toLowerCase() || '';
        const transCode = p.transaction_code?.toLowerCase() || '';
        const method = p.payment_method?.toLowerCase() || '';
        return (
          orderCode.includes(keyword) ||
          transCode.includes(keyword) ||
          method.includes(keyword)
        );
      });
    }

    return result;
  }, [paymentHistory, activeFilter, searchTerm]);

  // Loading state
  if (processing && paymentHistory.length === 0) {
    return (
      <PageShell>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mb-4" />
          <p className="text-sm font-bold text-slate-500">Đang tải lịch sử thanh toán...</p>
        </div>
      </PageShell>
    );
  }

  // Error state
  if (paymentError && paymentHistory.length === 0) {
    return (
      <PageShell>
        <EmptyState
          icon="⚠️"
          title="Không thể tải dữ liệu"
          desc={paymentError || 'Đã xảy ra lỗi khi lấy lịch sử thanh toán. Vui lòng thử lại sau.'}
          action={{ label: 'Thử lại', onClick: () => fetchHistory(false) }}
        />
      </PageShell>
    );
  }

  // Empty state
  if (paymentHistory.length === 0) {
    return (
      <PageShell>
        <EmptyState
          icon="💳"
          title="Chưa có giao dịch nào"
          desc="Khi bạn thanh toán đơn hàng, lịch sử giao dịch sẽ xuất hiện tại đây."
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Tiêu đề trang */}
      <div className="mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Lịch sử thanh toán</h1>
            <p className="text-slate-500 text-sm mt-1">
              Theo dõi và quản lý tất cả giao dịch thanh toán của bạn
            </p>
          </div>
          <button
            onClick={() => fetchHistory(false)}
            disabled={processing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all disabled:opacity-50"
          >
            <svg
              className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Làm mới
          </button>
        </div>
      </div>

      {/* Thẻ thống kê tổng quan */}
      <div className="mb-6">
        <PaymentSummaryStats payments={paymentHistory} />
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <div className="mb-6">
        <PaymentHistoryFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          totalCount={filteredPayments.length}
        />
      </div>

      {/* Danh sách giao dịch */}
      {filteredPayments.length > 0 ? (
        <div className="space-y-3">
          {filteredPayments.map((payment) => (
            <PaymentHistoryCard key={payment.id} payment={payment} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4">
            🔍
          </div>
          <p className="text-sm font-bold text-slate-600 mb-1">Không tìm thấy giao dịch</p>
          <p className="text-xs text-slate-400">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchTerm('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </PageShell>
  );
};

export default PaymentHistoryPage;
