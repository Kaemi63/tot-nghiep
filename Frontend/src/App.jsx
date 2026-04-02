import React, { useState } from 'react';
import MainPage from './pages/Main'; 
import Login from './pages/Login';      
import Register from './pages/Register'; 
import ChatPage from './pages/ChatPage'; 
import UserManagement from '../src/pages/Admin/UserManagement.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  // Thêm state để quản lý thông tin user nếu cần
  const [user, setUser] = useState(null);

  const handleGoToLogin = () => setCurrentPage('login');
  const handleGoToRegister = () => setCurrentPage('register');
  const handleGoToHome = () => setCurrentPage('home');

  // Hàm xử lý sau khi Login thành công
  const handleLoginSuccess = (userData) => {
    setUser(userData); // Lưu thông tin user vào state
    
    // Kiểm tra role để phân luồng
    if (userData && userData.role === 'admin') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('chat');
    }
  };

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    // 1. Xóa dữ liệu local
    localStorage.removeItem('fsa_user');
    localStorage.removeItem('fsa_token');
    
    // 2. Reset state
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

      {/* Trang Quản lý (Admin) */}
      {currentPage === 'admin' && (
        <UserManagement onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;