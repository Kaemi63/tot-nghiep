import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addressService } from '../services/addressService';

const defaultAddressForm = {
  label: 'Nhà riêng',
  fullname: '',
  phone: '',
  email: '',
  province: '',
  district: '',
  ward: '',
  address: '',
  note: '',
};

export const useAddresses = (user) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(defaultAddressForm);

  const loadAddresses = (profileId) => {
    const saved = addressService.getAddresses(profileId);
    setAddresses(saved);
    setSelectedAddressId(addressService.getDefaultAddressId(profileId));
  };

  useEffect(() => {
    if (user?.id) {
      loadAddresses(user.id);
      setAddressForm((prev) => ({
        ...prev,
        fullname: user.fullname || prev.fullname,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user?.id]);

  const handleAddressFormChange = (field, value) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();

    if (!addressForm.fullname || !addressForm.phone || !addressForm.address || !addressForm.province || !addressForm.district || !addressForm.ward) {
      return toast.error('Vui lòng điền đầy đủ thông tin địa chỉ giao hàng');
    }

    const nextAddresses = addressService.addAddress(user.id, addressForm);
    setAddresses(nextAddresses);
    setSelectedAddressId(addressService.getDefaultAddressId(user.id));
    setAddressForm({
      ...defaultAddressForm,
      fullname: user.fullname || '',
      phone: user.phone || '',
      email: user.email || '',
    });
    toast.success('Đã lưu địa chỉ giao hàng.');
  };

  const handleSelectAddress = (addressId) => {
    addressService.setDefaultAddress(user.id, addressId);
    setSelectedAddressId(addressId);
    toast.success('Đã chọn địa chỉ này làm mặc định.');
  };

  const handleDeleteAddress = (addressId) => {
    const nextAddress = addressService.deleteAddress(user.id, addressId);
    setAddresses(nextAddress);
    setSelectedAddressId(addressService.getDefaultAddressId(user.id));
    toast.success('Đã xóa địa chỉ');
  };

  const selectedAddress = addresses.find((item) => item.id === selectedAddressId);

  return {
    addresses,
    selectedAddressId,
    selectedAddress,
    addressForm,
    handleAddressFormChange,
    handleAddAddress,
    handleSelectAddress,
    handleDeleteAddress,
  };
};
