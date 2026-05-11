import React from 'react';

const AddressCard = ({ address, isSelected, onSelect, onDelete }) => {
  return (
    <div
      className={`rounded-3xl border p-4 ${
        isSelected ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-800">{address.label}</p>
          <p className="text-sm text-slate-600">{address.fullname} • {address.phone}</p>
          <p className="text-sm text-slate-600 leading-6">
            {address.address}, {address.ward}, {address.district}, {address.province}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isSelected && (
            <span className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-white">
              Mặc định
            </span>
          )}
          <button
            onClick={() => onSelect(address.id)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Chọn làm mặc định
          </button>
          <button
            onClick={() => onDelete(address.id)}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
