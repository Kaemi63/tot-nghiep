import React, { useState } from 'react';
import { Users, Package, LayoutDashboard, Menu, LogOut, ChevronRight, ShoppingCart } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

const AdminSidebar = ({ activePage, setActivePage, onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('fsa_user');
      localStorage.removeItem('fsa_token');
      if (onLogout) onLogout(); // Chuyển về Home ở App.jsx
    } catch (error) {
      console.log('Lỗi đăng xuất:', error.message);
    }
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-[#0f172a] text-slate-400 flex flex-col transition-all duration-300 shrink-0 border-r border-slate-800`}>
      <div className="p-6 flex items-center justify-between text-white font-bold">
        {!collapsed && <span>FSA <span className="text-indigo-500">ADMIN</span></span>}
        <button onClick={() => setCollapsed(!collapsed)}><Menu size={20} /></button>
      </div>
      <nav className="flex-1 px-3 mt-4 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        <button onClick={() => setActivePage('users')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <Users size={19} className={activePage === 'users' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Danh sách người dùng</span>}
        </button>
        <button onClick={() => setActivePage('products')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <Package size={19} className={activePage === 'products' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Danh sách sản phẩm</span>}
        </button>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all">
          <LogOut size={20} /> {!collapsed && <span className="font-bold">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;