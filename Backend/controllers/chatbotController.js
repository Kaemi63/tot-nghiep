const { streamText } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google'); 
const supabase = require('../config/supabaseClient');

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

exports.handleChat = async (req, res) => {
  try {
    const { messages, sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ error: "Thiếu sessionId" });
    }

    // 1. Lưu tin nhắn User (Bọc try-catch để không làm sập AI nếu DB lỗi)
    try {
      const lastUserMessage = messages[messages.length - 1].content;
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender_role: 'user',
        content: lastUserMessage
      });
    } catch (dbErr) {
      console.error("Lỗi lưu tin nhắn user:", dbErr.message);
    }

    // 2. Lấy FAQ (Bọc try-catch)
    let faqData = [];
    try {
      const { data } = await supabase.from('chatbot_faqs').select('question, answer').eq('is_active', true).limit(5);
      faqData = data || [];
    } catch (faqErr) {
      console.error("Lỗi lấy FAQ:", faqErr.message);
    }

    const systemInstruction = `Bạn là chuyên gia tư vấn thời trang Virtual Stylist. Kiến thức FAQ: ${JSON.stringify(faqData)}. Hãy trả lời tinh tế, tối giản.`;

    // 3. Gọi AI với Model chuẩn 1.5-flash
    const result = await streamText({
      model: google('gemini-1.5-flash'), 
      system: systemInstruction,
      messages: messages,
      onFinish: async ({ text }) => {
        try {
          await supabase.from('chat_messages').insert({
            session_id: sessionId,
            sender_role: 'bot',
            content: text,
          });
        } catch (e) { console.error("Lỗi lưu tin nhắn bot:", e.message); }
      },
    });

    return result.toDataStreamResponse();

  } catch (error) {
    console.error("Vercel SDK Error:", error);
    res.status(500).json({ error: "Lỗi kết nối AI: " + error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: req.user.id })
      .select()
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};