import React, { useState } from 'react';
import { PageShell } from '../ShopUI/ShopUI.jsx';
import toast from 'react-hot-toast';

const BankTransferPayment = ({ order, onComplete, onBack }) => {
  const [copied, setCopied] = useState(false);

  const bankInfo = {
    bankName: 'Ngân hàng Techcombank',
    accountName: 'CÔNG TY CỔ PHẦN THỜI TRANG XYZ',
    accountNumber: '1900123456789',
    swiftCode: 'TECHVNVX'
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Đã sao chép!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-slate-800">Chuyển khoản ngân hàng</h1>
            <p className="text-slate-500 text-sm">Mã đơn hàng: <strong>#{order?.order_code || 'N/A'}</strong></p>
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
            <p className="text-sm font-semibold text-slate-600 mb-2">Số tiền cần chuyển khoản</p>
            <p className="text-4xl font-black text-indigo-600">
              {order?.total_amount?.toLocaleString()}₫
            </p>
          </div>

          {/* Bank Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Thông tin tài khoản nhận</h3>

            {[
              { label: 'Tên ngân hàng', value: bankInfo.bankName },
              { label: 'Tên chủ tài khoản', value: bankInfo.accountName },
              { label: 'Số tài khoản', value: bankInfo.accountNumber, copyable: true },
              { label: 'Mã SWIFT', value: bankInfo.swiftCode, copyable: true }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <span className="text-sm font-semibold text-slate-600">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-800">{item.value}</span>
                  {item.copyable && (
                    <button
                      onClick={() => handleCopy(item.value)}
                      className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                      title="Sao chép"
                    >
                      📋
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Content Bank Transfer */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-3">
            <h3 className="font-bold text-blue-900">Nội dung chuyển khoản:</h3>
            <div className="bg-white p-3 rounded-lg font-mono text-sm text-center text-blue-900">
              {order?.order_code || 'THANHTOAN'} - {order?.customer_name || 'Khách hàng'}
            </div>
            <button
              onClick={() => handleCopy(`${order?.order_code || 'THANHTOAN'} - ${order?.customer_name || 'Khách hàng'}`)}
              className="w-full p-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Sao chép nội dung
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200 space-y-3">
            <h3 className="font-bold text-green-900 flex items-center gap-2">
              <span>ℹ️</span> Hướng dẫn thanh toán
            </h3>
            <ul className="text-sm text-green-800 space-y-2 ml-7 list-disc">
              <li>Chuyển khoản vào tài khoản trên với đúng số tiền</li>
              <li>Nhập chính xác nội dung chuyển khoản (để xác nhận đơn hàng)</li>
              <li>Đơn hàng sẽ được xác nhận sau 1-2 giờ từ khi thanh toán</li>
              <li>Lưu ý: Phí chuyển khoản do bạn chịu (nếu có)</li>
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
              Tôi đã chuyển khoản
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default BankTransferPayment;
