import React, { useState } from 'react';
import { Users, Package, LayoutDashboard, Settings, Menu, LogOut, ChevronRight, ShoppingCart } from 'lucide-react';

const AdminSidebar = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Quản lý người dùng', icon: <Users size={20} /> },
    { id: 'products', label: 'Quản lý sản phẩm', icon: <Package size={20} /> },
    { id: 'orders', label: 'Đơn hàng', icon: <ShoppingCart size={20} /> },
  ];

  return (
    <div className={`${collapsed ? 'w-20' : 'w-72'} h-screen bg-[#0f172a] text-slate-400 flex flex-col transition-all duration-300 shrink-0 border-r border-slate-800`}>
      <div className="p-6 flex items-center justify-between">
        {!collapsed && <span className="text-xl font-bold text-white tracking-tight">FSA <span className="text-indigo-500">ADMIN</span></span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 px-3 mt-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
              activePage === item.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
              : 'hover:bg-slate-800/50 hover:text-slate-200'
            }`}
          >
            {item.icon}
            {!collapsed && <span className="font-semibold text-[0.95rem] flex-1 text-left">{item.label}</span>}
            {!collapsed && activePage === item.id && <ChevronRight size={14} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all">
          <LogOut size={20} />
          {!collapsed && <span className="font-bold">Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;