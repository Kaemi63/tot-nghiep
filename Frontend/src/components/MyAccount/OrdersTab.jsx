import React from 'react';
import OrderCard from '../OrderHistory/OrderCard.jsx';
import { EmptyState } from '../ShopUI/ShopUI.jsx';

const OrdersTab = ({ orders, loadingOrders, selectedOrder, onSelectOrder, onCloseOrder }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-800">Lịch sử đơn hàng</h3>
          <p className="text-sm text-slate-500">Tất cả đơn hàng đã đặt</p>
        </div>
        <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
          {orders.length} đơn hàng
        </div>
      </div>

      {loadingOrders ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
          Đang tải lịch sử đơn hàng...
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="Chưa có đơn hàng nào"
          desc="Khi bạn đặt hàng, lịch sử đơn hàng sẽ xuất hiện tại đây."
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrder?.id === order.id}
              onSelect={onSelectOrder}
              onClose={onCloseOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
