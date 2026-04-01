import React, { useMemo, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';

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
  
  useEffect(() => {
    const fetchUserData = async () => {
      const loadDataToast = toast.loading('Đang tải hồ sơ...');
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
            setEditData({ ...data, gender: genderMapToView[data.gender] || 'Khác' });
            toast.dismiss(loadDataToast);
          }
          if (error) throw error;
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu!", { id: loadDataToast });
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const savingToast = toast.loading('Đang đồng bộ thông tin...');

    try {
      const response = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          fullname: editData.fullname,
          phone: editData.phone,
          date_of_birth: editData.date_of_birth,
          gender: genderMapToDB[editData.gender] || 'other'
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      // Cập nhật lại user state để Header (Avatar/Name) thay đổi theo ngay lập tức
      setUser({ ...editData, gender: genderMapToDB[editData.gender] });
      toast.success('Hồ sơ của bạn đã được cập nhật!', { id: savingToast });
    } catch (error) {
      toast.error('Lỗi: ' + error.message, { id: savingToast });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    setIsSaving(true);
    const pwdToast = toast.loading('Đang xác thực bảo mật...');

    try {
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

      toast.success('Mật khẩu đã được thay đổi!', { id: pwdToast });
      setPasswordData({ current: '', newPass: '', confirm: '' });
      setProfileSubTab('edit');
    } catch (error) {
      toast.error(error.message, { id: pwdToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 font-sans">
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