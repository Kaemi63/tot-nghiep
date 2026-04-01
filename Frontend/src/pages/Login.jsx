import React from 'react';
import { supabase } from '../lib/supabaseClient';
import Picture from '../components/Login/Picture';
import LoginHeader from '../components/Login/LoginHeader';
import FormLogin from '../components/Login/FormLogin';
import SocialLogin from '../components/Login/SocialLogin';

const Login = ({ onBack, onNavigateToRegister, onLoginSuccess }) => {
  
  const handleLoginSubmit = async (data) => {
    try {
      // 1. Gọi API Login ở Backend
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
      // 1. Thiết lập session cho Supabase Client ở Frontend
      await supabase.auth.setSession({
        access_token: result.session.access_token,
        refresh_token: result.session.refresh_token
      });

      // 2. TRUY VẤN ROLE TRỰC TIẾP TỪ SUPABASE (Bỏ qua Backend)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', result.user.id)
        .single();

      if (profileError) {
        console.error("Lỗi lấy role:", profileError);
      }

      const userWithRole = { ...result.user, role: profile?.role || 'user' };

        if (result.user && result.user.role) {
        localStorage.setItem('fsa_user_role', result.user.role);
        localStorage.setItem('fsa_user_name', result.user.fullname);
        }

        alert(`Chào mừng ${result.user.fullname || 'bạn'} quay trở lại!`);
        // Chuyển hướng hoặc thực hiện logic sau login
        if (onLoginSuccess) {
        onLoginSuccess(userWithRole); // Truyền object đã có role sang App.jsx
        }
      } else {
        alert("Lỗi: " + (result.error || "Sai thông tin đăng nhập"));
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối đến Server Backend!");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Đang xử lý đăng nhập Google...");
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      <Picture />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <LoginHeader onBack={onBack} />
          <FormLogin onLogin={handleLoginSubmit} />
          <SocialLogin onGoogleLogin={handleGoogleLogin} onNavigateToRegister={onNavigateToRegister} />
        </div>
      </div>
    </div>
  );
};

export default Login;