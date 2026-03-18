import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <div className="logo-icon"></div>
          <span className="logo-text">ChatBot</span>
        </div>
        
        <div className="header-actions">
          <a href="#" className="nav-link">Đăng ký</a>
          <button className="login-btn">
            Đăng nhập
            <span className="arrow-icon">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
