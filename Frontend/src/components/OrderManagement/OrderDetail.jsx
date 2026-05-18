import React from 'react';
import { X, MapPin, Phone, Mail, Calendar, CreditCard } from 'lucide-react';

const OrderDetail = ({ order, onClose }) => {
  if (!order) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipping': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Chi tiết đơn hàng {order.order_code}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin đơn hàng</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Ngày đặt: {formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <CreditCard size={16} className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Thanh toán: {order.payment_method}</span>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-500'}`}>
                    {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </div>
                <div>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="font-medium text-gray-900 mr-2">Tên:</span>
                  <span className="text-gray-600">{order.recipient_name}</span>
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.recipient_phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.recipient_email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ giao hàng */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Địa chỉ giao hàng</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <MapPin size={16} className="text-gray-400 mr-2 mt-1" />
                <div>
                  <p className="text-gray-900">{order.shipping_address}</p>
                  <p className="text-gray-600">{order.ward}, {order.district}, {order.province}</p>
                  {order.note && (
                    <p className="text-gray-600 mt-2"><strong>Ghi chú:</strong> {order.note}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã đặt</h3>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                  <img
                    src={item.products?.thumbnail_url || '/placeholder-image.jpg'}
                    alt={item.products?.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.products?.name}</h4>
                    <p className="text-sm text-gray-600">
                      Size: {item.product_variants?.size || 'N/A'} | Color: {item.product_variants?.color || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(item.unit_price)}</p>
                    <p className="text-sm text-gray-600">Tổng: {formatCurrency(item.unit_price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">Tổng cộng:</span>
              <span className="text-xl font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {/* Lịch sử trạng thái */}
          {order.order_status_histories && order.order_status_histories.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Lịch sử trạng thái</h3>
              <div className="space-y-2">
                {order.order_status_histories.map((history) => (
                  <div key={history.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(history.status)}`}>
                        {getStatusText(history.status)}
                      </span>
                      {history.note && <p className="text-sm text-gray-600 mt-1">{history.note}</p>}
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(history.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;