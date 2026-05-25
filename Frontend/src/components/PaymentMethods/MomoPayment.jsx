import React from 'react';
import { PageShell } from '../ShopUI/ShopUI.jsx';
import toast from 'react-hot-toast';

const MomoPayment = ({ order, onComplete, onBack }) => {
  const handleMomoRedirect = () => {
    // Khi tích hợp MoMo API, sẽ redirect sang payment gateway
    // Hiện tại chỉ demo: 
    // window.location.href = `https://payment.momo.vn/...`;
    toast.success('Chuyển hướng đến MoMo...');
    setTimeout(onComplete, 2000);
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-6">
          {/* Momo Icon & Header */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-pink-400 flex items-center justify-center mx-auto">
              <span className="text-5xl">🍑</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800">Thanh toán qua MoMo</h1>
            <p className="text-slate-500 text-sm">Mã đơn hàng: <strong>#{order?.order_code || 'N/A'}</strong></p>
          </div>

          {/* Amount Section */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-200">
            <p className="text-sm font-semibold text-slate-600 mb-2">Số tiền thanh toán</p>
            <p className="text-4xl font-black text-pink-600">
              {order?.total_amount?.toLocaleString()}₫
            </p>
          </div>

          {/* Payment Steps */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Các bước thanh toán</h3>

            {[
              { step: 1, title: 'Bấm nút "Thanh toán qua MoMo"', desc: 'Hệ thống sẽ chuyển hướng đến trang thanh toán MoMo' },
              { step: 2, title: 'Nhập thông tin tài khoản', desc: 'Đăng nhập hoặc nhập OTP trên ứng dụng MoMo' },
              { step: 3, title: 'Xác nhận thanh toán', desc: 'Kiểm tra số tiền và bấm xác nhận' },
              { step: 4, title: 'Hoàn tất', desc: 'Quay lại để xem trạng thái đơn hàng' }
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="font-bold text-indigo-600">{item.step}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 space-y-3">
            <h3 className="font-bold text-amber-900 flex items-center gap-2">
              <span>⚠️</span> Lưu ý
            </h3>
            <ul className="text-sm text-amber-800 space-y-2 ml-7 list-disc">
              <li>Bạn cần có ứng dụng MoMo hoặc tài khoản MoMo trên web</li>
              <li>Thanh toán sẽ được xử lý ngay sau khi xác nhận</li>
              <li>Không cập nhật lại trang khi thanh toán đang xử lý</li>
              <li>Nếu gặp lỗi, vui lòng liên hệ hỗ trợ</li>
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
              onClick={handleMomoRedirect}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-red-600 text-white font-bold hover:from-pink-700 hover:to-red-700 transition-all"
            >
              Thanh toán qua MoMo
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default MomoPayment;
