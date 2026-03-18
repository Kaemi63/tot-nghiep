import React from 'react';
import { Sparkles } from 'lucide-react';

const Picture = () => {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 items-center justify-center p-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
          alt="FSA AI Register Background" 
          className="w-full h-full object-cover opacity-60 transition-transform duration-[20s] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent"></div>
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-lg space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 text-white text-sm">
          <Sparkles className="h-4 w-4 text-neutral-300" />
          <span className="font-medium tracking-widest uppercase text-[10px]">FSA AI</span>
        </div>
        <h1 className="text-6xl font-bold text-white tracking-tighter leading-tight">
          Bắt đầu <br />
          <span className="text-neutral-400 italic font-light">hành trình</span>
        </h1>
        <p className="text-neutral-300 text-lg font-light leading-relaxed max-w-md">
          Đăng ký ngay để khám phá những bộ outfit được AI gợi ý riêng cho gu thời trang của bạn.
        </p>
      </div>
    </div>
  );
};

export default Picture;