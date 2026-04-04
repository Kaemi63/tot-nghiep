import React, { useState } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import OrderCard from './OrderCard';

const OrderHistoryPage = ({ orders = [] }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (orders.length === 0) return <PageShell><EmptyState icon="📦" title="Chưa có đơn hàng nào" desc="Khi bạn đặt hàng, lịch sử đơn hàng sẽ xuất hiện ở đây." /></PageShell>;

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">Lịch sử đơn hàng</h1>
        <p className="text-slate-500 text-sm mt-1">{orders.length} đơn hàng</p>
      </div>
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} isSelected={selectedOrder?.id === order.id} onSelect={setSelectedOrder} onClose={() => setSelectedOrder(null)} />
        ))}
      </div>
    </PageShell>
  );
};

export default OrderHistoryPage;
