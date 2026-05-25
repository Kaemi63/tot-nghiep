import React from 'react';
import { PageShell } from '../ShopUI/ShopUI.jsx';
import toast from 'react-hot-toast';

const VNPayPayment = ({ order, onComplete, onBack }) => {
  const handleVNPayRedirect = () => {
    // Khi tích hợp VNPAY API, sẽ redirect sang payment gateway
    // Hiện tại chỉ demo:
    // window.location.href = `https://sandbox.vnpayment.vn/paygate?...`;
    toast.success('Chuyển hướng đến VNPay...');
    setTimeout(onComplete, 2000);
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          {/* VNPay Icon & Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto">
              <span className="text-5xl">💳</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800">Thanh toán VNPAY</h1>
            <p className="text-slate-500 text-sm">Mã đơn hàng: <strong>#{order?.order_code || 'N/A'}</strong></p>
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200">
            <p className="text-sm font-semibold text-slate-600 mb-2">Số tiền thanh toán</p>
            <p className="text-4xl font-black text-blue-600">
              {order?.total_amount?.toLocaleString()}₫
            </p>
          </div>

          {/* Supported Methods */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Phương thức thanh toán được hỗ trợ</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '🏦', label: 'Thẻ ghi nợ/tín dụng' },
                { icon: '📱', label: 'Ví điện tử' },
                { icon: '🏧', label: 'Internet Banking' },
                { icon: '📲', label: 'Mobile Banking' }
              ].map((method, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl text-center">
                  <p className="text-2xl mb-2">{method.icon}</p>
                  <p className="text-xs font-semibold text-slate-700">{method.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-green-50 rounded-2xl p-6 border border-green-200 space-y-3">
            <h3 className="font-bold text-green-900 flex items-center gap-2">
              <span>🔒</span> An toàn & Bảo mật
            </h3>
            <ul className="text-sm text-green-800 space-y-2 ml-7 list-disc">
              <li>Sử dụng công nghệ mã hóa SSL 3D-Secure</li>
              <li>Thông tin thẻ được bảo mật tuyệt đối</li>
              <li>Được hỗ trợ bởi VNPAY - Công ty thanh toán hàng đầu Việt Nam</li>
              <li>Thanh toán nhanh, an toàn, dễ dàng</li>
            </ul>
          </div>

          {/* Payment Steps */}
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 space-y-3">
            <h3 className="font-bold text-blue-900 flex items-center gap-2">
              <span>ℹ️</span> Hướng dẫn thanh toán
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 ml-7 list-decimal">
              <li>Bấm nút "Thanh toán qua VNPAY"</li>
              <li>Nhập thông tin thẻ hoặc chọn phương thức thanh toán khác</li>
              <li>Nhập OTP hoặc mật khẩu xác nhận</li>
              <li>Đợi xác nhận thanh toán (vài giây)</li>
              <li>Quay lại để xem trạng thái đơn hàng</li>
            </ol>
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
              onClick={handleVNPayRedirect}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              Thanh toán qua VNPAY
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default VNPayPayment;
