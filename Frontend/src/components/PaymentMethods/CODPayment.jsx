import React from 'react';
import { PageShell } from '../ShopUI/ShopUI.jsx';

const CODPayment = ({ order, onComplete, onBack }) => {
  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-4xl">✓</span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-800">Đặt hàng thành công!</h1>
            <p className="text-slate-500 text-sm">Thanh toán khi nhận hàng (COD)</p>
          </div>

          {/* Order Info */}
          <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Mã đơn hàng</span>
              <span className="font-black text-indigo-600">#{order?.order_code || 'N/A'}</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Phương thức thanh toán</span>
              <span className="text-sm font-semibold text-slate-700">💵 Thanh toán khi nhận hàng</span>
            </div>

            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-sm font-semibold text-slate-600">Tổng tiền</span>
              <span className="font-black text-lg text-indigo-600">
                {order?.total_amount?.toLocaleString()}₫
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">Trạng thái</span>
              <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                Chờ xác nhận
              </span>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-3">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <span>ℹ️</span> Hướng dẫn thanh toán
            </h3>
            <ul className="text-sm text-blue-800 space-y-2 ml-7 list-disc">
              <li>Bạn sẽ thanh toán trực tiếp cho shipper khi nhận hàng</li>
              <li>Vui lòng chuẩn bị đủ tiền lẻ cho shipper</li>
              <li>Kiểm tra hàng hóa trước khi thanh toán</li>
              <li>Yêu cầu biên lai khi thanh toán</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onBack}
              className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:border-slate-300 transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={onComplete}
              className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-colors"
            >
              Xong
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default CODPayment;
