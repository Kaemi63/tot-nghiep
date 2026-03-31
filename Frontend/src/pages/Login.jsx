import React from 'react';
import Picture from '../components/Login/Picture';
import LoginHeader from '../components/Login/LoginHeader';
import FormLogin from '../components/Login/FormLogin';
import SocialLogin from '../components/Login/SocialLogin';

const Login = ({ onBack, onNavigateToRegister, onLoginSuccess }) => {
  const handleLoginSubmit = async (data) => {
    try {
      // data.identifier lấy từ FormLogin.jsx (có thể là email hoặc username)
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          identifier: data.identifier, 
          password: data.password
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Lưu Access Token vào localStorage để duy trì phiên đăng nhập
        localStorage.setItem('fsa_token', result.session.access_token);
        
        alert("Đăng nhập thành công! Mừng bạn quay lại.");
        
        // Chuyển hướng người dùng vào Dashboard hoặc trang chủ
        if (onLoginSuccess) {
          onLoginSuccess(result.user);
        }
      } else {
        // Hiển thị lỗi từ Backend (ví dụ: "Invalid login credentials")
        alert("Lỗi: " + (result.error || "Sai thông tin đăng nhập"));
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      alert("Không thể kết nối đến Server Backend. Hãy chắc chắn Server đang chạy ở cổng 3001!");
    }
  };

  const handleGoogleLogin = () => {
    console.log("Đang xử lý đăng nhập Google...");
    if (onLoginSuccess) onLoginSuccess();
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/*Cột bên trái: Hình ảnh */}
      <Picture />

      {/*Form đăng nhập */}
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