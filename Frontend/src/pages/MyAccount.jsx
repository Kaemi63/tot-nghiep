import React, { useMemo, useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';

// Import các components đã tách
import AccountTabs from '../components/MyAccount/AccountTabs';
import ProfileEditForm from '../components/MyAccount/ProfileEditForm';
import PasswordChangeForm from '../components/MyAccount/PasswordChangeForm';

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileSubTab, setProfileSubTab] = useState('edit'); 
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState(null);
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

  // 1. SỬA useEffect: Vẫn dùng session của supabase để lấy ID, nhưng lấy data bằng Backend
useEffect(() => {
  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }
      
      const response = await fetch(`http://localhost:3001/api/auth/profile/${session.user.id}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          // THÊM DÒNG NÀY: Gửi token để vượt qua Middleware protect
          'Authorization': `Bearer ${session.access_token}` 
        },
      });

      const profile = await response.json();
      if (!response.ok) throw new Error(profile.error);
      
      const mappedProfile = {
        ...profile,
        gender: genderMapToView[profile.gender] || profile.gender
      };

      setUser(mappedProfile);
      setEditData(mappedProfile);
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin tài khoản');
    } finally {
      setLoading(false);
    }
  };
  
  fetchUserData();
}, []);

  // 2. SỬA hàm cập nhật thông tin qua Backend
// 1. Hàm cập nhật thông tin cá nhân
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Kiểm tra nhanh trước khi gửi (Client-side validation)
    if (!editData.fullname.trim()) {
      return toast.error("Họ tên không được để trống");
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Đang lưu thay đổi...');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          id: user.id,
          fullname: editData.fullname,
          phone: editData.phone,
          date_of_birth: editData.date_of_birth,
          gender: genderMapToDB[editData.gender] || editData.gender,
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Lỗi khi cập nhật hồ sơ');
      }
      
      // Thành công
      toast.success('Đã lưu thông tin cá nhân!', { id: loadingToast });
      setUser(editData);
    } catch (err) {
      // Thất bại
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Hàm đổi mật khẩu với đầy đủ các trường hợp báo lỗi
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // --- CÁC TRƯỜNG HỢP KIỂM TRA LỖI (VALIDATION) ---
    
    // Kiểm tra độ dài mật khẩu (VD: ít nhất 6 ký tự theo chuẩn Supabase)
    if (passwordData.newPass.length < 6) {
      return toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (passwordData.newPass !== passwordData.confirm) {
      return toast.error("Mật khẩu xác nhận không khớp với mật khẩu mới");
    }

    // Kiểm tra nếu mật khẩu mới trùng mật khẩu cũ (tùy chọn)
    if (passwordData.current === passwordData.newPass) {
      return toast.error("Mật khẩu mới không được trùng với mật khẩu hiện tại");
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Đang xử lý đổi mật khẩu...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json','Authorization': `Bearer ${session?.access_token}` },
        body: JSON.stringify({
          id: user.id,
          currentPassword: passwordData.current, // Gửi pass cũ để backend kiểm tra nếu cần
          password: passwordData.newPass,
        }),
      });
      
      const result = await response.json();

      if (!response.ok) {
        // Đây là nơi bắt lỗi "Sai mật khẩu hiện tại" từ Backend trả về
        if (result.error?.includes('invalid_credentials') || result.error?.includes('incorrect')) {
           throw new Error("Mật khẩu hiện tại không chính xác");
        }
        throw new Error(result.error || 'Lỗi khi đổi mật khẩu');
      }
      
      // Thành công
      toast.success('Đổi mật khẩu thành công!', { id: loadingToast });
      // Reset form sau khi thành công
      setPasswordData({ current: '', newPass: '', confirm: '' });
      
    } catch (err) {
      // Hiện lỗi cụ thể (Sai mật khẩu, ko đủ ký tự từ server,...)
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-5xl mx-auto"> 
        <div className="flex items-center gap-5 mb-10 animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-slate-200">
            <img 
              src={user?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=FSA'} 
              alt="avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Tài khoản của {user?.fullname}
            </h2>
            <p className="text-slate-500 font-medium">{user?.email}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
          <AccountTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-8 sm:p-10">
            {activeTab === 'profile' && (
              <div className="space-y-8">
                <div className="flex gap-2 p-1.5 bg-slate-100 w-fit rounded-2xl border border-slate-200/50">
                  <button 
                    onClick={() => setProfileSubTab('edit')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${profileSubTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Hồ sơ
                  </button>
                  <button 
                    onClick={() => setProfileSubTab('password')}
                    className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${profileSubTab === 'password' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    Mật khẩu
                  </button>
                </div>

                <div className="mt-10">
                  {profileSubTab === 'edit' ? (
                    <ProfileEditForm 
                      editData={editData} 
                      setEditData={setEditData} 
                      onSubmit={handleUpdateProfile} 
                      isSaving={isSaving} 
                    />
                  ) : (
                    <PasswordChangeForm 
                      passwordData={passwordData} 
                      setPasswordData={setPasswordData} 
                      onSubmit={handlePasswordChange} 
                      isSaving={isSaving} 
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab !== 'profile' && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 text-slate-300 mb-4">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                </div>
                <p className="text-slate-400 font-medium italic">Tính năng {tabs.find(t => t.id === activeTab)?.label} sẽ sớm ra mắt.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;