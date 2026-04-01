import React from 'react';
import toast from 'react-hot-toast'; // 1. Import toast (Toaster đã có ở App.jsx nên không cần ở đây)
import Picture from '../components/Register/Picture';
import RegisterHeader from '../components/Register/RegisterHeader';
import FormRegister from '../components/Register/FormRegister';
import SocialRegister from '../components/Register/SocialRegister';

const Register = ({ onBack, onNavigateToLogin }) => {
  
  const handleRegisterSubmit = async (data) => {
    const loadingToast = toast.loading('Đang khởi tạo tài khoản FSA...');
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), 
      });

      const result = await response.json();
      
      if (response.ok) {
        // THÔNG BÁO THÀNH CÔNG
        toast.success("Đăng ký thành công! Chào mừng bạn đến với FSA.", { 
          id: loadingToast,
          duration: 4000 
        });

        // Đợi 1.5 giây để người dùng đọc thông báo rồi mới chuyển sang Login
        setTimeout(() => {
          onNavigateToLogin();
        }, 1500);

      } else {
        // HIỂN THỊ LỖI CHI TIẾT (Ví dụ: Email đã tồn tại)
        toast.error(result.error || "Đăng ký thất bại", { id: loadingToast });
      }
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ!", { id: loadingToast });
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