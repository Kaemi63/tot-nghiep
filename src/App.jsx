import React, { useState } from 'react';
import MainPage from './pages/Main'; // Nhập trang chủ
import Login from './pages/Login';       // Nhập trang đăng nhập

function App() {
  // Mặc định ban đầu là 'home' để hiện MainPage
  const [currentPage, setCurrentPage] = useState('home');

  // Hàm này sẽ được truyền xuống các nút "Đăng nhập" ở trang chủ
  const handleGoToLogin = () => {
    setCurrentPage('login');
  };

  // Hàm này truyền vào nút "Quay lại" ở trang Login
  const handleGoToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Điều kiện hiển thị: Nếu là 'home' thì hiện MainPage, ngược lại hiện Login */}
      {currentPage === 'home' ? (
        <MainPage onNavigateToLogin={handleGoToLogin} />
      ) : (
        <Login onBack={handleGoToHome} />
      )}
    </div>
  );
}

export default App;