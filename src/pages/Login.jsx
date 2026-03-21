import React from 'react';
import Picture from '../components/Login/Picture';
import LoginHeader from '../components/Login/LoginHeader';
import FormLogin from '../components/Login/FormLogin';
import SocialLogin from '../components/Login/SocialLogin';

const Login = ({ onBack, onNavigateToRegister, onLoginSuccess }) => {
  const handleLoginSubmit = (data) => {
    console.log("Dữ liệu đăng nhập:", data);
    if (onLoginSuccess) {
      onLoginSuccess();
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