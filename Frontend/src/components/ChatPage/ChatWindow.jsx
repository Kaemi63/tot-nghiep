import React, { useEffect, useRef, useState } from 'react';
import { Sun, Moon, Mic, SendHorizontal, Plus, ChevronDown, Zap, Home } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { chatbotService } from '../../services/chatbotService'; 
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabaseClient';
import { API_BASE_URL } from '../../config/api';

// Helper to extract suggested products based on chatbot content
const getSuggestedProductsForMessage = (content, allProducts) => {
  if (!content || !allProducts || allProducts.length === 0) return [];
  const contentLower = content.toLowerCase();
  
  return allProducts.filter(product => {
    if (!product.name) return false;
    const nameLower = product.name.toLowerCase();
    return contentLower.includes(nameLower);
  });
};

// Component to render suggested products for a chatbot response
const SuggestedProducts = ({ messageId, sessionId, content, allProducts, onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchSuggestedProducts = async () => {
      setLoading(true);
      try {
        let metadata = null;
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(messageId);
        
        // 1. Try to fetch from database message metadata first
        if (!isUuid && sessionId && sessionId !== 'temporary-popup-chat') {
          // If it's a temporary timestamp ID, wait a short moment for backend to save
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { data } = await supabase
            .from('chat_messages')
            .select('metadata')
            .eq('session_id', sessionId)
            .eq('sender_role', 'bot')
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (data && data.length > 0) {
            metadata = data[0].metadata;
          }
        } else if (isUuid) {
          const { data } = await supabase
            .from('chat_messages')
            .select('metadata')
            .eq('id', messageId)
            .single();
            
          metadata = data?.metadata;
        }

        const suggested = metadata?.suggested_products;
        let matchedProducts = [];

        if (suggested && Array.isArray(suggested) && suggested.length > 0) {
          const productNames = suggested.map(p => p.name);
          
          // Query details only for these specific products
          const { data: fullProducts } = await supabase
            .from('products')
            .select(`
              id,
              name,
              slug,
              short_description,
              description,
              thumbnail_url,
              base_price,
              is_featured,
              status,
              brands (id, name, slug, logo_url),
              categories (id, name, slug),
              product_images (id, image_url, sort_order),
              product_specifications (id, spec_name, spec_value),
              product_variants (id, variant_name, sku, price, stock_quantity, color, size)
            `)
            .in('name', productNames)
            .eq('status', 'active');
            
          if (fullProducts && fullProducts.length > 0) {
            matchedProducts = fullProducts;
          }
        }

        // 2. Fallback: If metadata fetching failed or returned no products, use client-side text matching
        if (matchedProducts.length === 0 && content && allProducts && allProducts.length > 0) {
          const contentLower = content.toLowerCase();
          matchedProducts = allProducts.filter(product => {
            if (!product.name) return false;
            const nameLower = product.name.toLowerCase();
            return contentLower.includes(nameLower);
          });
        }

        if (isMounted) {
          setProducts(matchedProducts);
        }
      } catch (err) {
        console.error("Lỗi tải gợi ý sản phẩm:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSuggestedProducts();
    
    return () => { isMounted = false; };
  }, [messageId, sessionId, content, allProducts]);

  if (loading) {
    return (
      <div className="mt-4 pt-3 border-t border-slate-100 flex gap-4 overflow-x-auto pb-2">
        <div className="w-64 h-24 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-4 pt-3 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-1 duration-300">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
        Sản phẩm gợi ý cho bạn
      </p>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
        {products.map((product) => {
          const image = product.thumbnail_url || `https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=300&q=80`;
          const priceStr = product.base_price ? product.base_price.toLocaleString('vi-VN') + 'đ' : '—';
          const brandName = product.brands?.name || 'FSA';

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct && onSelectProduct(product)}
              className="flex-shrink-0 w-64 bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:bg-white rounded-2xl p-3 flex gap-3 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
            >
              <img
                src={image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl bg-slate-100 flex-shrink-0"
              />
              <div className="flex flex-col justify-between min-w-0 flex-1">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                    {brandName}
                  </span>
                  <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">
                    {product.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-bold text-indigo-600">
                    {priceStr}
                  </span>
                  <span className="text-[10px] font-semibold text-indigo-600 hover:underline">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ChatWindow = ({ token, userProfile, sessionId: propSessionId, theme, setTheme, onSelectProduct }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [sessionId, setSessionId] = useState(propSessionId);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [draftAttachments, setDraftAttachments] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const scrollRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const plusContainerRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionBaseRef = useRef('');

  // Load active products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            slug,
            short_description,
            description,
            thumbnail_url,
            base_price,
            is_featured,
            status,
            brands (id, name, slug, logo_url),
            categories (id, name, slug),
            product_images (id, image_url, sort_order),
            product_specifications (id, spec_name, spec_value),
            product_variants (id, variant_name, sku, price, stock_quantity, color, size)
          `)
          .eq('status', 'active');
        if (error) {
          console.error("Lỗi fetch all products:", error);
        } else if (data) {
          setAllProducts(data);
        }
      } catch (err) {
        console.error("Lỗi fetch all products:", err);
      }
    };
    fetchAllProducts();
  }, []);

  // 1. Khởi tạo lịch sử khi có sessionId từ ChatPage
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

  // 3. HÀM GỬI TIN NHẮN THỦ CÔNG (Thay thế handleSubmit/append)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && draftAttachments.length === 0) return;
    if (isLoading || !sessionId) return;

    // BƯỚC 1: Hiện tin nhắn User lên giao diện ngay lập tức (Optimistic Update)
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
      // BƯỚC 2: Gọi API Backend
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
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

  // Close plus menu when clicking outside
  useEffect(() => {
    const onDocClick = () => setIsPlusOpen(false);
    if (isPlusOpen) document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [isPlusOpen]);

  // Microphone (SpeechRecognition) handlers
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
    if (isRecording) stopRecognition();
    else startRecognition();
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
           <Sun
             size={20}
             onClick={() => setTheme('light')}
             className={`cursor-pointer transition-colors ${theme === 'light' ? 'text-orange-400' : 'hover:text-orange-400'}`}
           />
           <Moon
             size={20}
             onClick={() => setTheme('dark')}
             className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-indigo-400' : 'hover:text-indigo-600'}`}
           />
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
            {messages.map((m, index) => {
              const isLastMessage = index === messages.length - 1;
              const isBotStreaming = isLastMessage && isLoading;
              
              return (
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
                      {m.attachments?.length > 0 ? (
                        <div className="space-y-3">
                          {m.attachments.map((att, idx) => (
                            <div key={idx} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                              {att.type === 'image' ? (
                                <img src={att.dataUrl || att.preview} alt={att.filename} className="h-16 w-16 rounded-md object-cover" />
                              ) : (
                                <div className="flex h-16 w-16 items-center justify-center rounded-md bg-white text-xs font-semibold text-slate-600">Tệp</div>
                              )}
                              <div className="truncate">
                                <p className="font-semibold text-slate-700">{att.filename}</p>
                                <p className="text-xs text-slate-500">{att.type === 'image' ? 'Ảnh' : 'Tệp đính kèm'}</p>
                              </div>
                            </div>
                          ))}
                          {m.content && (
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                              {m.content}
                            </ReactMarkdown>
                          )}
                        </div>
                      ) : m.type === 'image' ? (
                        <img src={m.content} alt={m.filename || 'image'} className="rounded-md max-w-xs" />
                      ) : m.type === 'file' ? (
                        <a href={m.content} download={m.filename} className="text-indigo-600 underline">{m.filename}</a>
                      ) : (
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {m.content}
                        </ReactMarkdown>
                      )}

                      {/* Hiển thị thẻ gợi ý sản phẩm khi bot trả lời xong */}
                      {m.role === 'assistant' && !isBotStreaming && (
                        <SuggestedProducts 
                          messageId={m.id}
                          sessionId={sessionId}
                          content={m.content} 
                          allProducts={allProducts} 
                          onSelectProduct={onSelectProduct} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
            className="relative flex flex-col gap-3 bg-[#f0f4f9] rounded-[28px] px-5 py-4 transition-all focus-within:bg-white focus-within:ring-1 focus-within:ring-slate-200 shadow-sm"
          >
            {draftAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {draftAttachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">
                    {att.type === 'image' ? (
                      <img src={att.preview} alt={att.filename} className="h-10 w-10 rounded-md object-cover" />
                    ) : (
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white text-xs font-semibold text-slate-600">T</span>
                    )}
                    <span className="truncate max-w-[140px]">{att.filename}</span>
                    <button type="button" onClick={() => removeDraftAttachment(att.id)} className="text-slate-400 hover:text-slate-600">✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-3">
              <div className="relative" ref={plusContainerRef}>
                <button onClick={handlePlusToggle} type="button" className="p-2 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                  <Plus size={22} />
                </button>

                {isPlusOpen && (
                  <div onClick={(e) => e.stopPropagation()} className="absolute left-0 bottom-14 bg-white rounded-md shadow-lg py-1 z-50 w-44">
                    <button onClick={handleSelectImage} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Thêm ảnh từ thiết bị</button>
                    <button onClick={handleSelectFile} type="button" className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50">Thêm tệp</button>
                  </div>
                )}

                <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                <input ref={fileInputRef} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
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
                <div className="relative">
                  <button onClick={toggleRecording} type="button" className={`p-2.5 rounded-full ${isRecording ? 'bg-red-100 text-red-600' : 'text-slate-500 hover:bg-slate-200'}`}>
                    <Mic size={22} />
                  </button>
                  {isRecording && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !sessionId || (!input.trim() && draftAttachments.length === 0)} 
                  className="p-2.5 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all animate-in zoom-in shadow-md disabled:bg-slate-300"
                >
                   <SendHorizontal size={20} />
                </button>
              </div>
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