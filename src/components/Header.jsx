import React from 'react';

const Header = ({ onLoginClick }) => {
  return (
    <header className="fixed top-0 left-0 w-full py-6 z-[1000] bg-white/80 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-6 md:px-8">
        <div className="flex items-center gap-3 no-underline text-slate-800 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg relative flex items-center justify-center after:content-[''] after:block after:w-4 after:h-4 after:bg-blue-500 after:rounded"></div>
          <span className="text-xl font-bold tracking-tight">FSA AI</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="font-medium text-[0.95rem] text-slate-800 hover:text-blue-500 transition-colors duration-200">Đăng ký</a>
          <button onClick={onLoginClick} className="bg-slate-800 text-white py-2 px-5 rounded-lg font-medium text-[0.95rem] flex items-center gap-2 transition-all duration-200 hover:bg-slate-950 hover:-translate-y-[1px]">
            Đăng nhập
            <span className="text-[1.1em]">↗</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
