import React, { useState } from 'react';
import MainPage from './pages/Main'; 
import Login from './pages/Login';      
import Register from './pages/Register'; 
import ChatPage from './pages/ChatPage'; 
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
  const handleLoginSuccess = () => {
    setCurrentPage('chat');
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

      {currentPage === 'chat' && (
        <ChatPage />
      )}
    </div>
  );
}
export default App;