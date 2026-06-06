import React, { useState } from 'react';
import { Users, Package, LayoutDashboard, Menu, LogOut, ChevronRight, ShoppingCart, CreditCard, Sparkles, MessageSquarePlus, Trash2, Pencil, Check, X, BarChart3, Bot, ChevronDown } from 'lucide-react';
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
        <button onClick={() => setActivePage('dashboard')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <LayoutDashboard size={19} className={activePage === 'dashboard' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Dashboard</span>}
        </button>
        <button onClick={() => setActivePage('ai')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'ai' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <Sparkles size={19} className={activePage === 'ai' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Chatbot admin</span>}
        </button>
        <button onClick={() => setActivePage('users')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <Users size={19} className={activePage === 'users' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Danh sách người dùng</span>}
        </button>
        <button onClick={() => setActivePage('products')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <Package size={19} className={activePage === 'products' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Danh sách sản phẩm</span>}
        </button>
        <button onClick={() => setActivePage('orders')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <ShoppingCart size={19} className={activePage === 'orders' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Quản lý đơn hàng</span>}
        </button>
        <button onClick={() => setActivePage('payments')} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 ${activePage === 'payments' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'hover:bg-slate-800/60 hover:text-white'}`}>
          <CreditCard size={19} className={activePage === 'payments' ? "opacity-100" : "opacity-60"} /> 
          {!collapsed && <span className="flex-1 text-left font-extrabold text-sm tracking-tight">Quản lý thanh toán</span>}
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

// ==================== AdminChatSidebar Component ====================
export const AdminChatSidebar = ({ 
  onNewChat, 
  userProfile,
  sessions = [],
  activeSessionId,
  onSessionSelect, 
  onDeleteSession,
  onRenameSession,
  isCreatingChat = false,
  onLogout,
  onViewStats,
  onViewUserChats,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleStartEdit = (e, session) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title);
  };

  const handleConfirmEdit = async (e, sessionId) => {
    e.stopPropagation();
    if (editingTitle.trim() && onRenameSession) {
      await onRenameSession(sessionId, editingTitle.trim());
    }
    setEditingId(null);
    setEditingTitle('');
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle('');
  };

  const handleKeyDown = (e, sessionId) => {
    if (e.key === 'Enter') handleConfirmEdit(e, sessionId);
    if (e.key === 'Escape') handleCancelEdit(e);
  };

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
          {/* New Chat */}
          <button 
            onClick={onNewChat} 
            disabled={isCreatingChat}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all group ${isCreatingChat ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <MessageSquarePlus size={20} className="text-indigo-600" />
            {!collapsed && <span className="font-bold text-[0.95rem] text-slate-700">
              {isCreatingChat ? 'Đang tạo...' : 'Cuộc trò chuyện mới'}
            </span>}
          </button>

          {/* Admin Features Section */}
          <div className="my-3 border-t border-slate-200"></div>

          {/* View Statistics */}
          <button 
            onClick={onViewStats}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}
            title={collapsed ? "Thống kê" : ""}
          >
            <BarChart3 size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Thống kê & Analytics</span>}
          </button>

          {/* View User Chats */}
          <button 
            onClick={onViewUserChats}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}
            title={collapsed ? "Chat người dùng" : ""}
          >
            <Users size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Chat người dùng</span>}
          </button>

          {/* Chatbot Settings */}
          <button 
            onClick={() => {}}
            className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} w-full ${collapsed ? 'p-2' : 'p-4'} rounded-2xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-800`}
            title={collapsed ? "Cấu hình Bot" : ""}
          >
            <Bot size={20} />
            {!collapsed && <span className="font-semibold text-[0.95rem]">Cấu hình Chatbot</span>}
          </button>
        </nav>
      </div>

      {/* MIDDLE SIDEBAR: Lịch sử tin nhắn */}
      <div className="flex-1 flex flex-col border-t border-slate-200 overflow-hidden">
        <div
          className={`flex items-center ${collapsed ? 'justify-center p-2' : 'justify-between p-4'} cursor-pointer hover:bg-slate-100 transition-all`}
          onClick={() => setIsHistoryOpen((prev) => !prev)}
        >
          {!collapsed && <span className="text-sm font-bold text-slate-700">Lịch sử trò chuyện</span>}
          {!collapsed && (
            <ChevronDown
              size={16}
              className={`text-slate-400 transition-transform ${isHistoryOpen ? '' : '-rotate-90'}`}
            />
          )}
        </div>

        {isHistoryOpen && (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent space-y-1 px-2 py-2">
            {sessions.length === 0 ? (
              <p className={`text-xs text-center p-2 ${collapsed ? 'hidden' : 'text-slate-400'}`}>
                Không có cuộc trò chuyện nào
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={`group flex items-center gap-2 w-full p-2 rounded-lg transition-all cursor-pointer ${
                    activeSessionId === session.id
                      ? 'bg-indigo-100 text-indigo-900 shadow-sm'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {editingId === session.id ? (
                    <>
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, session.id)}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex-1 px-2 py-1 rounded text-xs border outline-none ${
                          activeSessionId === session.id
                            ? 'border-indigo-300 bg-white text-indigo-900'
                            : 'border-slate-300 bg-white text-slate-900'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleConfirmEdit(e, session.id)}
                        className="text-green-600 hover:text-green-700 p-1"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-xs font-medium truncate">
                        {session.title || 'Cuộc trò chuyện'}
                      </span>
                      <button
                        onClick={(e) => handleStartEdit(e, session)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 p-1 transition-all"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Bottom Sidebar */}
      <div className="p-4 border-t border-slate-200">
        {!collapsed && (
          <div className="mb-4 p-3 bg-white rounded-lg border border-slate-200 text-xs">
            <p className="font-semibold text-slate-900">{userProfile?.email || 'Admin'}</p>
            <p className="text-slate-500">Chế độ admin</p>
          </div>
        )}
        <button 
          onClick={onLogout}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold`}
        >
          <LogOut size={20} /> 
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};