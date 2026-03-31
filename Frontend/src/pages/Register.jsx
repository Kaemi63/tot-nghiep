import React from 'react';
import Picture from '../components/Register/Picture';
import RegisterHeader from '../components/Register/RegisterHeader';
import FormRegister from '../components/Register/FormRegister';
import SocialRegister from '../components/Register/SocialRegister';

const Register = ({ onBack, onNavigateToLogin }) => {
  
  // HÀM ĐĂNG KÝ (Chỉ giữ lại một bản duy nhất và có async/await)
  const handleRegisterSubmit = async (data) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data), // Gửi { email, username, password }
    });

    const result = await response.json();
    if (response.ok) {
      alert("Đăng ký thành công! Chào mừng bạn đến với FSA.");
      onNavigateToLogin();
    } else {
      alert("Lỗi: " + result.error);
    }
  } catch (err) {
    alert("Không thể kết nối đến Server Backend!");
  }
};

  const handleGoogleRegister = () => {
    console.log("Đang xử lý đăng ký Google...");
  };

  return (
    <div className="min-h-screen w-full flex bg-neutral-50 font-sans selection:bg-neutral-900 selection:text-white">
      <Picture />

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