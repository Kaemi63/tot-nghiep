import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import AdminShell from '../../components/Admin/AdminShell';
import AdminOrderHistoryList from '../../components/OrderManagement/AdminOrderHistoryList';
import OrderFilterBar from '../../components/OrderManagement/OrderFilterBar';
import OrderStatusChange from '../../components/OrderManagement/OrderStatusChange';
import { orderService } from '../../services/orderService';
import { useAuthProfile } from '../../hooks/useAuthProfile';
import toast from 'react-hot-toast';

const AdminOrderManagement = () => {
  const { token, loading: authLoading } = useAuthProfile();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchOrders = React.useCallback(async () => {
    if (!token) {
      console.log('AdminOrderManagement: Chưa có token, bỏ qua fetch');
      return;
    }

    console.log('AdminOrderManagement: Đang gọi API getAllOrders...');
    setLoading(true);
    try {
      const data = await orderService.getAllOrders(token);
      console.log('AdminOrderManagement: Lấy thành công', data?.length, 'đơn hàng');
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Nếu auth đang load thì chờ
    if (authLoading) {
      setLoading(true);
      return;
    }

    // Nếu đã load xong auth mà có token thì fetch, ngược lại tắt loading
    if (token) {
      fetchOrders();
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [token, authLoading, fetchOrders]);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
  };

  const handleChangeStatus = (order) => {
    setSelectedOrder(order);
    setShowStatusChange(true);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  const handleUpdateStatus = async (orderId, status, note) => {
    try {
      await orderService.updateOrderStatus(token, orderId, status, note);
      toast.success('Cập nhật trạng thái thành công');
      await fetchOrders(); // Refresh danh sách
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
      throw error;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const statusValue = order.order_status || order.status || '';
      const matchesStatus = statusFilter === 'all' || statusValue === statusFilter;
      const matchesSearch = normalizedSearch === '' || [
        order.order_code,
        order.recipient_name,
        order.recipient_phone,
        order.recipient_email,
        order.user_id,
      ]
        .filter(Boolean)
        .some((field) => field.toString().toLowerCase().includes(normalizedSearch));

      return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  const handleCloseStatusChange = () => {
    setShowStatusChange(false);
    setSelectedOrder(null);
  };

  return (
    <AdminShell
      title="Quản lý đơn hàng"
      subtitle="Xem và quản lý tất cả đơn hàng của khách hàng."
      actions={(
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      )}
    >
      <div className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Đang tải...</span>
          </div>
        ) : (
          <>
            <OrderFilterBar
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onSearchChange={handleSearchChange}
              onStatusChange={handleStatusFilterChange}
              onReset={handleResetFilters}
            />

            <AdminOrderHistoryList
              orders={filteredOrders}
              onSelectOrder={handleSelectOrder}
              selectedOrder={selectedOrder}
              onCloseOrder={() => setSelectedOrder(null)}
              onRequestStatusChange={handleChangeStatus}
            />
          </>
        )}
      </div>

      {showStatusChange && (
        <OrderStatusChange
          order={selectedOrder}
          onClose={handleCloseStatusChange}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </AdminShell>
  );
};

export default AdminOrderManagement;