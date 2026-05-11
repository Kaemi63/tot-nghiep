import React from 'react';

const AccountHeader = ({ user, selectedAddress }) => {
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-10 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Tài khoản của {user?.fullname}
        </h2>
        <p className="text-slate-500 font-medium">{user?.email}</p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-1">Địa chỉ mặc định</p>
        {selectedAddress ? (
          <div className="text-sm text-slate-700">
            <p className="font-semibold">{selectedAddress.label}</p>
            <p>{selectedAddress.fullname} • {selectedAddress.phone}</p>
            <p>{selectedAddress.address}, {selectedAddress.ward}, {selectedAddress.district}, {selectedAddress.province}</p>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Chưa có địa chỉ giao hàng mặc định</p>
        )}
      </div>
    </div>
  );
};

export default AccountHeader;
