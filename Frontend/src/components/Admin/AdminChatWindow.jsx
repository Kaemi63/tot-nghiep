import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap, Settings, BarChart3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatbotService } from '../../services/chatbotService'; 
import toast from 'react-hot-toast';

const AdminChatWindow = ({ token, userProfile, sessionId: propSessionId, theme, setTheme }) => {
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

  // 1. Khởi tạo lịch sử khi có sessionId từ AdminAI
  useEffect(() => {
    if (propSessionId) {
      setSessionId(propSessionId);
    }
  }, [propSessionId]);

  useEffect(() => {
    const initChat = async () => {
      if (!token) {
        setIsInitializing(false);
        return;
      }

      if (!propSessionId) {
        setIsInitializing(false);
        return;
      }

      try {
        setIsInitializing(true);
        const history = await chatbotService.getHistory(propSessionId, token);
        if (history) setMessages(history);
      } catch (err) {
        console.error(err);
      } finally {
        setIsInitializing(false);
      }
    };
    initChat();
  }, [token, propSessionId]);

  // 2. Tự động cuộn
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // 3. HÀM GỬI TIN NHẮN
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && draftAttachments.length === 0) return;
    if (isLoading || !sessionId) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      attachments: draftAttachments.map(({ type, filename, dataUrl }) => ({ type, filename, dataUrl })),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setDraftAttachments([]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          sessionId: sessionId,
        }),
      });

      if (!response.ok) throw new Error("Server response not OK");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let botMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [...prev, { id: botMsgId, role: 'assistant', content: '' }]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        let cleanedChunk = chunk.replace(/^0:|^e:|^d:|^a:|^m:|^/gm, '');

        if (cleanedChunk.startsWith('"') && cleanedChunk.endsWith('"')) {
            cleanedChunk = cleanedChunk.slice(1, -1);
        }

        cleanedChunk = cleanedChunk.replace(/\\n/g, '\n').replace(/\\"/g, '"');
        accumulatedContent += cleanedChunk;

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

  // Plus menu handlers
  const handlePlusToggle = (e) => {
    e.stopPropagation();
    setIsPlusOpen((v) => !v);
  };

  const addAttachment = (file, type) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const preview = type === 'image' ? URL.createObjectURL(file) : null;

    const reader = new FileReader();
    reader.onload = () => {
      setDraftAttachments((prev) => [
        ...prev,
        {
          id,
          type,
          filename: file.name,
          preview,
          dataUrl: reader.result,
        },
      ]);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectImage = (e) => {
    e?.stopPropagation?.();
    setIsPlusOpen(false);
    imageInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addAttachment(file, 'image');
    e.target.value = null;
  };

  const handleSelectFile = (e) => {
    e?.stopPropagation?.();
    setIsPlusOpen(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addAttachment(file, 'file');
    e.target.value = null;
  };

  const removeDraftAttachment = (attachmentId) => {
    setDraftAttachments((prev) => prev.filter((att) => att.id !== attachmentId));
  };

  useEffect(() => {
    const onDocClick = () => setIsPlusOpen(false);
    if (isPlusOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isPlusOpen]);

  // Microphone handlers
  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error('Trình duyệt không hỗ trợ nhận dạng giọng nói');
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
      console.error('Speech error', err);
      toast.error('Lỗi khi ghi âm');
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
      toast.error('Không thể bắt đầu ghi âm');
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
    return <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100"><p className="text-slate-400">Đang tải...</p></div>;
  }

  return (
    <div className={`flex-1 flex flex-col h-full transition-colors duration-200 ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900'}`}>
      {/* Header Admin */}
      <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-4 flex items-center justify-between`}>
        <h1 className="text-xl font-bold">AI Chatbot Admin</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdminPanel(!showAdminPanel)}
            className={`p-2 rounded-lg transition-all ${theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-200'}`}
            title="Admin Panel"
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

      {/* Admin Panel */}
      {showAdminPanel && (
        <div className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'} px-6 py-4`}>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 size={18} className="text-blue-500" />
                <p className="text-sm font-semibold">Messages</p>
              </div>
              <p className="text-2xl font-bold">{messages.length}</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap size={18} className="text-yellow-500" />
                <p className="text-sm font-semibold">Session ID</p>
              </div>
              <p className="text-xs font-mono break-all">{sessionId?.substring(0, 12)}...</p>
            </div>
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Settings size={18} className="text-green-500" />
                <p className="text-sm font-semibold">Status</p>
              </div>
              <p className="text-sm">{isLoading ? 'Processing...' : 'Ready'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-6 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Zap size={48} className="mb-3 opacity-50" />
            <p className="text-lg font-semibold">Bắt đầu cuộc trò chuyện</p>
            <p className="text-sm">Gõ tin nhắn hoặc sử dụng các tính năng bên dưới</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-4 py-3 rounded-lg ${
                  msg.role === 'user'
                    ? theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'
                    : theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900 border border-slate-200'
                }`}
              >
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2 space-y-2">
                    {msg.attachments.map((att) => (
                      <div key={att.filename} className="text-sm">
                        {att.type === 'image' ? (
                          <img src={att.dataUrl} alt={att.filename} className="max-w-xs rounded" />
                        ) : (
                          <a href={att.dataUrl} download={att.filename} className="underline hover:no-underline">
                            📄 {att.filename}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  className="prose prose-sm max-w-none"
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-slate-800' : 'bg-white border border-slate-200'}`}>
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Attachments Preview */}
      {draftAttachments.length > 0 && (
        <div className={`border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-3 flex flex-wrap gap-2`}>
          {draftAttachments.map((att) => (
            <div key={att.id} className={`relative p-2 rounded ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
              {att.type === 'image' && att.preview ? (
                <img src={att.preview} alt={att.filename} className="h-16 w-16 object-cover rounded" />
              ) : (
                <div className="h-16 w-16 flex items-center justify-center text-xs text-center break-words">📄</div>
              )}
              <button
                onClick={() => removeDraftAttachment(att.id)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleFormSubmit}
        className={`border-t ${theme === 'dark' ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'} px-6 py-4`}
      >
        <div className="flex gap-3 items-end">
          <div className="flex-1 flex flex-col gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleFormSubmit(e);
                }
              }}
              placeholder="Gõ tin nhắn hoặc câu hỏi..."
              className={`flex-1 p-3 rounded-lg border outline-none transition-all resize-none ${
                theme === 'dark'
                  ? 'border-slate-700 bg-slate-800 text-white placeholder-slate-500'
                  : 'border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
              }`}
              rows="3"
            />
          </div>
          <div className="flex gap-2 flex-col">
            <div className="relative" ref={plusContainerRef}>
              <button
                type="button"
                onClick={handlePlusToggle}
                className={`p-3 rounded-lg transition-all ${
                  theme === 'dark'
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                }`}
              >
                <Plus size={20} />
              </button>
              {isPlusOpen && (
                <div
                  className={`absolute bottom-full right-0 mb-2 rounded-lg shadow-lg z-10 ${
                    theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={handleSelectImage}
                    className={`block w-full text-left px-4 py-2 text-sm hover:${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                    } transition-all`}
                  >
                    📷 Thêm ảnh
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectFile}
                    className={`block w-full text-left px-4 py-2 text-sm hover:${
                      theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                    } transition-all`}
                  >
                    📄 Thêm file
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-3 rounded-lg transition-all ${
                isRecording
                  ? theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-500 hover:bg-red-600'
                  : theme === 'dark'
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
            >
              <Mic size={20} className={isRecording ? 'text-white animate-pulse' : ''} />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`p-3 rounded-lg transition-all ${
                theme === 'dark'
                  ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700'
                  : 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-300'
              } text-white`}
            >
              <SendHorizontal size={20} />
            </button>
          </div>
        </div>
      </form>

      {/* Hidden inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AdminChatWindow;
