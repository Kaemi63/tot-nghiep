import React, { useState, useEffect } from 'react';

const inputClass = 'w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm';
const selectClass = (disabled) =>
  `w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all ${
    disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : 'bg-white text-slate-700 cursor-pointer'
  }`;

const AddressForm = ({ addressForm, onChange, onSubmit }) => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=3')
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error('Lỗi tải dữ liệu địa chỉ:', err));
  }, []);

  const selectedProvince = locations.find((p) => p.name === addressForm.province);
  const districts = selectedProvince ? selectedProvince.districts : [];
  const selectedDistrict = districts.find((d) => d.name === addressForm.district);
  const wards = selectedDistrict ? selectedDistrict.wards : [];

  const handleProvinceChange = (e) => {
    onChange('province', e.target.value);
    onChange('district', '');
    onChange('ward', '');
  };

  const handleDistrictChange = (e) => {
    onChange('district', e.target.value);
    onChange('ward', '');
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-800 mb-4">Thêm địa chỉ mới</h3>
      <form onSubmit={onSubmit} className="space-y-4">

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-600">
            <span>Tên địa chỉ</span>
            <input
              value={addressForm.label}
              onChange={(e) => onChange('label', e.target.value)}
              className={inputClass}
              placeholder="Ví dụ: Nhà riêng, Công ty"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Người nhận</span>
            <input
              value={addressForm.fullname}
              onChange={(e) => onChange('fullname', e.target.value)}
              className={inputClass}
              placeholder="Nguyễn Văn A"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-600">
            <span>Số điện thoại</span>
            <input
              value={addressForm.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              className={inputClass}
              placeholder="0901234567"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-600">
            <span>Địa chỉ email</span>
            <input
              value={addressForm.email}
              onChange={(e) => onChange('email', e.target.value)}
              className={inputClass}
              placeholder="you@example.com"
            />
          </label>
        </div>

        {/* Dropdown Tỉnh / Huyện / Xã */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="space-y-2 text-sm text-slate-600">
            <span>Tỉnh / Thành phố</span>
            <select
              value={addressForm.province || ''}
              onChange={handleProvinceChange}
              className={selectClass(false)}
            >
              <option value="" disabled hidden>Chọn Tỉnh/Thành</option>
              {locations.map((p) => (
                <option key={p.code} value={p.name}>{p.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-600">
            <span>Quận / Huyện</span>
            <select
              value={addressForm.district || ''}
              onChange={handleDistrictChange}
              disabled={!addressForm.province}
              className={selectClass(!addressForm.province)}
            >
              <option value="" disabled hidden>Chọn Quận/Huyện</option>
              {districts.map((d) => (
                <option key={d.code} value={d.name}>{d.name}</option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-slate-600">
            <span>Phường / Xã</span>
            <select
              value={addressForm.ward || ''}
              onChange={(e) => onChange('ward', e.target.value)}
              disabled={!addressForm.district}
              className={selectClass(!addressForm.district)}
            >
              <option value="" disabled hidden>Chọn Phường/Xã</option>
              {wards.map((w) => (
                <option key={w.code} value={w.name}>{w.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Địa chỉ chi tiết</span>
          <input
            value={addressForm.address}
            onChange={(e) => onChange('address', e.target.value)}
            className={inputClass}
            placeholder="Số nhà, đường, tòa nhà..."
          />
        </label>

        <label className="space-y-2 text-sm text-slate-600">
          <span>Ghi chú (tùy chọn)</span>
          <textarea
            value={addressForm.note}
            onChange={(e) => onChange('note', e.target.value)}
            className="w-full rounded-2xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 text-sm"
            placeholder="Ví dụ: Gõ chuông số 5"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition-all"
        >
          Lưu địa chỉ
        </button>
      </form>
    </section>
  );
};

export default AddressForm;
