import React, { useState } from 'react';
import { Calendar, Zap, Bell, MessageSquarePlus, ShoppingBag, Menu } from 'lucide-react';

// SỬA: Nhận userProfile từ props thay vì tự fetch bên trong
const Sidebar = ({ 
  onNewChat, 
  onOpenStore, 
  onOpenAccount, 
  onOpenCart, 
  onOpenOrderHistory, 
  onOpenWishlist, 
  userProfile // Prop mới được truyền từ ChatPage
}) => {
  const [collapsed, setCollapsed] = useState(false);

  // XÓA: Toàn bộ useState(userProfile) và useEffect fetch dữ liệu cũ ở đây

  return (
    <div className={`${collapsed ? 'w-20' : 'w-[300px]'} border-r border-slate-100 flex flex-col h-full bg-slate-50/30 shrink-0 transition-all duration-300`}>
      
      {/* Top Sidebar: Logo & Nút chức năng chính - GIỮ NGUYÊN THIẾT KẾ */}
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
      </div>

      {/* Middle Sidebar */}
      <div className="flex-1"></div>

      {/* Bottom Sidebar: GIỮ NGUYÊN THIẾT KẾ, CHỈ DÙNG DATA TỪ PROPS */}
      <div className="p-4 border-t border-slate-100 space-y-6">
        {collapsed ? (
          <div className="flex flex-col items-center p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <button onClick={onOpenAccount} className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 overflow-hidden">
              <img 
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
                src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                alt="avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
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