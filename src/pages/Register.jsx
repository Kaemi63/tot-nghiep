import React from 'react';
import Picture from '../components/Register/Picture';
import RegisterHeader from '../components/Register/RegisterHeader';
import FormRegister from '../components/Register/FormRegister';
import SocialRegister from '../components/Register/SocialRegister';

const Register = ({ onBack, onNavigateToLogin }) => {
  const handleRegisterSubmit = (data) => {
    console.log("Dữ liệu đăng ký:", data);
  };

  const handleGoogleRegister = () => {
    console.log("Đang xử lý đăng ký Google...");
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      
      {/*Cột bên trái: Hình ảnh */}
      <Picture />

      {/*Form đăng ký */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <RegisterHeader onBack={onBack} />
          <FormRegister onRegister={handleRegisterSubmit} />
          <SocialRegister onGoogleRegister={handleGoogleRegister} onNavigateToLogin={onNavigateToLogin} />
          
        </div>
      </div>
    </div>
  );
};

export default Register;
