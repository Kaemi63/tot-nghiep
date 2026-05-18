import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

const DEFAULT_NOTES = {
  confirmed: 'Đơn hàng đã được xác nhận và đang chờ xử lý.',
  processing: 'Đơn hàng đang được đóng gói và chuẩn bị giao.',
  shipping: 'Đơn hàng đã được bàn giao cho đơn vị vận chuyển.',
  delivered: 'Đơn hàng đã giao thành công đến khách hàng.',
  cancelled: 'Đơn hàng đã bị hủy.',
};

const STATUS_OPTIONS = [
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const OrderStatusChange = ({ order, onClose, onUpdateStatus }) => {
  const initialStatus = order?.order_status || order?.status || 'confirmed';

  const [status, setStatus] = useState(initialStatus);
  const [note, setNote] = useState(DEFAULT_NOTES[initialStatus] || '');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setNote(DEFAULT_NOTES[newStatus] || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order) return;

    setLoading(true);
    try {
      await onUpdateStatus(order.id, status, note);
      onClose();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Thay đổi trạng thái</h2>
            <p className="text-sm text-gray-500 mt-0.5">Mã đơn: {order.order_code}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          {/* Status select */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái mới
            </label>
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              required
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note textarea — tự điền theo status, admin vẫn sửa được */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
              <span className="ml-1 text-xs text-gray-400 font-normal">(tự điền theo trạng thái, có thể chỉnh sửa)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú về thay đổi trạng thái..."
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusChange;
