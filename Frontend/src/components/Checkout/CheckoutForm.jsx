import React from 'react';

const PAYMENT_OPTS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng', icon: '💵' },
  { value: 'bank', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { value: 'e-wallet', label: 'Ví điện tử (Momo, ZaloPay)', icon: '📱' },
];

const SHIPPING_OPTS = [
  { value: 'standard', label: 'Tiêu chuẩn (3-5 ngày)', price: 0, note: 'Miễn phí' },
  { value: 'express', label: 'Nhanh (1-2 ngày)', price: 35000, note: '+35.000₫' },
];

const Field = ({ label, required, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    <input className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors" required={required} {...props} />
  </div>
);

const CheckoutForm = ({ data, setData, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-6">
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">1</span>
        Thông tin giao hàng
      </h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Họ và tên" value={data.fullname} onChange={(e) => setData({ ...data, fullname: e.target.value })} placeholder="Nguyễn Văn A" required />
        <Field label="Số điện thoại" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="0912 345 678" required />
      </div>
      <Field label="Email" type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="email@example.com" required />
      <Field label="Địa chỉ giao hàng" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} placeholder="Số nhà, tên đường, quận, thành phố" required />
      <div>
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Ghi chú</label>
        <textarea value={data.note} onChange={(e) => setData({ ...data, note: e.target.value })} placeholder="Giao giờ hành chính, để trước cửa..." rows={2} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-colors resize-none" />
      </div>
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
      <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">2</span>
        Phương thức thanh toán
      </h3>
      {PAYMENT_OPTS.map((opt) => (
        <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${data.payment === opt.value ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
          <input type="radio" name="payment" value={opt.value} checked={data.payment === opt.value} onChange={(e) => setData({ ...data, payment: e.target.value })} className="accent-indigo-600" />
          <span className="text-lg">{opt.icon}</span>
          <span className="text-sm font-medium text-slate-700">{opt.label}</span>
        </label>
      ))}
    </div>

    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
      <h3 className="font-extrabold text-slate-800 flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center font-black">3</span>
        Phương thức vận chuyển
      </h3>
      {SHIPPING_OPTS.map((opt) => (
        <label key={opt.value} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${data.shipping === opt.value ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
          <div className="flex items-center gap-3">
            <input type="radio" name="shipping" value={opt.value} checked={data.shipping === opt.value} onChange={(e) => setData({ ...data, shipping: e.target.value })} className="accent-indigo-600" />
            <span className="text-sm font-medium text-slate-700">{opt.label}</span>
          </div>
          <span className={`text-sm font-bold ${opt.price === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>{opt.note}</span>
        </label>
      ))}
    </div>

    <button type="submit" className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold text-base hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-200">
      🛒 Đặt hàng ngay
    </button>
  </form>
);

export default CheckoutForm;
