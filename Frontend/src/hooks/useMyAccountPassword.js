import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';

export const usePasswordChange = (user) => {
  const [passwordData, setPasswordData] = useState({ current: '', newPass: '', confirm: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPass.length < 6) {
      return toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
    }
    if (passwordData.newPass !== passwordData.confirm) {
      return toast.error('Mật khẩu xác nhận không khớp với mật khẩu mới');
    }
    if (passwordData.current === passwordData.newPass) {
      return toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại');
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Đang xử lý đổi mật khẩu...');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          id: user.id,
          currentPassword: passwordData.current,
          password: passwordData.newPass,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.error?.includes('invalid_credentials') || result.error?.includes('incorrect')) {
          throw new Error('Mật khẩu hiện tại không chính xác');
        }
        throw new Error(result.error || 'Lỗi khi đổi mật khẩu');
      }

      toast.success('Đổi mật khẩu thành công!', { id: loadingToast });
      setPasswordData({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  return { passwordData, setPasswordData, isSaving, handlePasswordChange };
};
