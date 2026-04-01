import React, { useState } from 'react';
import MainPage from './pages/Main'; 
import Login from './pages/Login';      
import Register from './pages/Register'; 
import ChatPage from './pages/ChatPage'; 
import UserManagement from './pages/admin/UserManagement'; // Đảm bảo đã import trang Admin

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleGoToLogin = () => setCurrentPage('login');
  const handleGoToRegister = () => setCurrentPage('register');
  const handleGoToHome = () => setCurrentPage('home');

  // SỬA LẠI HÀM NÀY:
  const handleLoginSuccess = (user) => {
    // 1. Kiểm tra role của user trả về từ Backend
    if (user && user.role === 'admin') {
      setCurrentPage('admin'); // Chuyển đến trang admin
    } else {
      setCurrentPage('chat');  // Chuyển đến trang chat cho user thường
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {currentPage === 'home' && (
        <MainPage onNavigateToLogin={handleGoToLogin} onNavigateToRegister={handleGoToRegister} />
      )}
      
      {currentPage === 'login' && (
        <Login 
          onBack={handleGoToHome} 
          onNavigateToRegister={handleGoToRegister} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {currentPage === 'register' && (
        <Register onBack={handleGoToHome} onNavigateToLogin={handleGoToLogin} />
      )}

      {/* Trang Chat của User */}
      {currentPage === 'chat' && (
        <ChatPage />
      )}

      {/* THÊM ĐIỀU KIỆN NÀY ĐỂ HIỂN THỊ TRANG ADMIN */}
      {currentPage === 'admin' && (
        <UserManagement />
      )}
    </div>
  );
}

export default App;