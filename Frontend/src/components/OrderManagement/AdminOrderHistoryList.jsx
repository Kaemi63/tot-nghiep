import React, { useState } from 'react';
import { EmptyState } from '../ShopUI/ShopUI.jsx';

const AdminOrderHistoryList = ({ orders = [], onRequestStatusChange }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount || 0);
  };

  const formatDate = (value) => {
    if (!value) return 'Chưa xác định';
    return new Date(value).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status || 'Chưa cập nhật';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipping': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  if (!orders.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm text-center">
        <EmptyState
          icon="📦"
          title="Không có đơn hàng"
          desc="Hiện tại chưa có đơn hàng nào trong hệ thống."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Danh sách đơn hàng</h2>
            <p className="text-slate-500 text-sm mt-1">{orders.length} đơn hàng hiện có</p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Mã đơn</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Khách hàng</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Ngày đặt</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Tổng tiền</th>
              <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {orders.map((order) => {
              const orderStatus = order.order_status || order.status || 'pending';
              const customerName = order.recipient_name || order.user_id || 'Khách';
              const orderTotal = order.total_amount || order.subtotal || 0;
              return (
                <React.Fragment key={order.id}>
                  <tr
                    className="cursor-pointer transition hover:bg-slate-50"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{order.order_code}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{customerName}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(orderStatus)}`}>
                        {statusText(orderStatus)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{formatCurrency(orderTotal)}</td>
                    <td className="px-6 py-4 text-sm text-right text-slate-700">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedOrderId(expandedOrderId === order.id ? null : order.id);
                        }}
                        className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
                      >
                        {expandedOrderId === order.id ? 'Thu gọn' : 'Xem chi tiết'}
                      </button>
                    </td>
                  </tr>

                  {expandedOrderId === order.id && (
                    <tr className="bg-slate-50">
                      <td className="px-6 py-4" colSpan={6}>
                        <div className="space-y-5">
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <h3 className="text-sm font-semibold text-slate-900 mb-2">Thông tin khách hàng</h3>
                              <p className="text-sm text-slate-700">{order.recipient_name || 'Khách hàng'}</p>
                              <p className="text-sm text-slate-700">{order.recipient_phone || 'Không có số'}</p>
                              <p className="text-sm text-slate-700">{order.recipient_email || 'Không có email'}</p>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <h3 className="text-sm font-semibold text-slate-900 mb-2">Địa chỉ giao hàng</h3>
                              <p className="text-sm text-slate-700">{order.shipping_address || '-'}</p>
                              <p className="text-sm text-slate-700">{order.ward || ''} {order.district || ''} {order.province || ''}</p>
                              {order.note && <p className="mt-2 text-sm text-slate-500">Ghi chú: {order.note}</p>}
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-4">
                              <h3 className="text-sm font-semibold text-slate-900 mb-2">Thanh toán</h3>
                              <p className="text-sm text-slate-700">Phương thức: {order.payment_method || 'Chưa rõ'}</p>
                              <p className="text-sm text-slate-700">Tổng: {formatCurrency(orderTotal)}</p>
                              <p className="text-sm text-slate-700">Phí ship: {formatCurrency(order.shipping_fee || 0)}</p>
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <h3 className="text-sm font-semibold text-slate-900 mb-3">Sản phẩm trong đơn</h3>
                            <div className="space-y-3">
                              {order.order_items?.map((item) => (
                                <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">{item.product_name || item.products?.name || 'Sản phẩm'}</p>
                                    <p className="text-xs text-slate-500">Số lượng: {item.quantity}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.total || (item.price * item.quantity))}</p>
                                    <p className="text-xs text-slate-500">{formatCurrency(item.price || item.unit_price)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                              <div>
                                <h3 className="text-sm font-semibold text-slate-900">Lịch sử trạng thái</h3>
                                <p className="text-xs text-slate-500">Các thay đổi trạng thái gần đây nhất</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => onRequestStatusChange?.(order)}
                                className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                              >
                                Thay đổi trạng thái
                              </button>
                            </div>
                            <div className="mt-4 space-y-3">
                              {order.order_status_histories?.length > 0 ? (
                                order.order_status_histories.map((history) => (
                                  <div key={history.id || `${history.status}-${history.created_at}`} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                                    <div className="flex items-center justify-between gap-3">
                                      <span className="text-sm font-semibold text-slate-900">{statusText(history.status)}</span>
                                      <span className="text-xs text-slate-500">{formatDate(history.created_at)}</span>
                                    </div>
                                    {history.note && <p className="mt-1 text-xs text-slate-500">{history.note}</p>}
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-slate-500">Chưa có lịch sử trạng thái.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrderHistoryList;
