const { streamText, convertToCoreMessages } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const supabase = require('../config/supabaseClient');

// Khởi tạo Google Gemini
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * 1. TẠO SESSION MỚI (Khi nhấn "New Chat")
 */
exports.createSession = async (req, res) => {
  try {
    const userId = req.user?.id || null; // Lấy từ middleware auth nếu có

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ 
        user_id: userId,
        status: 'active' 
      })
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("Lỗi tạo session:", error.message);
    res.status(500).json({ error: error.message });
  }
};

/**
 * 2. LẤY DANH SÁCH SESSION (Hiện ở Sidebar)
 * Lấy tin nhắn đầu tiên của mỗi session để làm tiêu đề (Title)
 */
exports.getSessions = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ protect middleware

    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        started_at,
        chat_messages(content)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;

    // Format lại để lấy tin nhắn đầu tiên làm title
    const result = data.map(s => ({
      id: s.id,
      title: s.chat_messages[0]?.content?.substring(0, 35) || "Cuộc trò chuyện mới",
      date: s.started_at
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 3. LẤY CHI TIẾT LỊCH SỬ TIN NHẮN (Khi bấm vào một Session cũ)
 */
exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Map lại role cho đúng chuẩn Vercel AI SDK (user/assistant)
    const history = data.map(msg => ({
      id: msg.id,
      role: msg.sender_role === 'bot' ? 'assistant' : 'user',
      content: msg.content,
      createdAt: msg.created_at
    }));

    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 4. XỬ LÝ CHAT STREAMING & LƯU DB
 */
exports.handleChat = async (req, res) => {
  try {
    const { messages, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Thiếu sessionId" });
    }

    // 1. Lưu tin nhắn User
    try {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.role === 'user') {
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          sender_role: 'user',
          content: lastMessage.content
        });
      }
    } catch (dbErr) {
      console.error("❌ Lỗi lưu tin nhắn User:", dbErr.message);
    }

    // 2. Lấy FAQ
    let faqContext = "";
    try {
      const { data: faqs } = await supabase
        .from('chatbot_faqs')
        .select('question, answer')
        .eq('is_active', true)
        .limit(5);
      if (faqs) {
        faqContext = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
      }
    } catch (faqErr) {
      console.error("⚠️ Lỗi lấy FAQ:", faqErr.message);
    }

    const systemInstruction = `Bạn là chuyên gia tư vấn thời trang Virtual Stylist. FAQ: ${faqContext}. Trả lời tiếng Việt, sang trọng.`;

    // 3. Gọi AI
    try {
      const result = await streamText({
        model: google('gemini-2.5-flash'), // Dùng đúng bản 2.5 của bạn
        system: systemInstruction,
        messages: messages,
        onFinish: async ({ text }) => {
          try {
            await supabase.from('chat_messages').insert({
              session_id: sessionId,
              sender_role: 'bot',
              content: text,
            });
          } catch (e) { console.error("❌ Lỗi lưu bot:", e.message); }
        },
      });

      // --- PHẦN SỬA QUAN TRỌNG NHẤT: STREAM THỦ CÔNG ---
      
      // Thiết lập Header để trình duyệt hiểu đây là luồng dữ liệu (Stream)
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      // Lặp qua từng mẩu dữ liệu (chunk) mà AI trả về
      for await (const textPart of result.textStream) {
        // Gửi dữ liệu theo định dạng của Vercel AI SDK (0:"nội dung")
        // Điều này đảm bảo Frontend (ChatWindow.jsx) đọc được dữ liệu
        res.write(`0:${JSON.stringify(textPart)}\n`);
      }

      // Kết thúc luồng dữ liệu
      res.end();

    } catch (aiErr) {
      console.error("💥 LỖI GEMINI AI:", aiErr.message);
      if (!res.headersSent) {
        res.status(500).json({ error: "AI Service Error: " + aiErr.message });
      }
    }

  } catch (error) {
    console.error("🔥 LỖI HỆ THỐNG:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Server Error: " + error.message });
    }
  }
};