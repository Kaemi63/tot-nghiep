import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap, Settings, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatbotService } from '../../services/chatbotService'; 
import { adminChatbotService } from '../../services/adminChatbotService'; 
import toast from 'react-hot-toast';

const AdminChatWindow = ({ token, userProfile, sessionId: propSessionId, theme, setTheme, setSessionId: propSetSessionId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState(propSessionId);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [draftAttachments, setDraftAttachments] = useState([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const scrollRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const plusContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionBaseRef = useRef('');

  // Đồng bộ sessionId từ trang cha AdminAI truyền xuống
  useEffect(() => {
    if (propSessionId) {
      setSessionId(propSessionId);
    }
  }, [propSessionId]);

  // Khởi tạo lịch sử chat từ database giống phía User thường
  useEffect(() => {
    const initChat = async () => {
      if (!token || !propSessionId) {
        setIsInitializing(false);
        return;
      }
      try {
        setIsInitializing(true);
        const history = await adminChatbotService.getHistory(propSessionId, token);
        if (history) {
          setMessages(history.map(msg => ({
            id: msg.id || Math.random().toString(),
            role: msg.sender_role === 'bot' ? 'assistant' : (msg.sender_role === 'admin' || msg.sender_role === 'user' ? 'admin' : (msg.role || 'assistant')),
            content: msg.content || ''
          })));
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử chat Admin:", err);
      } finally {
        setIsInitializing(false);
      }
    };
    initChat();
  }, [token, propSessionId]);

  // Tự động cuộn xuống đáy khi có tin nhắn mới hoặc đang loading, nhưng chỉ cuộn nếu user đang ở gần đáy
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      
      const lastMessage = messages[messages.length - 1];
      const isUserMessage = lastMessage?.role === 'admin' || lastMessage?.role === 'user';
      
      if (isNearBottom || isUserMessage) {
        scrollRef.current.scrollTop = scrollHeight;
      }
    }
  }, [messages, isLoading]);

  // XỬ LÝ GỬI TIN NHẮN & ĐỌC LUỒNG CHỮ CHẠY STREAM
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && draftAttachments.length === 0) return;
    if (isLoading) return;

    // 1. Đóng gói tin nhắn của Admin đưa lên màn hình trước
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'admin',
      content: text
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setDraftAttachments([]);
    setIsLoading(true);

    // 2. Tạo sẵn node tin nhắn rỗng cho AI Assistant để chuẩn bị hứng chữ chạy
    const botMsgId = `bot-${Date.now()}`;
    setMessages(prev => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

    try {
      let activeId = sessionId;
      if (!activeId) {
        const newSession = await adminChatbotService.createSession(token);
        activeId = newSession.id;
        setSessionId(activeId);
        if (propSetSessionId) propSetSessionId(activeId);
      }

      const updatedMessagesForAPI = [...messages, userMsg].map(m => ({
        role: m.role === 'admin' ? 'user' : m.role,
        content: m.content
      }));

      // Gọi API Backend nhận về luồng Stream Body
      const streamBody = await adminChatbotService.sendAnalyticsMessage(token, activeId, updatedMessagesForAPI);
      
      const reader = streamBody.getReader();
      const decoder = new TextDecoder('utf-8');
      let finished = false;
      let accumulatedText = '';

      while (!finished) {
        const { value, done } = await reader.read();
        finished = done;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const rawStr = line.substring(2).trim();
                const parsedChunk = JSON.parse(rawStr);
                accumulatedText += parsedChunk;

                setMessages(prev => 
                  prev.map(msg => msg.id === botMsgId ? { ...msg, content: accumulatedText } : msg)
                );
              } catch (parseError) {
                // Bỏ qua các mảnh chunk chưa kết thúc dòng hoàn chỉnh
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Lỗi luồng xử lý Chat Admin:", error);
      toast.error(error.message || "Không thể phân tích dữ liệu hệ thống lúc này.");
      setMessages(prev => prev.filter(msg => msg.id !== botMsgId));
    } finally {
      setIsLoading(false);
    }
  };

  // Các hàm bổ trợ đính kèm File / Ảnh nâng cao
  const handlePlusToggle = (e) => {
    e.stopPropagation();
    setIsPlusOpen(v => !v);
  };

  const addAttachment = (file, type) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const preview = type === 'image' ? URL.createObjectURL(file) : null;
    const reader = new FileReader();
    reader.onload = () => {
      setDraftAttachments(prev => [
        ...prev,
        { id, type, filename: file.name, preview, dataUrl: reader.result }
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectImage = (e) => {
    e?.stopPropagation?.();
    setIsPlusOpen(false);
    imageInputRef.current?.click();
  };

  const handleSelectFile = (e) => {
    e?.stopPropagation?.();
    setIsPlusOpen(false);
    fileInputRef.current?.click();
  };

  const removeDraftAttachment = (id) => {
    setDraftAttachments(prev => prev.filter(att => att.id !== id));
  };

  useEffect(() => {
    const onDocClick = () => setIsPlusOpen(false);
    if (isPlusOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isPlusOpen]);

  // Xử lý Ghi âm / Giọng nói sang Văn bản bằng AI SpeechRecognition
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Trình duyệt của bạn không hỗ trợ Microphone Voice API');
      return;
    }
    recognitionBaseRef.current = input || '';
    const recognition = new SpeechRecognition();
    recognition.lang = 'vi-VN';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map(r => r[0].transcript).join('');
      setInput(recognitionBaseRef.current + transcript);
    };

    recognition.onerror = (err) => {
      console.error('Speech error:', err);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecognition = () => {
    try {
      recognitionRef.current?.stop();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecording(false);
    }
  };

  const toggleRecording = (e) => {
    e?.stopPropagation?.();
    if (isRecording) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950">
        <p className="text-slate-400 text-sm tracking-wider animate-pulse">Đang đồng bộ hóa kho dữ liệu AI Admin...</p>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col h-full transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'}`}>
      {/* Header Điều khiển */}
      <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <h1 className="text-lg font-bold tracking-wide">Trợ Lý Phân Tích Doanh Thu Hệ Thống</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
            title="Xem Metadata AI"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Cụm thống kê thông số AI thu nhỏ */}
      {showAdminPanel && (
        <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'} px-6 py-4`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                <BarChart3 size={16} className="text-blue-500" />
                <p className="text-xs font-semibold uppercase">Số lượng hội thoại</p>
              </div>
              <p className="text-xl font-bold">{messages.length} tin nhắn</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                <Zap size={16} className="text-amber-500" />
                <p className="text-xs font-semibold uppercase">Mã định danh (Session ID)</p>
              </div>
              <p className="text-xs font-mono truncate">{sessionId ? sessionId : 'Trống'}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white shadow-sm border border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-1 text-slate-500 dark:text-slate-400">
                <Settings size={16} className="text-emerald-500" />
                <p className="text-xs font-semibold uppercase">Model AI Engine</p>
              </div>
              <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Gemini 2.5 Flash (Real-time Stream)</p>
            </div>
          </div>
        </div>
      )}

      {/* Toàn bộ vùng hiển thị tin nhắn */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Zap size={44} className="mb-3 text-indigo-500 opacity-60 animate-bounce" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-300">Hệ Thống Phân Tích Kinh Doanh Đã Sẵn Sàng</p>
            <p className="text-xs text-center max-w-sm mt-1 text-slate-400">Hãy hỏi về: Doanh số, các sản phẩm bán chạy nhất, hoặc yêu cầu AI dự báo tình hình kinh doanh tháng tới.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'admin' || msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-2xl px-5 py-3.5 rounded-2xl shadow-sm leading-relaxed ${
                msg.role === 'admin' || msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : theme === 'dark' 
                    ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700' 
                    : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
              }`}>
                {/* ĐÃ FIX: Bọc className của Tailwind vào thẻ div thay vì gán vào ReactMarkdown */}
                <div className={`prose prose-sm max-w-none ${(msg.role === 'admin' || msg.role === 'user') ? 'prose-invert text-white' : theme === 'dark' ? 'prose-invert text-slate-100' : 'prose-slate text-slate-800'}`}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Hiệu ứng loading */}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200 shadow-sm'}`}>
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bản xem trước File đính kèm */}
      {draftAttachments.length > 0 && (
        <div className={`border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-3 flex flex-wrap gap-2`}>
          {draftAttachments.map((att) => (
            <div key={att.id} className={`relative p-1.5 rounded-lg border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              {att.type === 'image' && att.preview ? (
                <img src={att.preview} alt="preview" className="h-14 w-14 object-cover rounded-md shadow-sm" />
              ) : (
                <div className="h-14 w-14 flex items-center justify-center text-xl bg-white rounded-md border border-dashed border-slate-300">📄</div>
              )}
              <button
                type="button"
                onClick={() => removeDraftAttachment(att.id)}
                className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-xs shadow hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Ô nhập liệu Form Submit */}
      <form onSubmit={handleFormSubmit} className={`border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-4`}>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
              placeholder="Nhập câu hỏi phân tích dữ liệu (Bấm Enter để gửi)..."
              className={`w-full p-3 rounded-xl border outline-none transition-all resize-none text-sm leading-relaxed ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                  : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500 bg-white shadow-inner'
              }`}
              rows="3"
            />
          </div>
          
          <div className="flex gap-2 flex-col">
            <div className="relative" ref={plusContainerRef}>
              <button
                type="button"
                onClick={handlePlusToggle}
                className={`p-2.5 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
              >
                <Plus size={20} />
              </button>
              {isPlusOpen && (
                <div className={`absolute bottom-full right-0 mb-2 rounded-xl shadow-xl z-20 w-32 border overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <button type="button" onClick={handleSelectImage} className={`block w-full text-left px-4 py-2.5 text-xs hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'} transition-all font-medium`}>📷 Đính kèm ảnh</button>
                  <button type="button" onClick={handleSelectFile} className={`block w-full text-left px-4 py-2.5 text-xs hover:${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-50'} transition-all font-medium`}>📄 Đính kèm file</button>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-2.5 rounded-xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' : theme === 'dark' ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
            >
              <Mic size={20} />
            </button>
            
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && draftAttachments.length === 0)}
              className={`p-2.5 rounded-xl text-white transition-all shadow-md ${
                theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-600'
                  : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-200 disabled:text-slate-400'
              }`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </form>

      <input ref={imageInputRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) addAttachment(f, 'image'); e.target.value = null; }} className="hidden" />
      <input ref={fileInputRef} type="file" onChange={(e) => { const f = e.target.files?.[0]; if (f) addAttachment(f, 'file'); e.target.value = null; }} className="hidden" />
    </div>
  );
};

export default AdminChatWindow;