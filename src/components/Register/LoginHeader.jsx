import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LoginHeader = ({ onBack }) => {
  return (
    <div className="flex flex-col space-y-2">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black transition-colors w-fit mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> Quay lại
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#1e293b]">Mừng bạn quay lại</h2>
      <p className="text-neutral-500 text-sm font-light">
        Vui lòng nhập thông tin để truy cập tủ đồ AI của bạn.
      </p>
    </div>
  );
};

export default LoginHeader;