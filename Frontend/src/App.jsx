import React, { useState, useEffect } from 'react';
import MainPage from './pages/Main'; 
import Login from './pages/Login';      
import Register from './pages/Register'; 
import ChatPage from './pages/ChatPage'; 
import AdminPage from '../src/pages/Admin/AdminPage.jsx';

function App() {
  // 1. Khởi tạo state từ localStorage (nếu có) để tránh bị giật trang khi refresh
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fsa_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [currentPage, setCurrentPage] = useState('home');

  // 2. useEffect để kiểm tra quyền truy cập ngay khi load App
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('chat');
      }
    } else {
      setCurrentPage('home');
    }
  }, [user]);

  const handleGoToLogin = () => setCurrentPage('login');
  const handleGoToRegister = () => setCurrentPage('register');
  const handleGoToHome = () => setCurrentPage('home');

  // Hàm xử lý sau khi Login thành công
  const handleLoginSuccess = (userData) => {
    // Lưu vào localStorage để khi refresh không mất
    localStorage.setItem('fsa_user', JSON.stringify(userData));
    setUser(userData); 

  };

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('fsa_user');
    localStorage.removeItem('fsa_token');
    
    setUser(null);
    setCurrentPage('home');
    console.log("Đã đăng xuất và chuyển về Home");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Trang chủ */}
      {currentPage === 'home' && (
        <MainPage onNavigateToLogin={handleGoToLogin} onNavigateToRegister={handleGoToRegister} />
      )}
      
      {/* Trang Login */}
      {currentPage === 'login' && (
        <Login 
          onBack={handleGoToHome} 
          onNavigateToRegister={handleGoToRegister} 
          onLoginSuccess={handleLoginSuccess} 
        />
      )}

      {/* Trang Đăng ký */}
      {currentPage === 'register' && (
        <Register onBack={handleGoToHome} onNavigateToLogin={handleGoToLogin} />
      )}

      {/* Trang Chat (User thường) */}
      {currentPage === 'chat' && (
        <ChatPage onLogout={handleLogout} />
      )}

      {/* Trang Admin */}
      {currentPage === 'admin' && (
        <AdminPage onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;