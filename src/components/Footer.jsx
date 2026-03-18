import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1e1e24] text-slate-200 pt-20 w-full">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between gap-12 md:gap-16">

        {/* Logo Section */}
        <div className="flex-1 max-w-[300px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg relative flex items-center justify-center after:content-[''] after:block after:w-4 after:h-4 after:bg-blue-500 after:rounded"></div>
            <span className="text-xl font-bold tracking-tight text-white">FSA AI</span>
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="flex justify-end flex-wrap gap-12 md:gap-24 ml-auto">
            <a href="/" className="text-[0.95rem] font-semibold text-white mb-6 hover:text-blue-500 cursor-pointer">Giới thiệu</a>
            <a href="/" className="text-[0.95rem] font-semibold text-white mb-6 hover:text-blue-500 cursor-pointer">Điều khoản</a>
            <a href="/" className="text-[0.95rem] font-semibold text-white mb-6 hover:text-blue-500 cursor-pointer">Bảo mật</a>
            <a href="/" className="text-[0.95rem] font-semibold text-white mb-6 hover:text-blue-500 cursor-pointer">Liên hệ</a>
        </div>

      </div>

      <div className="mt-16 border-t border-white/10 py-8">
        <div className="max-w-[1200px] mx-auto px-8 flex justify-center">
          <div className="flex gap-8">
            <h4 className="text-[0.95rem] font-semibold text-white mb-6">© 2026 chatbot platform developed by Ly Tuan Duc and Nguyen Le Anh Toan</h4>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
