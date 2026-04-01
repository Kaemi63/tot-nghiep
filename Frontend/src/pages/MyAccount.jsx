import React, { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSubTab, setProfileSubTab] = useState('edit'); // 'edit' hoặc 'password'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });

  // Thu gọn danh sách tab chính
  const tabs = useMemo(() => [
    { id: 'profile', label: 'Thông tin cá nhân' },
    { id: 'address', label: 'Địa chỉ giao hàng' },
    { id: 'orders', label: 'Lịch sử đơn hàng' },
    { id: 'coupons', label: 'Mã giảm giá' },
  ], []);

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

          if (data) setUser(data);
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

  // Hàm cập nhật thông tin cá nhân
const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Chuyển đổi giới tính sang format chuẩn của DB
    const genderMap = {
      'Nam': 'male',
      'Nữ': 'female',
      'Khác': 'other'
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          fullname: user.fullname,
          phone: user.phone,
          date_of_birth: user.date_of_birth, // Sửa từ birthday -> date_of_birth
          gender: genderMap[user.gender] || 'other', // Map giá trị sang tiếng Anh
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      alert('Lỗi lưu dữ liệu: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Hàm đổi mật khẩu sử dụng Supabase Auth
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ 
        password: passwordData.newPass 
      });

      if (error) throw error;
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
          {/* Thanh Tab Chính */}
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
                {/* Thanh Điều Hướng Phụ (Sub-tabs) */}
                <div className="flex gap-4 mb-8 p-1 bg-slate-100 w-fit rounded-xl">
                  <button 
                    onClick={() => setProfileSubTab('edit')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${profileSubTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Chỉnh sửa thông tin
                  </button>
                  <button 
                    onClick={() => setProfileSubTab('password')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${profileSubTab === 'password' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    Đổi mật khẩu
                  </button>
                </div>

                {/* Nội dung 1: Chỉnh sửa thông tin */}
                {profileSubTab === 'edit' && (
                  <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-in fade-in duration-500">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Tên đầy đủ</label>
                      <input 
                        value={user?.fullname || ''} 
                        onChange={(e) => setUser({...user, fullname: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại</label>
                      <input 
                        value={user?.phone || ''} 
                        onChange={(e) => setUser({...user, phone: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Ngày sinh</label>
                      <input 
                      type="date" 
                      value={user?.date_of_birth || ''} 
                      onChange={(e) => setUser({...user, date_of_birth: e.target.value})}
                      className="w-full rounded-xl border border-slate-200 p-3" 
                    />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Giới tính</label>
                      <select 
                        value={user?.gender || 'Nam'} 
                        onChange={(e) => setUser({...user, gender: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3"
                      >
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2 pt-4">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
                      >
                        {isSaving ? 'Đang lưu...' : 'Lưu thông tin'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Nội dung 2: Đổi mật khẩu */}
                {profileSubTab === 'password' && (
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-5 animate-in fade-in duration-500">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">Mật khẩu mới</label>
                      <input 
                        type="password" 
                        value={passwordData.newPass} 
                        onChange={(e) => setPasswordData({...passwordData, newPass: e.target.value})} 
                        className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:ring-2 focus:ring-indigo-500" 
                        placeholder="Nhập tối thiểu 6 ký tự"
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
                        placeholder="Nhập lại mật khẩu trên"
                        required 
                      />
                    </div>
                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 disabled:bg-slate-300 transition-all"
                      >
                        {isSaving ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Các tab khác hiển thị trống hoặc dữ liệu mẫu */}
            {activeTab !== 'profile' && (
              <div className="text-center py-10 text-slate-400 italic">Tính năng {activeTab} đang được phát triển...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;