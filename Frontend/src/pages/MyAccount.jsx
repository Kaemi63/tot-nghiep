import React, { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSubTab, setProfileSubTab] = useState('edit'); 
  const [user, setUser] = useState(null); // Dữ liệu gốc để hiển thị tiêu đề
  const [editData, setEditData] = useState(null); // Dữ liệu tạm thời để gõ trong input
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });

  const tabs = useMemo(() => [
    { id: 'profile', label: 'Thông tin cá nhân' },
    { id: 'address', label: 'Địa chỉ giao hàng' },
    { id: 'orders', label: 'Lịch sử đơn hàng' },
    { id: 'coupons', label: 'Mã giảm giá' },
  ], []);

  const genderMapToView = { 'male': 'Nam', 'female': 'Nữ', 'other': 'Khác' };
  const genderMapToDB = { 'Nam': 'male', 'Nữ': 'female', 'Khác': 'other' };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUser(data);
            // Khởi tạo dữ liệu chỉnh sửa dựa trên dữ liệu gốc
            setEditData({
              ...data,
              gender: genderMapToView[data.gender] || 'Khác'
            });
          }
          if (error) throw error;
        }
      } catch (error) {
        console.error("Lỗi:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          fullname: editData.fullname,
          phone: editData.phone,
          date_of_birth: editData.date_of_birth,
          gender: genderMapToDB[editData.gender] || 'other', 
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      setUser({ ...editData, gender: genderMapToDB[editData.gender] }); 
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Lỗi: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
  e.preventDefault();
  if (passwordData.newPass !== passwordData.confirm) {
    alert('Mật khẩu xác nhận không khớp!');
    return;
  }

  setIsSaving(true);
  try {
    // 1. Gọi API Backend để xác thực mật khẩu cũ và đổi mật khẩu mới
    const response = await fetch('http://localhost:3001/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        currentPassword: passwordData.current,
        newPassword: passwordData.newPass
      }),
    });

    const result = await response.json();

    if (!response.ok) throw new Error(result.error);

    alert('Đổi mật khẩu thành công!');
    setPasswordData({ current: '', newPass: '', confirm: '' });
  } catch (error) {
    alert('Lỗi: ' + error.message);
  } finally {
    setIsSaving(false);
  }
};

  if (loading) return <div className="p-6 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="flex-1 h-full overflow-y-auto p-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200">
            <img src={user?.avatar_url} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Tài khoản của {user?.fullname}</h2>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
          <div className="flex bg-slate-100 border-b border-slate-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'text-indigo-700 bg-white border-b-2 border-indigo-500' : 'text-slate-500 hover:text-indigo-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <div>
                <div className="flex gap-4 mb-8 p-1 bg-slate-100 w-fit rounded-xl">
                  <button onClick={() => setProfileSubTab('edit')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${profileSubTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Chỉnh sửa thông tin</button>
                  <button onClick={() => setProfileSubTab('password')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${profileSubTab === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Đổi mật khẩu</button>
                </div>

                {profileSubTab === 'edit' && (
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-500">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tên đầy đủ</label>
                      <input 
                        value={editData?.fullname || ''} 
                        onChange={(e) => setEditData({...editData, fullname: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                      <input 
                        value={editData?.phone || ''} 
                        onChange={(e) => setEditData({...editData, phone: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Ngày sinh</label>
                      <input 
                        type="date" 
                        value={editData?.date_of_birth || ''} 
                        onChange={(e) => setEditData({...editData, date_of_birth: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Giới tính</label>
                      <select 
                        value={editData?.gender || 'Khác'} 
                        onChange={(e) => setEditData({...editData, gender: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 pt-4">
                      <button type="submit" disabled={isSaving} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all">
                        {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                    </div>
                  </form>
                )}

                {profileSubTab === 'password' && (
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-5 animate-in fade-in duration-500">
                    {/* Ô MẬT KHẨU CŨ - MỚI THÊM */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu hiện tại</label>
                      <input 
                        type="password" 
                        value={passwordData.current} 
                        onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Nhập mật khẩu đang dùng"
                        required 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={passwordData.newPass} 
                        onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Tối thiểu 6 ký tự"
                        required 
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Xác nhận mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={passwordData.confirm} 
                        onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Nhập lại mật khẩu mới"
                        required 
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSaving} 
                        className="w-full sm:w-auto px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
                      >
                        {isSaving ? 'Đang xác thực...' : 'Cập nhật mật khẩu'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
            {activeTab !== 'profile' && <div className="text-center py-10 text-slate-400 italic">Tính năng {activeTab} đang được phát triển...</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;