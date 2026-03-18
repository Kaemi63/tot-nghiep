import React, { useState } from 'react';
import MainPage from './pages/Main'; // Nhập trang chủ
import Login from './pages/Login';       // Nhập trang đăng nhập
import Register from './pages/Register'; // Nhập trang đăng ký

function App() {
  // Mặc định ban đầu là 'home' để hiện MainPage
  const [currentPage, setCurrentPage] = useState('home');

  // Hàm này sẽ được truyền xuống các nút "Đăng nhập" ở trang chủ
  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  // Hàm đi tới trang đăng ký
  const handleGoToRegister = () => {
    setCurrentPage('register');
  };

  // Hàm này truyền vào nút "Quay lại" ở trang Login/Register
  const handleGoToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Điều kiện hiển thị các trang */}
      {currentPage === 'home' ? (
        <MainPage onNavigateToLogin={handleGoToLogin} onNavigateToRegister={handleGoToRegister} />
      ) : currentPage === 'login' ? (
        <Login onBack={handleGoToHome} onNavigateToRegister={handleGoToRegister} />
      ) : (
        <Register onBack={handleGoToHome} onNavigateToLogin={handleGoToLogin} />
      )}
    </div>
  );
}

export default App;