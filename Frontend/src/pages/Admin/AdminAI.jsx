import React, { useState, useEffect } from 'react';
import AdminChatWindow from '../../components/Admin/AdminChatWindow';
import { adminChatbotService } from '../../services/adminChatbotService'; // Import Service mới
import { useAuthProfile } from '../../hooks/useAuthProfile';
import toast from 'react-hot-toast';

const AdminAI = () => {
  const { userProfile, token } = useAuthProfile();
  const [chatKey, setChatKey] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [theme, setTheme] = useState('light');

  // Fetch danh sách session từ adminChatbotService
  const fetchSessions = async () => {
    if (!token) return;
    try {
      const data = await adminChatbotService.getSessions(token);
      setSessions(data);
    } catch (err) {
      console.error("Lỗi lấy session admin:", err);
      toast.error('Không thể tải lịch sử phiên phân tích');
    }
  };

  useEffect(() => {
    if (token) {
      fetchSessions();
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [token]);

  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  const handleSetSessionId = async (newId) => {
    setActiveSessionId(newId);
    await fetchSessions();
  };

  // Hàm xóa phiên chat sử dụng adminChatbotService
  const handleDeleteSession = async (sid, e) => {
    e.stopPropagation();
    if (!window.confirm('Bạn có chắc chắn muốn xóa phiên phân tích này?')) return;

    try {
      await adminChatbotService.deleteSession(sid, token);
      toast.success('Đã xóa phiên phân tích');
      
      const updated = sessions.filter(s => s.id !== sid);
      setSessions(updated);

      if (activeSessionId === sid) {
        setActiveSessionId(updated.length > 0 ? updated[0].id : null);
      }
    } catch (err) {
      toast.error('Không thể xóa phiên hội thoại');
    }
  };

  // Hàm tạo phiên chat mới sử dụng adminChatbotService
  const handleCreateNewChat = async () => {
    try {
      const newSession = await adminChatbotService.createSession(token);
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      toast.success('Đã tạo phiên phân tích mới');
    } catch (err) {
      toast.error('Không thể tạo phiên phân tích mới');
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden font-sans">
      {/* SIDEBAR QUẢN LÝ LỊCH SỬ PHÂN TÍCH */}
      <div className={`w-64 flex flex-col border-r shrink-0 transition-colors duration-200
        ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'}`}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={handleCreateNewChat}
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>+</span> Phiên phân tích mới
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            return (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group flex items-center justify-between p-3 rounded-lg text-sm cursor-pointer transition-all
                  ${isActive 
                    ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-medium' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}`}
              >
                <span className="truncate max-w-[160px]">
                  {s.title || `Phân tích ${s.id.substring(0, 5)}`}
                </span>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded transition-all"
                  title="Xóa phiên"
                >
                  ×
                </button>
              </div>
            );
          })}
          {sessions.length === 0 && (
            <p className="text-xs text-center text-slate-400 mt-4">Chưa có phiên phân tích nào</p>
          )}
        </div>
      </div>

      {/* KHUNG NỘI DUNG CHAT CHÍNH */}
      <AdminChatWindow
        key={`${activeSessionId}-${chatKey}`}
        token={token}
        userProfile={userProfile}
        sessionId={activeSessionId}
        setSessionId={handleSetSessionId}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default AdminAI;