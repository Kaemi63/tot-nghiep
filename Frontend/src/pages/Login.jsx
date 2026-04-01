import React from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast'; // Thư viện thông báo xịn
import Picture from '../components/Login/Picture';
import LoginHeader from '../components/Login/LoginHeader';
import FormLogin from '../components/Login/FormLogin';
import SocialLogin from '../components/Login/SocialLogin';

const Login = ({ onBack, onNavigateToRegister, onLoginSuccess }) => {
  
  const handleLoginSubmit = async (data) => {
    const loadingToast = toast.loading('Đang kiểm tra thông tin...');
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: data.identifier, 
          password: data.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token
        });

        localStorage.setItem('fsa_user_role', result.user.role);
        localStorage.setItem('fsa_user_name', result.user.fullname);

        // HIỂN THỊ THÔNG BÁO THÀNH CÔNG
        toast.success(`Chào mừng ${result.user.fullname} quay trở lại!`, { 
          id: loadingToast,
          duration: 3000 // Giữ thông báo hiển thị trong 3 giây
        });

        // Đợi 1 khoảng ngắn (ví dụ 800ms) để người dùng kịp thấy thông báo rồi mới chuyển trang
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(result.user);
          }
        }, 800); 

      } else {
        toast.error(result.error || "Đăng nhập thất bại", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Lỗi kết nối Server!", { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      {/* Component hiển thị Toast */}
      <Toaster position="top-center" reverseOrder={false} />
      
      <Picture />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <LoginHeader onBack={onBack} />
          <FormLogin onLogin={handleLoginSubmit} />
          <SocialLogin onNavigateToRegister={onNavigateToRegister} />
        </div>
      </div>
    </div>
  );
};

export default Login;