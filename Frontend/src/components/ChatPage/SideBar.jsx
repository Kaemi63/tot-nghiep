import React, { useState, useEffect } from 'react';
import { BarChart2, Calendar, Zap, Bell, MessageSquarePlus, ShoppingBag, ChevronDown, Menu } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';

const Sidebar = ({ onNewChat, onOpenStore, onOpenAccount, onOpenCart, onOpenOrderHistory, onOpenWishlist, isStore, showCategories, onCategorySelect }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  // 1. Thêm State để lưu thông tin User
  const [userProfile, setUserProfile] = useState(null);

  const categories = [
    { id: 'nam', label: 'Thời trang Nam' },
    { id: 'nu', label: 'Thời trang Nữ' },
    { id: 'phukien', label: 'Phụ kiện' },
    { id: 'giay', label: 'Giày dép' },
    { id: 'aokhoac', label: 'Áo khoác' },
    { id: 'quanjeans', label: 'Quần Jeans' },
  ];

  // 2. Fetch dữ liệu User khi Sidebar được render
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select('fullname, avatar_url') // Chỉ lấy các cột cần thiết cho Sidebar
            .eq('id', session.user.id)
            .single();

          if (data && !error) {
            setUserProfile(data);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin Sidebar:", error.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className={`${collapsed ? 'w-20' : 'w-[300px]'} border-r border-slate-100 flex flex-col h-full bg-slate-50/30 shrink-0 transition-all duration-300`}>
      
      {/* Top Sidebar: Logo & Nút chức năng chính */}
      <div className={`${collapsed ? 'p-2' : 'p-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-10`}>
          {!collapsed && <h1 className="text-2xl font-bold tracking-tight text-slate-800">FSA AI</h1>}
          <button onClick={() => setCollapsed((prev) => !prev)} className="rounded-lg p-2 hover:bg-slate-100">
            <Menu size={20} className="text-slate-500" />
          </button>
        </div>

        <nav className="space-y-2">
          {/* Nút tạo chat mới */}
          <button onClick={onNewChat} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group`}>
            <MessageSquarePlus size={20} className="text-indigo-600" />
            {!collapsed && <span className="font-bold text-[0.95rem] text-slate-700">Tạo cuộc trò chuyện mới</span>}
          </button>
          
          <button onClick={onOpenStore} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}>
            <ShoppingBag size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Danh mục thời trang</span>}
          </button>
          <button onClick={onOpenCart} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}>
            <Calendar size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Giỏ hàng</span>}
          </button>
          <button onClick={onOpenOrderHistory} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}>
            <Zap size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Lịch sử đơn hàng</span>}
          </button>
          <button onClick={onOpenWishlist} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}>
            <Bell size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Yêu thích</span>}
          </button>
        </nav>

        {showCategories && !collapsed && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2">Danh mục thời trang</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => onCategorySelect(cat.id)} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-slate-100">{cat.label}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Middle Sidebar */}
      <div className="flex-1"></div>

      {/* 3. Bottom Sidebar: CẬP NHẬT GIAO DIỆN Ở ĐÂY */}
      <div className="p-4 border-t border-slate-100 space-y-6">
        {collapsed ? (
          <div className="flex flex-col items-center p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <button onClick={onOpenAccount} className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 overflow-hidden">
              <img 
                // Thay ảnh ảo bằng URL thật từ database
                src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                alt="avatar" 
                className="w-full h-full object-cover" 
              />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
              <img 
                // Thay ảnh ảo bằng URL thật từ database
                src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              {/* Hiển thị fullname, nếu chưa load xong thì hiện chữ Khách */}
              <span className="block font-bold text-sm text-slate-800 truncate">
                {userProfile?.fullname || "Khách"}
              </span>
              <span className="block text-[10px] uppercase tracking-wider font-bold text-slate-400">Free Account</span>
            </div>
            <button onClick={onOpenAccount} className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs hover:bg-indigo-100 transition-colors">
              Hồ sơ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;