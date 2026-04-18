import React, { useState } from 'react';
import { Calendar, Zap, Bell, MessageSquarePlus, ShoppingBag, Menu, MessageSquare, ChevronRight, ChevronDown, Trash2 } from "lucide-react";

const Sidebar = ({ 
  onNewChat, 
  onOpenStore, 
  onOpenAccount, 
  onOpenCart, 
  onOpenOrderHistory, 
  onOpenWishlist, 
  userProfile,
  sessions = [],
  activeSessionId,
  onSessionSelect, 
  onDeleteSession,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true); // Trạng thái đóng/mở list lịch sử

  return (
    <div className={`${collapsed ? 'w-20' : 'w-[300px]'} border-r border-slate-100 flex flex-col h-full bg-slate-50/30 shrink-0 transition-all duration-300`}>
      
      {/* Top Sidebar */}
      <div className={`${collapsed ? 'p-2' : 'p-6'}`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} mb-10`}>
          {!collapsed && <h1 className="text-2xl font-bold tracking-tight text-slate-800">FSA AI</h1>}
          <button onClick={() => setCollapsed((prev) => !prev)} className="rounded-lg p-2 hover:bg-slate-100">
            <Menu size={20} className="text-slate-500" />
          </button>
        </div>

        <nav className="space-y-2">
          <button onClick={onNewChat} className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group`}>
            <MessageSquarePlus size={20} className="text-indigo-600" />
            {!collapsed && <span className="font-bold text-[0.95rem] text-slate-700">Cuộc trò chuyện mới</span>}
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

      {/* MIDDLE SIDEBAR: Lịch sử tin nhắn */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-4 mb-4">
          <div className="flex items-center justify-between px-2 mb-2 cursor-pointer" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MessageSquare size={14} /> Gần đây
            </span>
            {isHistoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>

          {isHistoryOpen && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
              {sessions.length === 0 ? (
                <p className="text-xs text-slate-400 px-2 py-2 italic">Chưa có cuộc hội thoại nào</p>
              ) : (
                sessions.map((session) => (
                  <div 
                    key={session.id} 
                    className={`group flex items-center justify-between w-full p-2 rounded-xl transition-all ${
                      activeSessionId === session.id 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {/* Nút chọn Session */}
                    <button 
                      onClick={() => onSessionSelect(session.id)}
                      className="flex items-center gap-3 flex-1 text-left truncate"
                    >
                      <MessageSquare size={16} className={activeSessionId === session.id ? 'text-indigo-600' : 'text-slate-400'} />
                      <span className={`text-sm truncate ${activeSessionId === session.id ? 'font-medium' : ''}`}>
                        {session.title}
                      </span>
                    </button>

                    {/* NÚT XÓA: Chỉ hiện khi hover vào dòng (group-hover) */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện click vào button gây chọn session
                        onDeleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-all rounded-md hover:bg-red-50"
                      title="Xóa cuộc hội thoại"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Sidebar */}
      <div className="p-4 border-t border-slate-100 space-y-6 bg-slate-50/50">
        {collapsed ? (
          <div className="flex flex-col items-center p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <button onClick={onOpenAccount} className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 overflow-hidden">
              <img src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="avatar" className="w-full h-full object-cover" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-slate-50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
              <img src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-bold text-sm text-slate-800 truncate">{userProfile?.fullname || "Khách"}</span>
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