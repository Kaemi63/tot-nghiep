import React, { useMemo, useState } from 'react';

const defaultUser = {
  name: 'Trần Văn A',
  email: 'tranvana@example.com',
  phone: '0912345678',
  birthday: '1990-01-15',
  gender: 'Nam',
  tier: 'Free Account',
};

const initialAddresses = [
  { id: 1, label: 'Nhà riêng', address: '123 Lê Lợi, Quận 1, TP.HCM', city: 'TP.HCM', phone: '0912345678' },
  { id: 2, label: 'Văn phòng', address: '456 Nguyễn Huệ, Quận 1, TP.HCM', city: 'TP.HCM', phone: '0987654321' },
];

const sampleOrders = [
  { id: 'ORD-1001', date: '2024-03-22', status: 'Hoàn thành', total: 1529000 },
  { id: 'ORD-1102', date: '2024-02-14', status: 'Đang giao', total: 418000 },
  { id: 'ORD-1150', date: '2024-01-09', status: 'Đã hủy', total: 995000 },
];

const sampleWishlist = [
  { id: 1, title: 'Áo khoác bomber basic', price: 890000 },
  { id: 2, title: 'Giày sneaker street', price: 1250000 },
];

const sampleCoupons = [
  { code: 'COOL10', discount: '10%', expires: '2024-06-30' },
  { code: 'FREESHIP', discount: 'Miễn phí vận chuyển', expires: '2024-05-31' },
];

const MyAccount = () => {
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Thông tin cá nhân' },
    { id: 'address', label: 'Địa chỉ giao hàng' },
    { id: 'orders', label: 'Lịch sử đơn hàng' },
    { id: 'wishlist', label: 'Sản phẩm yêu thích' },
    { id: 'password', label: 'Đổi mật khẩu' },
    { id: 'coupons', label: 'Mã giảm giá của tôi' },
  ], []);

  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(defaultUser);
  const [addresses, setAddresses] = useState(initialAddresses);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', city: '', phone: '' });
  const [orderHistory] = useState(sampleOrders);
  const [wishlist, setWishlist] = useState(sampleWishlist);
  const [coupons] = useState(sampleCoupons);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert('Thông tin cá nhân đã được cập nhật.');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) return;
    setAddresses((prev) => [...prev, { id: Date.now(), ...newAddress }]);
    setNewAddress({ label: '', address: '', city: '', phone: '' });
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      alert('Mật khẩu mới và xác nhận không khớp.');
      return;
    }
    alert('Mật khẩu đã được cập nhật thành công.');
    setPasswordData({ current: '', newPass: '', confirm: '' });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Hồ sơ của {user.name}</h2>
              <p className="text-sm text-slate-500">Email: {user.email} · Điện thoại: {user.phone}</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">{user.tier}</span>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex flex-wrap bg-slate-100 border-b border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium ${activeTab === tab.id ? 'text-indigo-700 bg-white border-b-2 border-indigo-500' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tên đầy đủ</label>
                  <input value={user.name} onChange={(e) => setUser((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                  <input type="email" value={user.email} onChange={(e) => setUser((prev) => ({ ...prev, email: e.target.value }))} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input value={user.phone} onChange={(e) => setUser((prev) => ({ ...prev, phone: e.target.value }))} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày sinh</label>
                  <input type="date" value={user.birthday} onChange={(e) => setUser((prev) => ({ ...prev, birthday: e.target.value }))} className="w-full rounded-lg border p-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Giới tính</label>
                  <select value={user.gender} onChange={(e) => setUser((prev) => ({ ...prev, gender: e.target.value }))} className="w-full rounded-lg border p-2">
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">Lưu thay đổi</button>
                </div>
              </form>
            )}

            {activeTab === 'address' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border rounded-lg bg-slate-50">
                      <div className="flex justify-between">
                        <h4 className="font-semibold">{addr.label}</h4>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 text-xs">Xóa</button>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">{addr.address}, {addr.city}</p>
                      <p className="text-sm text-slate-600">{addr.phone}</p>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input placeholder="Nhãn địa chỉ" value={newAddress.label} onChange={(e) => setNewAddress((p) => ({ ...p, label: e.target.value }))} className="rounded-lg border p-2" />
                  <input placeholder="Địa chỉ cụ thể" value={newAddress.address} onChange={(e) => setNewAddress((p) => ({ ...p, address: e.target.value }))} className="rounded-lg border p-2" />
                  <input placeholder="Thành phố" value={newAddress.city} onChange={(e) => setNewAddress((p) => ({ ...p, city: e.target.value }))} className="rounded-lg border p-2" />
                  <input placeholder="Số điện thoại" value={newAddress.phone} onChange={(e) => setNewAddress((p) => ({ ...p, phone: e.target.value }))} className="rounded-lg border p-2" />
                  <button type="submit" className="sm:col-span-2 px-4 py-2 rounded-lg bg-emerald-600 text-white">Thêm địa chỉ mới</button>
                </form>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-2">Mã đơn</th>
                      <th className="p-2">Ngày</th>
                      <th className="p-2">Tổng</th>
                      <th className="p-2">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order) => (
                      <tr key={order.id} className="border-t">
                        <td className="p-2 font-semibold">{order.id}</td>
                        <td className="p-2">{order.date}</td>
                        <td className="p-2">{order.total.toLocaleString('vi-VN')}₫</td>
                        <td className="p-2">{order.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-white flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-slate-500">{item.price.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <button onClick={() => setWishlist((prev) => prev.filter((p) => p.id !== item.id))} className="text-red-500 text-sm">Xóa</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'password' && (
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Mật khẩu hiện tại</label>
                  <input type="password" value={passwordData.current} onChange={(e) => setPasswordData((prev) => ({ ...prev, current: e.target.value }))} className="w-full rounded-lg border p-2" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Mật khẩu mới</label>
                  <input type="password" value={passwordData.newPass} onChange={(e) => setPasswordData((prev) => ({ ...prev, newPass: e.target.value }))} className="w-full rounded-lg border p-2" required minLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700">Xác nhận mật khẩu</label>
                  <input type="password" value={passwordData.confirm} onChange={(e) => setPasswordData((prev) => ({ ...prev, confirm: e.target.value }))} className="w-full rounded-lg border p-2" required minLength={6} />
                </div>
                <button type="submit" className="px-5 py-2 rounded-lg bg-indigo-600 text-white">Cập nhật mật khẩu</button>
              </form>
            )}

            {activeTab === 'coupons' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {coupons.map((coupon) => (
                  <div key={coupon.code} className="p-4 border rounded-lg bg-emerald-50">
                    <div className="font-semibold text-slate-800">{coupon.code}</div>
                    <div className="text-sm text-slate-600">{coupon.discount}</div>
                    <div className="text-xs text-slate-500">HSD: {coupon.expires}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
