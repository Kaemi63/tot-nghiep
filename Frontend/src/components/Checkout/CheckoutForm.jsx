import React from 'react';

const PAYMENT_OPTS = [
  { value: 'COD', label: 'Thanh toán khi nhận hàng', icon: '💵' },
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { value: 'momo', label: 'Ví điện tử Momo', icon: '🍑' },
  { value: 'vnpay', label: 'Cổng thanh toán VNPAY', icon: '💳' },
];

const SHIPPING_OPTS = [
  { value: 'standard', label: 'Tiêu chuẩn (3-5 ngày)', price: 20000, note: '20.000₫' },
  { value: 'express', label: 'Nhanh (1-2 ngày)', price: 35000, note: '35.000₫' },
];

const Field = ({ label, required, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input 
      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-400" 
      required={required} 
      {...props} 
    />
  </div>
);

const CheckoutForm = ({ data, setData, onSubmit }) => {
  
  const handleChange = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Bước 1: Thông tin giao hàng */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-lg">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">1</span>
          Thông tin giao hàng
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Field 
            label="Họ và tên" 
            placeholder="Nguyễn Văn A" 
            required 
            value={data.fullname || ''} 
            onChange={(e) => handleChange('fullname', e.target.value)} 
          />
          <Field 
            label="Số điện thoại" 
            placeholder="090xxxxxxx" 
            required 
            value={data.phone || ''} 
            onChange={(e) => handleChange('phone', e.target.value)} 
          />
        </div>

        <Field 
          label="Địa chỉ Email" 
          type="email" 
          placeholder="name@company.com" 
          required 
          value={data.email || ''} 
          onChange={(e) => handleChange('email', e.target.value)} 
        />

        <Field 
          label="Địa chỉ nhận hàng" 
          placeholder="Số nhà, tên đường, phường/xã..." 
          required 
          value={data.address || ''} 
          onChange={(e) => handleChange('address', e.target.value)} 
        />

        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">
            Ghi chú đơn hàng (Tùy chọn)
          </label>
          <textarea 
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 transition-all min-h-[100px] resize-none" 
            placeholder="Ghi chú về thời gian giao hàng hoặc chỉ dẫn địa chỉ..."
            value={data.note || ''}
            onChange={(e) => handleChange('note', e.target.value)}
          />
        </div>
      </div>

      {/* Bước 2: Phương thức thanh toán */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-lg">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">2</span>
          Phương thức thanh toán
        </h3>
        <div className="grid gap-3">
          {PAYMENT_OPTS.map((opt) => (
            <label 
              key={opt.value} 
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                data.payment === opt.value 
                ? 'border-indigo-500 bg-indigo-50/50' 
                : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
              }`}
            >
              <input 
                type="radio" 
                name="payment" 
                checked={data.payment === opt.value} 
                onChange={() => handleChange('payment', opt.value)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className="text-xl">{opt.icon}</span>
              <span className="text-sm font-bold text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Bước 3: Phương thức vận chuyển */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-800 flex items-center gap-2 text-lg">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-black">3</span>
          Đơn vị vận chuyển
        </h3>
        <div className="grid gap-3">
          {SHIPPING_OPTS.map((opt) => (
            <label 
              key={opt.value} 
              className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                data.shipping === opt.value 
                ? 'border-indigo-500 bg-indigo-50/50' 
                : 'border-slate-100 hover:border-slate-200 bg-slate-50/30'
              }`}
            >
              <div className="flex items-center gap-4">
                <input 
                  type="radio" 
                  name="shipping" 
                  checked={data.shipping === opt.value} 
                  onChange={() => handleChange('shipping', opt.value)} 
                  className="w-4 h-4 accent-indigo-600"
                />
                <span className="text-sm font-bold text-slate-700">{opt.label}</span>
              </div>
              <span className="text-sm font-black text-indigo-600">{opt.note}</span>
            </label>
          ))}
        </div>
      </div>
    </form>
  );
};

export default CheckoutForm;