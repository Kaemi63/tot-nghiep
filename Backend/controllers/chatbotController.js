const { streamText, convertToCoreMessages } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const supabase = require('../config/supabaseClient');

// Khởi tạo Google Gemini
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 1. TẠO CUỘC HỘI THOẠI MỚI
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

// 2. LẤY DANH SÁCH CÁC CUỘC HỘI THOẠI (CHO SIDEBAR)
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

// 3. LẤY LỊCH SỬ TIN NHẮN CỦA 1 SESSION (ĐỔ VÀO KHUNG CHAT)
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

//4. XÓA CUỘC HỘI THOẠI
exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id; // Lấy từ middleware protect

    // Kiểm tra xem session này có thuộc về user này không để tránh xóa nhầm của người khác
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError) {
      console.error('Session lookup error:', sessionError);
      return res.status(500).json({ error: `Lỗi khi kiểm tra session: ${sessionError.message}` });
    }
    
    if (!session || session.user_id !== userId) {
      return res.status(403).json({ error: "Bạn không có quyền xóa cuộc hội thoại này" });
    }

    // Xóa tất cả tin nhắn thuộc session trước
    const { error: messagesError } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (messagesError) {
      console.error('Messages delete error:', messagesError);
      return res.status(500).json({ error: `Lỗi khi xóa tin nhắn: ${messagesError.message}` });
    }

    const { error: deleteError } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    if (deleteError) {
      console.error('Session delete error:', deleteError);
      return res.status(500).json({ error: `Lỗi khi xóa session: ${deleteError.message}` });
    }

    res.json({ message: "Đã xóa cuộc trò chuyện thành công" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: error.message });
  }
};
// 5. XỬ LÝ TIN NHẮN MỚI, GỌI AI, TRẢ VỀ STREAM
exports.handleChat = async (req, res) => {
  try {
    const { messages, sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Thiếu sessionId" });

    // 1. Lưu tin nhắn User
    try {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {
        await supabase.from('chat_messages').insert({
          session_id: sessionId, sender_role: 'user', content: lastMessage.content
        });
      }
    } catch (e) { console.error("Lỗi lưu user:", e.message); }

    // 2. THU THẬP DỮ LIỆU (Dùng cấu trúc bạn thích)
    let storeContext = "";
    try {
      const { data: sessionData } = await supabase.from('chat_sessions').select('user_id').eq('id', sessionId).single();
      const userId = sessionData?.user_id;
      
      let userContext = "";
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('fullname, gender').eq('id', userId).single();
        if (profile) {
          userContext = `Khách hàng: ${profile.fullname} | Giới tính: ${profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}`;
        }
      }

      const { data: products } = await supabase
        .from('products')
        .select(`
          name, base_price, 
          categories(name),
          product_specifications(spec_name, spec_value),
          product_variants(color, size)
        `)
        .eq('status', 'active')
        .limit(30);

      // SỬA Ở ĐÂY: Tạo bảng tra cứu chặt chẽ hơn để AI không nhầm
      const prodDetails = products?.map((p, index) => {
        const specs = p.product_specifications?.map(s => `${s.spec_name}: ${s.spec_value}`).join(' | ') || 'N/A';
        const variants = p.product_variants?.map(v => `${v.color}(${v.size})`).join(', ') || 'Liên hệ';
        return `[SP${index + 1}] Tên: ${p.name} || Giá: ${p.base_price}đ || Loại: ${p.categories?.name} || Đặc điểm: ${specs} || Kho: ${variants}`;
      }).join('\n');

      const { data: topReviews } = await supabase
        .from('reviews')
        .select('comment, rating, products(name)')
        .eq('status', 'approved')
        .gte('rating', 4)
        .limit(5);
      
      const reviewContext = topReviews?.map(r => `Khách hàng khen ${r.products?.name}: "${r.comment}"`).join('\n');

      storeContext = `
        ${userContext}
        --- BẢNG TRA CỨU SẢN PHẨM CHI TIẾT ---
        ${prodDetails}
        
        --- ĐÁNH GIÁ THỰC TẾ ---
        ${reviewContext}
      `;
    } catch (err) {
      console.error("⚠️ Lỗi thu thập dữ liệu store:", err.message);
    }

    // 3. Lấy FAQ
    let faqContext = "";
    try {
      const { data: faqs } = await supabase.from('chatbot_faqs').select('question, answer').eq('is_active', true).limit(10);
      faqContext = faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "";
    } catch (e) {}

    // 4. PROMPT SIÊU CHẶT CHẼ (Fix lỗi nhầm size/màu)
    const systemInstruction = `
      Bạn là Virtual Stylist cao cấp của FSA. Bạn làm việc dựa trên nguyên tắc: TRA CỨU TRƯỚC, TRẢ LỜI SAU.
      
      DỮ LIỆU CỬA HÀNG:
      ${storeContext}
      
      KIẾN THỨC FAQ:
      ${faqContext}
      
      QUY TẮC BẮT BUỘC:
      1. TRA CỨU CHÍNH XÁC: Khi khách hỏi về sản phẩm, bạn PHẢI tìm đúng dòng [SPx] của sản phẩm đó. Tuyệt đối không lấy thông tin Màu/Size của sản phẩm khác gán cho sản phẩm này.
      2. TRUNG THỰC: Nếu sản phẩm khách hỏi không có trong danh sách, hãy lịch sự báo là "Hiện mẫu này chưa có sẵn trong hệ thống" thay vì tự chế thông tin.
      3. CÁ NHÂN HÓA: Dựa vào giới tính khách hàng để gợi ý đồ phù hợp (Nam không gợi ý váy nữ).
      4. PHONG CÁCH: Sang trọng, tinh tế, gọi khách là "Quý khách".
      5. ĐỊNH DẠNG: Sử dụng gạch đầu dòng, xuống dòng rõ ràng.
      6. ĐÓNG VAI: Bạn là Stylist chuyên nghiệp, không bao giờ nói mình là AI.
    `;

    // 5. Gọi AI (Manual Stream)
    try {
      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: systemInstruction,
        messages: messages,
        onFinish: async ({ text }) => {
          await supabase.from('chat_messages').insert({
            session_id: sessionId, sender_role: 'bot', content: text,
          });
        },
      });

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const textPart of result.textStream) {
        const safeText = textPart.replace(/\n/g, '');
        res.write(`0:${safeText}\n`);
      }
      res.end();
    } catch (aiErr) {
      res.status(500).json({ error: aiErr.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};