import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

const genderMapToView = { male: 'Nam', female: 'Nữ', other: 'Khác' };
const genderMapToDB = { Nam: 'male', Nữ: 'female', Khác: 'other' };

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return null;
      }

      const response = await fetch(`http://localhost:3001/api/auth/profile/${session.user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const profile = await response.json();
      if (!response.ok) throw new Error(profile.error);

      const mappedProfile = {
        ...profile,
        gender: genderMapToView[profile.gender] || profile.gender,
      };

      setUser(mappedProfile);
      setEditData(mappedProfile);
      return { session, mappedProfile };
    } catch (error) {
      console.error(error);
      toast.error('Lỗi khi tải thông tin tài khoản');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!editData.fullname?.trim()) {
      return toast.error('Họ tên không được để trống');
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Đang lưu thay đổi...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          id: user.id,
          fullname: editData.fullname,
          phone: editData.phone,
          date_of_birth: editData.date_of_birth,
          gender: genderMapToDB[editData.gender] || editData.gender,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Lỗi khi cập nhật hồ sơ');

      toast.success('Đã lưu thông tin cá nhân!', { id: loadingToast });
      setUser((prev) => ({ ...prev, ...editData }));
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    setUser,
    editData,
    setEditData,
    loading,
    isSaving,
    handleUpdateProfile,
    fetchUserData,
  };
};
