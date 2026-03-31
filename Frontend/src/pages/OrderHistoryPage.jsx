import React from 'react';

const statusColor = {
  'Chờ xác nhận': 'text-orange-500',
  'Đang xử lý': 'text-blue-500',
  'Đang giao': 'text-indigo-500',
  'Đã giao': 'text-green-500',
  'Đã hủy': 'text-red-500',
};

const OrderHistoryPage = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = React.useState(null);

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h2>
      {orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">Bạn chưa có đơn hàng nào.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <div className="font-semibold">{order.id}</div>
                  <div className="text-sm text-slate-500">Ngày: {order.date}</div>
                </div>
                <div className={`font-semibold ${statusColor[order.status] || 'text-slate-500'}`}>{order.status}</div>
              </div>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-sm text-slate-700">Tổng: {order.total.toLocaleString('vi-VN')}₫</span>
                <button onClick={() => setSelectedOrder(order)} className="rounded-lg bg-indigo-600 px-3 py-1 text-xs text-white">Xem chi tiết</button>
              </div>
            </div>
          ))}
          {selectedOrder && (
            <div className="rounded-xl border border-indigo-200 bg-white p-4 mt-4">
              <h3 className="font-semibold mb-2">Chi tiết đơn hàng {selectedOrder.id}</h3>
              <p className="text-sm text-slate-600">Trạng thái: <span className={statusColor[selectedOrder.status] || 'text-slate-500'}>{selectedOrder.status}</span></p>
              <p className="text-sm text-slate-600">Ngày: {selectedOrder.date}</p>
              <p className="text-sm text-slate-600">Tổng tiền: {selectedOrder.total.toLocaleString('vi-VN')}₫</p>
              <div className="mt-2">
                <p className="text-sm font-semibold mb-1">Sản phẩm:</p>
                <ul className="list-disc list-inside text-sm text-slate-700">
                  {selectedOrder.products.map((item) => (
                    <li key={item.product.id}>{item.product.name} x {item.quantity} ({(item.product.priceRaw*item.quantity).toLocaleString('vi-VN')}₫)</li>
                  ))}
                </ul>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="mt-3 rounded-lg border border-slate-300 px-3 py-1 text-sm">Đóng</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
