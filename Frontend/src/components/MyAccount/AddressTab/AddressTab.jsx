import React from 'react';
import AddressList from './AddressList';
import AddressForm from './AddressForm';

const AddressTab = ({
  addresses,
  selectedAddressId,
  addressForm,
  onAddressFormChange,
  onAddAddress,
  onSelectAddress,
  onDeleteAddress,
}) => {
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h3 className="text-xl font-black text-slate-800 mb-4">Địa chỉ giao hàng đã lưu</h3>
          <AddressList
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            onSelect={onSelectAddress}
            onDelete={onDeleteAddress}
          />
        </section>

        <AddressForm
          addressForm={addressForm}
          onChange={onAddressFormChange}
          onSubmit={onAddAddress}
        />
      </div>
    </div>
  );
};

export default AddressTab;
