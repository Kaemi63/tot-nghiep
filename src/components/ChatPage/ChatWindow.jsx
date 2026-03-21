import React, { useState } from 'react'; // Đã thêm useState ở đây
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap} from 'lucide-react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: 'user' }]);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white relative font-sans">
      
      {/* 1. Header Chế độ sáng/tối */}
      <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
        <button className="flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all">
          Test 01 <ChevronDown size={18} />
        </button>
        <div className="flex items-center gap-4 text-slate-400">
           <Sun size={20} className="cursor-pointer hover:text-orange-400 transition-colors" />
           <Moon size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" />
        </div>
      </header>

      {/* 2. Khu vực nội dung chính */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
        {messages.length === 0 ? (
          <div className="w-full max-w-2xl px-4">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                Xin chào Bạn!
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-medium text-slate-300">
              Chúng ta nên bắt đầu từ đâu nhỉ?
            </p>
          </div>
        ) : (
          /* HIỂN THỊ TIN NHẮN */
          <div className="w-full max-w-4xl space-y-8 animate-in fade-in duration-500">
            {messages.map((msg, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-slate-800 shrink-0"></div>
                <div className="space-y-1">
                  <span className="font-bold text-sm">Bạn</span>
                  <p className="text-slate-700">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Ô nhập liệu */}
      <div className="w-full p-6 bg-white shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <div className="relative flex items-center bg-[#f0f4f9] rounded-[28px] px-5 py-2 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 shadow-sm">
            
            {/* Nút  */}
            <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors shrink-0">
              <Plus size={22} />
            </button>

            {/* Input chính */}
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Hỏi FSA AI bất cứ điều gì về thời trang hoặc sản phẩm bạn quan tâm"
              className="flex-1 bg-transparent py-3 px-4 outline-none text-slate-700 text-lg placeholder:text-slate-500"
            />

            {/* Cụm icon bên phải */}
            <div className="flex items-center gap-1 shrink-0">
              <button className="p-2.5 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                <Mic size={22} />
              </button>
              
              {/* Nút gửi chỉ hiện khi có chữ */}
              {inputValue.trim() && (
                <button 
                  onClick={handleSendMessage}
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all animate-in zoom-in"
                >
                  <SendHorizontal size={20} />
                </button>
              )}
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 mt-4 tracking-tight">
            FSA AI có thể đưa ra câu trả lời không chính xác. Kiểm tra các Điều khoản & Điều kiện.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;