import React, { useEffect, useRef } from 'react';
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap, Home } from 'lucide-react';
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

const ChatWindow = () => {
  const { messages, input, handleInputChange, isLoading, setMessages, setInput } = useChat({
    api: 'http://localhost:3001/api/chat',
  });

  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const onFormSubmit = async (e) => {
    if (e) e.preventDefault(); 
    const messageContent = inputRef.current?.value || input;
    if (!messageContent || messageContent.trim() === "") return;

    try {
      const userMessage = { id: Date.now().toString(), role: 'user', content: messageContent };
      setMessages([...messages, userMessage]);
      if (inputRef.current) inputRef.current.value = "";
      if (setInput) setInput("");

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMessage.content += decoder.decode(value);
        setMessages((prev) => prev.map((msg) => msg.id === assistantMessage.id ? { ...assistantMessage } : msg));
      }
    } catch (err) { console.error(err); }
  };   

  return (
    <div className="flex flex-col h-screen w-full bg-white relative font-sans text-slate-900">
      <header className="p-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0 shadow-sm">
        <button className="flex items-center gap-2 font-semibold text-slate-700 hover:bg-slate-50 px-3 py-2 rounded-lg transition-all text-sm">
          FSA AI TEST <ChevronDown size={18} />
        </button>
        <div className="flex items-center gap-4 text-slate-400">
           <Sun size={20} className="cursor-pointer hover:text-orange-400" />
           <Moon size={20} className="cursor-pointer hover:text-indigo-600" />
           <Home size={20} className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer" />
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col items-center">
        {messages.length === 0 ? (
          <div className="w-full max-w-2xl px-4 my-auto">
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-orange-400 bg-clip-text text-transparent">Xin chào Bạn!</span>
            </h1>
            <p className="text-3xl md:text-4xl font-medium text-slate-300">Chúng ta nên bắt đầu từ đâu nhỉ?</p>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-8 pb-10">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center overflow-hidden border ${m.role === 'user' ? 'bg-slate-100 border-slate-200' : 'bg-white border-indigo-100 shadow-sm'}`}>
                  {m.role === 'user' ? <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="user" /> : <Zap size={20} className="text-indigo-600" />}
                </div>

                <div className="flex-1 space-y-2 min-w-0">
                  <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">
                    {m.role === 'user' ? 'Trần Văn A' : 'FSA AI Assistant'}
                  </span>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-baseprose-headings:font-bold prose-h3:text-lg prose-h3:mt-4prose-p:mb-3 prose-strong:text-indigo-600prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1prose-hr:my-6">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm, remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full p-6 bg-white shrink-0">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={onFormSubmit} className="relative flex items-center bg-[#f0f4f9] rounded-[28px] px-5 py-2 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 shadow-sm">
            <button type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors"><Plus size={22} /></button>
            <input 
              ref={inputRef} type="text" autoComplete="off" value={input} onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onFormSubmit(e)}
              placeholder="Hỏi FSA AI về phong cách thiết kế, xu hướng thời trang..."
              className="flex-1 bg-transparent py-3 px-4 outline-none text-slate-700 text-lg placeholder:text-slate-500"
            />
            <div className="flex items-center gap-1">
              <button type="button" className="p-2.5 text-slate-500 hover:bg-slate-200 rounded-full"><Mic size={22} /></button>
              {(input || "").trim() !== "" && (
                <button type="submit" disabled={isLoading} className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all animate-in zoom-in shadow-md"><SendHorizontal size={20} /></button>
              )}
            </div>
          </form>
          <p className="text-center text-[11px] text-slate-400 mt-4 tracking-tight">FSA AI có thể mắc lỗi.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;