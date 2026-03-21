import React from 'react';
import { Home, BarChart2, Calendar, Zap, Bell, MessageSquarePlus, ShoppingBag, ChevronDown, Menu } from 'lucide-react';

const Sidebar = ({ onNewChat }) => {
  return (
    <div className="w-[300px] border-r border-slate-100 flex flex-col h-full bg-slate-50/30 shrink-0">
      
      {/* Top Sidebar: Logo & Nút chức năng chính */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">FSA AI</h1>
        </div>

        <nav className="space-y-2">
          {/* Nút tạo chat mới - Giữ vai trò quan trọng khi giao diện đang trống */}
          <button onClick={onNewChat} className="flex items-center gap-3 w-full p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group">
            <MessageSquarePlus size={20} className="text-indigo-600" />
            <span className="font-bold text-[0.95rem] text-slate-700">Tạo cuộc trò chuyện mới</span>
          </button>
          
          <button className="flex items-center gap-3 w-full p-4 rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800">
            <ShoppingBag size={20} />
            <span className="font-semibold text-[0.95rem]">Danh sách sản phẩm</span>
          </button>
        </nav>
      </div>

      {/* Middle Sidebar: Để trống hoàn toàn để tạo không gian Quiet Luxury */}
      <div className="flex-1"></div>

      {/* Bottom Sidebar: User & Icons Menu */}
      <div className="p-4 border-t border-slate-100 space-y-6">
        {/* Hàng Icons điều hướng phụ */}
        <div className="flex items-center justify-around px-2">
          <Home size={22} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
          <BarChart2 size={22} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
          <Calendar size={22} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
          <Zap size={22} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
          <Bell size={22} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
        </div>
        
        {/* User Info & Menu Icon */}
        <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <span className="block font-bold text-sm text-slate-800 truncate">Trần Văn A</span>
            <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Free Account</span>
          </div>
          <button className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
            <Menu size={20} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;