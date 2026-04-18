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
    if (!sessionId) return res.status(400).json({ error: "Thiếu sessionId" });

    // 1. Lưu tin nhắn User (Giữ nguyên)
    try {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {
        await supabase.from('chat_messages').insert({
          session_id: sessionId, sender_role: 'user', content: lastMessage.content
        });
      }
    } catch (e) { console.error("Lỗi lưu user:", e.message); }

    // 2. THU THẬP DỮ LIỆU ĐA CHIỀU (Multi-table Context)
    let storeContext = "";
    try {
      // A. Lấy thông tin người dùng (Để cá nhân hóa theo giới tính)
      const { data: sessionData } = await supabase.from('chat_sessions').select('user_id').eq('id', sessionId).single();
      const userId = sessionData?.user_id;
      
      let userContext = "";
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('fullname, gender').eq('id', userId).single();
        if (profile) {
          userContext = `Khách hàng là ${profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'không rõ giới tính'}, tên là ${profile.fullname}.`;
        }
      }

      // B. Lấy sản phẩm + Danh mục + Thông số kỹ thuật (Specifications)
      // Chúng ta lấy sản phẩm và join với bảng category
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

      const prodDetails = products?.map(p => {
        const specs = p.product_specifications?.map(s => `${s.spec_name}: ${s.spec_value}`).join(', ') || 'Không có thông số';
        const variants = p.product_variants?.map(v => `${v.color} (${v.size})`).join(', ') || 'Liên hệ để biết size/màu';
        return `- ${p.name} | Giá: ${p.base_price}đ | Loại: ${p.categories?.name} | Chi tiết: ${specs} | Màu/Size: ${variants}`;
      }).join('\n');

      // C. Lấy các đánh giá tích cực (Reviews) để AI dùng làm lời chứng thực
      const { data: topReviews } = await supabase
        .from('reviews')
        .select('comment, rating, products(name)')
        .eq('status', 'approved')
        .gte('rating', 4)
        .limit(5);
      
      const reviewContext = topReviews?.map(r => `Khách hàng khen ${r.products?.name}: "${r.comment}" (${r.rating} sao)`).join('\n');

      storeContext = `
        THÔNG TIN KHÁCH HÀNG: ${userContext}
        DANH SÁCH SẢN PHẨM CHI TIẾT:
        ${prodDetails}
        
        ĐÁNH GIÁ TỪ KHÁCH HÀNG KHÁC:
        ${reviewContext}
      `;
    } catch (err) {
      console.error("⚠️ Lỗi thu thập dữ liệu store:", err.message);
    }

    // 3. Lấy FAQ (Giữ nguyên)
    let faqContext = "";
    try {
      const { data: faqs } = await supabase.from('chatbot_faqs').select('question, answer').eq('is_active', true).limit(10);
      faqContext = faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "";
    } catch (e) {}

    // 4. XÂY DỰNG PROMPT "SIÊU TRỢ LÝ"
    const systemInstruction = `
      Bạn là Virtual Stylist cao cấp của FSA. Bạn không chỉ là chatbot, bạn là một chuyên gia thời trang.
      
      DỮ LIỆU CỬA HÀNG (SẢN PHẨM, GIÁ, CHẤT LIỆU, SIZE):
      ${storeContext}
      
      KIẾN THỨC FAQ:
      ${faqContext}
      
      NHIỆM VỤ CỦA BẠN:
      1. CÁ NHÂN HÓA: Dựa vào thông tin khách hàng (giới tính), hãy gợi ý sản phẩm phù hợp. Nếu khách là Nam, đừng gợi ý váy nữ.
      2. CHI TIẾT: Khi giới thiệu sản phẩm, hãy nêu rõ chất liệu (từ specifications) và các màu sắc/size hiện có (từ variants).
      3. THUYẾT PHỤC: Sử dụng các đánh giá thực tế từ khách hàng khác để tăng niềm tin.
      4. TƯ VẤN PHỐI ĐỒ: Nếu khách hỏi về một sản phẩm, hãy gợi ý thêm 1-2 sản phẩm khác trong store để phối thành một bộ (Outfit).
      5. PHONG CÁCH: Trả lời sang trọng, tinh tế, lịch sự (Sử dụng: Quý khách, Tinh tế, Đẳng cấp).
      6. ĐỊNH DẠNG: Sử dụng dấu xuống dòng, gạch đầu dòng để câu trả lời rõ ràng, không viết thành khối văn bản.
      7. HẠN CHẾ: Nếu khách hỏi về sản phẩm không có trong store, hãy lịch sự từ chối và gợi ý họ xem qua các sản phẩm khác phù hợp. 
      Đừng bao giờ nói rằng bạn không biết hoặc không có thông tin. Hãy luôn cố gắng đưa ra câu trả lời dựa trên dữ liệu bạn có.
      Đừng bao giờ nói về size hay mau không có sẵn, hãy gợi ý khách liên hệ để biết thêm chi tiết. 
      Đừng bao giờ đề cập đến việc bạn là một AI, hãy luôn đóng vai một stylist chuyên nghiệp.
    `;

    // 5. Gọi AI (Manual Stream cho Express)
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
        res.write(`0:${JSON.stringify(textPart)}\n`);
      }
      res.end();
    } catch (aiErr) {
      res.status(500).json({ error: aiErr.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};