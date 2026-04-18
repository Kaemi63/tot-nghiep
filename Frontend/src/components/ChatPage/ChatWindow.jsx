import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatbotService } from '../../services/chatbotService'; 
import toast from 'react-hot-toast';

const ChatWindow = ({ token, userProfile, sessionId: propSessionId }) => {
  // QUẢN LÝ STATE THỦ CÔNG (Thay thế cho useChat)
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState(propSessionId);
  const scrollRef = useRef(null);

  // 1. Khởi tạo Session và Lịch sử
  useEffect(() => {
    // Cập nhật sessionId khi prop thay đổi (do click từ sidebar)
    if (propSessionId) {
      setSessionId(propSessionId);
    }
  }, [propSessionId]);

  useEffect(() => {
    const initChat = async () => {
      if (!token) return;
      try {
        setIsInitializing(true);
        
        // Nếu không có sessionId (ví dụ: mới vào trang lần đầu), hãy tạo mới
        let currentId = sessionId;
        if (!currentId) {
          const session = await chatbotService.createSession(token);
          currentId = session.id;
          setSessionId(currentId);
        }

        // Lấy lịch sử của session hiện tại
        const history = await chatbotService.getHistory(currentId, token);
        if (history) setMessages(history);

      } catch (err) {
        console.error(err);
      } finally {
        setIsInitializing(false);
      }
    };
    initChat();
  }, [token, sessionId]);

  // 2. Tự động cuộn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // 3. HÀM GỬI TIN NHẮN THỦ CÔNG (Thay thế handleSubmit/append)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading || !sessionId) return;

    // BƯỚC 1: Hiện tin nhắn User lên giao diện ngay lập tức (Optimistic Update)
    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput(''); // Xóa ô nhập ngay
    setIsLoading(true);

    try {
      // BƯỚC 2: Gọi API Backend
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          messages: [...messages, userMsg], // Gửi kèm lịch sử
          sessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error("Server response not OK");

      // BƯỚC 3: Xử lý Stream (Đọc dữ liệu trả về từng chút một)
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      // Tạo một tin nhắn Bot trống để cập nhật dần dần
      let botMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // 1. Loại bỏ các tiền tố của Vercel AI SDK
        let cleanedChunk = chunk.replace(/^0:|^e:|^d:|^a:|^m:|^/gm, '');

        // 2. Xử lý chuỗi JSON nếu nó bị bọc trong dấu ngoặc kép " "
        if (cleanedChunk.startsWith('"') && cleanedChunk.endsWith('"')) {
            cleanedChunk = cleanedChunk.slice(1, -1);
        }

        // 3. QUAN TRỌNG: Chuyển đổi ký tự \n (dạng text) thành dấu xuống dòng thực sự
        cleanedChunk = cleanedChunk.replace(/\\n/g, '\n').replace(/\\"/g, '"');

        accumulatedContent += cleanedChunk;

        // Cập nhật tin nhắn Bot trong mảng messages
        setMessages((prev) => 
          prev.map((msg) => msg.id === botMsgId ? { ...msg, content: accumulatedContent } : msg)
        );
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("Có lỗi xảy ra khi AI trả lời");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-white w-full">
        <div className="flex flex-col items-center gap-3">
           <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="text-indigo-600 font-medium animate-pulse">Đang chuẩn bị FSA AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white relative font-sans text-slate-900">
      <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 shadow-sm z-10">
        <button className="flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all text-sm uppercase tracking-wider">
          FSA AI Assistant <ChevronDown size={18} />
        </button>
        <div className="flex items-center gap-4 text-slate-400">
           <Sun size={20} className="cursor-pointer hover:text-orange-400 transition-colors" />
           <Moon size={20} className="cursor-pointer hover:text-indigo-600 transition-colors" />
           <Home size={20} className="hover:text-indigo-600 transition-colors cursor-pointer" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col items-center scroll-smooth bg-white">
        {messages.length === 0 ? (
          <div className="w-full max-w-2xl px-4 my-auto text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                Xin chào {userProfile?.fullname || "Bạn"}!
              </span>
            </h1>
            <p className="text-3xl md:text-4xl font-medium text-slate-300 italic">Hôm nay bạn cần hỗ trợ gì về thời trang?</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-8 pb-10">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${m.role === 'user' ? 'bg-slate-100 border-slate-200' : 'bg-white border-indigo-100 shadow-sm'}`}>
                  {m.role === 'user' ? (
                    <img src={userProfile?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"} alt="user" className="w-full h-full object-cover" />
                  ) : (
                    <Zap size={20} className="text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <span className="font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                    {m.role === 'user' ? (userProfile?.fullname || 'Bạn') : 'FSA AI Assistant'}
                  </span>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base prose-p:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-indigo-500 text-sm font-medium animate-pulse ml-14">
                <div className="flex gap-1">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                FSA AI đang soạn câu trả lời...
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full p-6 bg-white shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <form 
            onSubmit={handleFormSubmit}
            className="relative flex items-center bg-[#f0f4f9] rounded-[28px] px-5 py-2 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 shadow-sm"
          >
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
              <Plus size={22} />
            </button>
            <input 
              type="text" 
              autoComplete="off" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi FSA AI về phối đồ, chất liệu..."
              className="flex-1 bg-transparent py-3 px-4 outline-none text-slate-700 text-lg placeholder:text-slate-500"
              disabled={isLoading || !sessionId}
            />
            <div className="flex items-center gap-1">
              <button type="button" className="p-2.5 text-slate-500 hover:bg-slate-200 rounded-full">
                <Mic size={22} />
              </button>
              {(input || "").trim() !== "" && (
                <button 
                  type="submit" 
                  disabled={isLoading || !sessionId} 
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all animate-in zoom-in shadow-md disabled:bg-slate-300"
                >
                   <SendHorizontal size={20} />
                </button>
              )}
            </div>
          </form>
          <p className="text-center text-[10px] text-slate-400 mt-4 tracking-widest uppercase font-bold">
            Fashion Smart Assistant • 2026 AI Version
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;