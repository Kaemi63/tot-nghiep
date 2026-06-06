import React, { useState, useEffect } from 'react';
import AdminChatWindow from '../../components/Admin/AdminChatWindow';
import { chatbotService } from '../../services/chatbotService';
import { useAuthProfile } from '../../hooks/useAuthProfile';
import toast from 'react-hot-toast';

const AdminAI = () => {
  const { userProfile, token } = useAuthProfile();
  const [chatKey, setChatKey] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [theme, setTheme] = useState('light');

  // Fetch danh sách session
  const fetchSessions = async () => {
    if (!token) return;
    try {
      const data = await chatbotService.getSessions(token);
      setSessions(data);
    } catch (err) {
      console.error("Lỗi lấy session:", err);
    }
  };

  // Load session khi vào trang
  useEffect(() => {
    if (token) {
      fetchSessions();
    } else {
      setSessions([]);
      setActiveSessionId(null);
    }
  }, [token]);

  // Tự động chọn session đầu tiên nếu chưa có session active
  useEffect(() => {
    if (sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  return (
    <div className="flex-1 flex h-full overflow-hidden font-sans">
      {/* Chat Window - không render AdminChatSidebar */}
      <AdminChatWindow 
        key={chatKey}
        token={token}
        userProfile={userProfile}
        sessionId={activeSessionId}
        theme={theme}
        setTheme={setTheme}
      />
    </div>
  );
};

export default AdminAI;
