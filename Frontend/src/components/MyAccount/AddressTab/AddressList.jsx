import React from 'react';
import AddressCard from './AddressCard';

const AddressList = ({ addresses, selectedAddressId, onSelect, onDelete }) => {
  if (addresses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        Chưa có địa chỉ nào. Thêm địa chỉ mới để tự động điền khi thanh toán.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          isSelected={selectedAddressId === address.id}
          onSelect={onSelect}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default AddressList;
