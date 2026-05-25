import React, { useState } from 'react';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';
import ChatWindow from '../../components/ChatPage/ChatWindow';

const ChatWidgetPopup = ({ token, userProfile, currentSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [instanceKey, setInstanceKey] = useState(0); 

  // Nếu người dùng đang ở giao diện chat chính, ẩn hoàn toàn popup
  if (currentSection === 'chat') {
    return null;
  }

  const popupSessionId = 'temporary-popup-chat';

  // Xóa sạch lịch sử chat tạm thời trên UI khi chủ động bấm nút X đóng popup
  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
    setInstanceKey(prev => prev + 1); 
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* KHUNG CỬA SỔ CHAT POPUP TẠM THỜI */}
      {isOpen && (
        <div 
          className={`bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col mb-4 transition-all duration-300 origin-bottom-right ${
            isMinimized 
              ? 'w-72 h-14' 
              : 'w-[480px] sm:w-[550px] h-[550px]'
          }`}
        >
          {/* Header Popup (Cố định ở đỉnh) */}
          <div className="bg-slate-900 px-4 py-3.5 flex items-center justify-between text-white select-none flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-200">Tư vấn nhanh</h4>
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-slate-400">
              <button 
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                title={isMinimized ? "Mở rộng" : "Thu nhỏ"}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button 
                onClick={handleClose}
                className="p-1 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                title="Đóng cửa sổ"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div 
            className={`flex-1 min-h-0 w-full bg-slate-50 relative flex flex-col ${
              isMinimized ? 'hidden' : ''
            }`}
          >

            <div className="popup-chat-mode w-full h-full overflow-y-auto overflow-x-hidden flex flex-col [&_header]:hidden [&_aside]:hidden"> 
              <ChatWindow 
                key={`${instanceKey}-${popupSessionId}`}
                token={token}
                userProfile={userProfile}
                sessionId={popupSessionId}
                theme="light"
              />
            </div>
          </div>
        </div>
      )}

      {/* NÚT BONG BÓNG TRÒ CHUYỆN CỐ ĐỊNH */}
      <button
        onClick={() => {
          if (isOpen) {
            handleClose(); 
          } else {
            setIsOpen(true);
          }
        }}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ${
          isOpen ? 'bg-slate-800 hover:bg-slate-900' : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

    </div>
  );
};

export default ChatWidgetPopup;