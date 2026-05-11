import React, { useMemo, useState } from 'react';
import { Toaster } from 'react-hot-toast';

// Hooks
import { useUserProfile } from '../hooks/useMyAccountProfile';
import { usePasswordChange } from '../hooks/useMyAccountPassword';
import { useAddresses } from '../hooks/useMyAccountAddresses';
import { useOrders } from '../hooks/useMyAccountOrders';
import { useCoupons } from '../hooks/useMyAccountCoupons';

// Components
import AccountTabs from '../components/MyAccount/AccountTabs';
import AccountHeader from '../components/MyAccount/AccountHeader';
import ProfileSubTabs from '../components/MyAccount/ProfileSubTabs';
import AddressTab from '../components/MyAccount/AddressTab/AddressTab';
import OrdersTab from '../components/MyAccount/OrdersTab';
import CouponsTab from '../components/MyAccount/CouponsTab/CouponsTab';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSubTab, setProfileSubTab] = useState('edit');

  const {
    user, editData, setEditData,
    loading, isSaving: isSavingProfile,
    handleUpdateProfile,
  } = useUserProfile();

  const {
    passwordData, setPasswordData,
    isSaving: isSavingPassword,
    handlePasswordChange,
  } = usePasswordChange(user);

  const {
    addresses, selectedAddressId, selectedAddress,
    addressForm, handleAddressFormChange,
    handleAddAddress, handleSelectAddress, handleDeleteAddress,
  } = useAddresses(user);

  const { orders, selectedOrder, setSelectedOrder, loadingOrders } = useOrders(user, activeTab);
  const { availableCoupons, usedCoupons, loadingCoupons } = useCoupons(user, activeTab);

  const tabs = useMemo(() => [
    { id: 'profile', label: 'Thông tin cá nhân' },
    { id: 'address', label: 'Địa chỉ giao hàng' },
    { id: 'orders', label: 'Lịch sử đơn hàng' },
    { id: 'coupons', label: 'Mã giảm giá' },
  ], []);

  if (loading) return null;

  return (
    <div className="h-full overflow-y-auto bg-neutral-50 py-12 px-4 sm:px-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-7xl mx-auto">

        <AccountHeader user={user} selectedAddress={selectedAddress} />

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-auto transition-all hover:shadow-md">
          <AccountTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-8 sm:p-10">
            {activeTab === 'profile' && (
              <ProfileSubTabs
                profileSubTab={profileSubTab}
                setProfileSubTab={setProfileSubTab}
                editData={editData}
                setEditData={setEditData}
                onSubmitProfile={handleUpdateProfile}
                isSavingProfile={isSavingProfile}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                onSubmitPassword={handlePasswordChange}
                isSavingPassword={isSavingPassword}
              />
            )}

            {activeTab === 'address' && (
              <AddressTab
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                addressForm={addressForm}
                onAddressFormChange={handleAddressFormChange}
                onAddAddress={handleAddAddress}
                onSelectAddress={handleSelectAddress}
                onDeleteAddress={handleDeleteAddress}
              />
            )}

            {activeTab === 'orders' && (
              <OrdersTab
                orders={orders}
                loadingOrders={loadingOrders}
                selectedOrder={selectedOrder}
                onSelectOrder={setSelectedOrder}
                onCloseOrder={() => setSelectedOrder(null)}
              />
            )}

            {activeTab === 'coupons' && (
              <CouponsTab
                availableCoupons={availableCoupons}
                usedCoupons={usedCoupons}
                loadingCoupons={loadingCoupons}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
