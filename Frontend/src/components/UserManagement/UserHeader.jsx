import React from 'react';
import { User, ChevronDown } from 'lucide-react';

const UserHeader = () => {
  const adminName = localStorage.getItem('fsa_user_name') || 'Quản trị viên';

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-end shadow-sm z-10">
      <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest leading-none mb-1">
            Hệ thống Admin
          </p>
          <p className="text-sm font-bold text-slate-800 leading-none">
            {adminName}
          </p>
        </div>
        
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-50 p-0.5 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {adminName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
        <ChevronDown size={16} className="text-slate-400" />
      </div>
    </header>
  );
};

export default UserHeader;