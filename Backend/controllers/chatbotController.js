const { streamText, convertToCoreMessages,generateObject } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const supabase = require('../config/supabaseClient');
const { z } = require('zod');

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
    const userId = req.user.id;

    const { data, error } = await supabase
      .from('chat_sessions')
      .select(`
        id,
        title,
        started_at,
        chat_messages(content)
      `)
      .eq('user_id', userId)
      .order('started_at', { ascending: false });

    if (error) throw error;

    const result = data.map(s => {
      let firstContent = s.chat_messages[0]?.content;
      if (typeof firstContent === 'string') {
        try {
          const parsed = JSON.parse(firstContent);
          firstContent = parsed?.content ?? firstContent;
        } catch {
          // ignore parse error
        }
      }

      return {
        id: s.id,
        title: s.title || firstContent?.substring(0, 35) || "Cuộc trò chuyện mới",
        date: s.started_at
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2.5. ĐỔI TÊN CUỘC HỘI THOẠI
exports.renameSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { title } = req.body;
    const userId = req.user.id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Tên không được để trống' });
    }

    // Kiểm tra session thuộc về user này
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('user_id')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Không tìm thấy cuộc hội thoại' });
    }
    if (session.user_id !== userId) {
      return res.status(403).json({ error: 'Bạn không có quyền đổi tên cuộc hội thoại này' });
    }

    const { error: updateError } = await supabase
      .from('chat_sessions')
      .update({ title: title.trim() })
      .eq('id', sessionId);

    if (updateError) throw updateError;

    res.json({ message: 'Đã đổi tên thành công', title: title.trim() });
  } catch (error) {
    console.error('Rename session error:', error);
    res.status(500).json({ error: error.message });
  }
};

const parseChatMessageContent = (content) => {
  if (typeof content !== 'string') return content;
  try {
    return JSON.parse(content);
  } catch {
    return content;
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

    const history = data.map(msg => {
      let content = msg.content;
      let attachments = undefined;

      const parsed = parseChatMessageContent(msg.content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        attachments = parsed.attachments;
        content = parsed.content ?? '';
      }

      return {
        id: msg.id,
        role: msg.sender_role === 'bot' ? 'assistant' : 'user',
        content,
        attachments,
        createdAt: msg.created_at,
      };
    });

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

exports.handleChat = async (req, res) => {
  try {
    const { messages, sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Thiếu sessionId" });

    try {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.role === 'user') {

        // Cấu hình vật phẩm đính kèm thành object metadata
        const userMetadata = lastMessage.attachments ? {
          attachments: lastMessage.attachments.map(({ type, filename }) => ({ type, filename }))
        } : null;
      
        await supabase.from('chat_messages').insert({
          session_id: sessionId,
          sender_role: 'user',
          content: lastMessage.content || '', // Chỉ lưu text thuần của khách
          metadata: userMetadata // Đẩy object/json vào đây
        });
      }
    } catch (e) { 
      console.error("⚠️ Lỗi lưu tin nhắn user:", e.message); 
    }

    // Lấy tin nhắn cuối cùng của khách để đưa vào AI bóc tách
    const lastUserMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user')?.content || '';

    // 3. BƯỚC 1: AI BÓC TÁCH THAM SỐ (DỰA VÀO HỆ THỐNG SLUG THỰC TẾ)
    let params = { categorySlug: null, brandSlug: null, size: null, feature: null, isGeneralGreeting: true };
    
    try {
      const extractResult = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          categorySlug: z.string().nullable().describe(
            'Khớp nhu cầu khách với 1 trong các SLUG danh mục viết thường sau: loafers, men-shoes, sneakers, oxfords-derbies, knitwear, fragrance, leather-goods, coats-jackets. Nếu không khớp thì để null.'
          ),
          brandSlug: z.string().nullable().describe(
            'Khớp thương hiệu khách nhắc đến với SLUG viết thường sau: loro-piana, brioni, hermes, brunello-cucinelli, bottega-veneta, the-row, zegna. Nếu không khớp thì để null.'
          ),
          size: z.string().nullable().describe(
            'Kích thước sản phẩm dưới dạng chuỗi (Ví dụ: S, M, L, XL hoặc số "35", "36", "41", "42" nếu là giày).'
          ),
          feature: z.string().nullable().describe(
            'Các đặc điểm, nhu cầu khác của khách viết bằng tiếng Việt không dấu (Ví dụ: chay bo, em chan, thu cong, da be togo).'
          ),
          isGeneralGreeting: z.boolean().describe(
            'True nếu câu chat chỉ là chào hỏi xã giao, hỏi địa chỉ shop, thời gian mở cửa, bàn luận ngoài lề và KHÔNG CHỨA nhu cầu tìm xem sản phẩm cụ thể.'
          )
        }),
        prompt: `Bạn là trợ lý ảo cao cấp chuyên trích xuất thực thể. Hãy phân tích câu chat này của khách để điền vào phiếu thông tin dữ liệu: "${lastUserMessage}"`,
      });
      params = extractResult.object;
      console.log(" Kết quả AI bóc tách JSON:", JSON.stringify(params, null, 2));
    } catch (extractErr) {
      console.error("Lỗi bóc tách tham số ở Bước 1:", extractErr.message);
    }

    // 4. BƯỚC 2: TRUY VẤN DYNAMIC SQL DƯỚI DATABASE (TỐI ƯU !INNER ĐỘNG)
    let storeContext = "";
    try {
      // Thu thập thông tin khách hàng nền
      const { data: sessionData } = await supabase.from('chat_sessions').select('user_id').eq('id', sessionId).single();
      const userId = sessionData?.user_id;
      let userContext = "";
      if (userId) {
        const { data: profile } = await supabase.from('profiles').select('fullname, gender').eq('id', userId).single();
        if (profile) {
          userContext = `Khách hàng: ${profile.fullname} | Giới tính: ${profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'}\n`;
        }
      }
      let reviewContext = "Hiện chưa có đánh giá nào nổi bật cho nhóm sản phẩm này.";
      try {
        const { data: topReviews } = await supabase
          .from('reviews')
          .select('comment, rating, products(name)')
          .eq('status', 'approved')
          .gte('rating', 4)
          .limit(5);
        
        if (topReviews && topReviews.length > 0) {
          reviewContext = topReviews.map(r => `Khách hàng khen sản phẩm "${r.products?.name}": "${r.comment}" (${r.rating}⭐)`).join('\n');
        }
      } catch (revErr) {
        console.error("⚠️ Lỗi lấy dữ liệu reviews:", revErr.message);
      }
      if (params.isGeneralGreeting) {
        // Nhánh xử lý khi khách chat nói chuyện phiếm/chào hỏi
        storeContext = `
        ${userContext}
        --- NGỮ CẢNH --- Khách hàng đang giao tiếp xã giao, hỏi thông tin chung hoặc chào hỏi. Hãy đóng vai một Virtual Stylist cao cấp chào đón họ nồng nhiệt và gợi ý họ tham khảo các bộ sưu tập mới của cửa hàng.
        --- ĐÁNH GIÁ NỔI BẬT TẠI CỬA HÀNG ---
        ${reviewContext}`;
      } else {
        // Logic tối ưu !inner động: Chỉ kích hoạt INNER JOIN lọc cứng khi AI thực sự bắt được slug từ câu chat
        const hasCategory = !!params.categorySlug;
        const hasBrand = !!params.brandSlug;

        const categoryJoin = hasCategory ? 'categories!inner(name, slug)' : 'categories(name, slug)';
        const brandJoin = hasBrand ? 'brands!inner(name, slug)' : 'brands(name, slug)';

        let query = supabase
          .from('products')
          .select(`
            name, base_price,
            ${categoryJoin}, 
            ${brandJoin},
            product_specifications(spec_name, spec_value),
            product_variants(color, size)
          `)
          .eq('status', 'active');

        // Áp điều kiện lọc chính xác theo cấu trúc địa chỉ bảng phụ
        if (hasCategory) {
          query = query.eq('categories.slug', params.categorySlug);
        }
        if (hasBrand) {
          query = query.eq('brands.slug', params.brandSlug);
        }

        // Thực thi quét dữ liệu giới hạn 10 sản phẩm khớp nhất
        const { data: matchedProducts } = await query.limit(10);

        if (matchedProducts && matchedProducts.length > 0) {
          // Chuẩn hóa mảng dữ liệu thô thành chuỗi văn bản cho AI dễ đọc scannable
          const prodDetails = matchedProducts.map((p, index) => {
            const specs = p.product_specifications?.map(s => `${s.spec_name}: ${s.spec_value}`).join(' | ') || 'N/A';
            const variants = p.product_variants?.map(v => `${v.color}(${v.size})`).join(', ') || 'Liên hệ';
            return `[SP${index + 1}] Tên: ${p.name} || Giá: ${p.base_price}đ || Danh mục: ${p.categories?.name} || Thương hiệu: ${p.brands?.name || 'FSA'} || Đặc điểm: ${specs} || Kho hàng: ${variants}`;
          }).join('\n');

          storeContext = `
            ${userContext}
            --- DANH SÁCH SẢN PHẨM KHỚP KHỎA MÃN TRUY VẤN ---
            ${prodDetails}
            --- ĐÁNH GIÁ THỰC TẾ TỪ CÁC KHÁCH HÀNG TRƯỚC ĐÂY ---
            ${reviewContext}
            --- YÊU CẦU ĐỐI CHIẾU CỦA KHÁCH ---
            - Thương hiệu mong muốn: ${params.brandSlug || 'Khách chưa chọn cụ thể'}
            - Kích thước mong muốn (Size): ${params.size || 'Khách chưa chọn cụ thể'}
            - Đặc điểm yêu cầu thêm: ${params.feature || 'Không có'}
            
            --- HƯỚNG DẪN BẮT BUỘC CHO STYLIST ---
            Bạn hãy kiểm tra kỹ kho hàng của các [SPx] ở trên. 
            Nếu có sản phẩm trùng khớp hoàn toàn với hãng và size khách hỏi, hãy giới thiệu nồng nhiệt và hướng dẫn phối đồ. 
            Nếu sản phẩm hiện có bị thiếu size hoặc lệch hãng khách cần, hãy trung thực thông báo tình hình kho hiện tại, giới thiệu các mẫu sẵn có ở trên và khéo léo hỏi xem Quý khách có muốn cân nhắc các lựa chọn này không.
          `;
        } else {
          // Luồng dự phòng (Fallback) khi thực sự hết hàng
          const { data: fallbackProducts } = await supabase.from('products').select('name, base_price, categories(name)').eq('status', 'active').limit(5);
          const fallbackDetails = fallbackProducts?.map(p => `- ${p.name} (${p.base_price}đ - Thuộc nhóm: ${p.categories?.name})`).join('\n') || '';

          storeContext = `
            ${userContext}
            --- THÔNG BÁO HỆ THỐNG KHO --- 
            Hiện tại các dòng sản phẩm thuộc danh mục slug "${params.categorySlug || ''}" hoặc thương hiệu slug "${params.brandSlug || ''}" mà khách tìm kiếm đang tạm thời hết hàng tại chi nhánh.
            Hãy lịch sự cáo lỗi với Quý khách và chủ động điều hướng họ tham khảo qua một vài siêu phẩm thiết kế cao cấp khác đang rất sẵn hàng tại store:
            ${fallbackDetails}
            --- ĐÁNH GIÁ CHUNG TẠI STORE ---
            ${reviewContext}
          `;
        }
      }
    } catch (err) {
      console.error("⚠️ Lỗi truy vấn hoặc xử lý dữ liệu ở Bước 2:", err.message);
    }

    // Lấy dữ liệu FAQ
    let faqContext = "";
    try {
      const { data: faqs } = await supabase.from('chatbot_faqs').select('question, answer').eq('is_active', true).limit(5);
      faqContext = faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n") || "";
    } catch (e) {}

    // 5. BƯỚC 3: SYSTEM INSTRUCTION & KHỞI CHẠY LUỒNG STREAM TEXT
    const systemInstruction = `
      Bạn là Virtual Stylist cao cấp của thương hiệu thời trang FSA. Bạn làm việc dựa trên nguyên tắc: TRA CỨU TRƯỚC, TRẢ LỜI SAU.
      
      DỮ LIỆU CỬA HÀNG ĐƯỢC CẤP TỪ DATABASE BIẾN ĐỘNG:
      ${storeContext}
      
      KIẾN THỨC NỀN FAQ:
      ${faqContext}
      
      QUY TẮC PHỤC VỤ BẮT BUỘC:
      1. TRA CỨU CHÍNH XÁC: Bạn chỉ được phép tư vấn các thông tin (Giá, Màu sắc, Size số) có xuất hiện tường minh trong các dòng [SPx] thuộc dữ liệu cửa hàng phía trên. Tuyệt đối không tự bịa ra thông số ngoài đời thực.
      2. TRUNG THỰC: Nếu hệ thống báo kho hàng trống hoặc hết hàng, hãy lịch sự thông báo thay vì cố tình lấp liếm dữ liệu.
      3. PHONG CÁCH: Sang trọng, đẳng cấp, tinh tế. Luôn gọi khách hàng là "Quý khách". Trình bày thông tin scannable, rõ ràng bằng các gạch đầu dòng và có khoảng xuống dòng hợp lý.
      4. ĐÓNG VAI: Bạn là một chuyên viên tư vấn thời trang thực thụ bằng xương bằng thịt, không bao giờ được xưng hô mình là AI, mô hình ngôn ngữ hay Chatbot.
    `;

    try {
      // Chuẩn hóa mảng tin nhắn lịch sử và xử lý tệp đính kèm (Giữ nguyên logic gốc của bạn)
      const formattedMessages = messages.map((msg) => {
        const attachmentsText = msg.attachments?.length
          ? msg.attachments.map((att) => `- [${att.type}] ${att.filename}`).join('\n')
          : '';

        const content = msg.attachments?.length
          ? msg.content
            ? `${msg.content}\n\nCác tệp đính kèm:\n${attachmentsText}`
            : `Các tệp đính kèm:\n${attachmentsText}`
          : msg.content;

        return { role: msg.role, content };
      });

      // Gọi streamText trả kết quả trực tiếp từ cấu hình mẫu google của bạn
      const result = await streamText({
        model: google('gemini-2.5-flash'),
        system: systemInstruction,
        messages: formattedMessages,
        onFinish: async ({ text }) => {
          if (sessionId === 'temporary-popup-chat') return;
          try {
            // Tự động lưu tin nhắn phản hồi của Bot kèm metadata bóc tách
            await supabase.from('chat_messages').insert({
              session_id: sessionId, 
              sender_role: 'bot', 
              content: text,
              metadata: {
                extracted_parameters: {
                  categorySlug: params.categorySlug,
                  brandSlug: params.brandSlug,
                  size: params.size,
                  feature: params.feature,
                  isGeneralGreeting: params.isGeneralGreeting
                }
              }
            });
          } catch (dbErr) { 
            console.error("⚠️ Lỗi lưu bot message:", dbErr.message); 
          }
        },
      });

      // Thiết lập Header chuẩn luồng stream chunked truyền tải dữ liệu thời gian thực
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Transfer-Encoding', 'chunked');

      for await (const textPart of result.textStream) {
        res.write(`0:${JSON.stringify(textPart)}\n`); 
      }
      res.end();

    } catch (aiErr) {
      console.error("Lỗi tại luồng Stream AI:", aiErr.message);
      res.status(500).json({ error: aiErr.message });
    }

  } catch (error) {
    console.error("Lỗi toàn cục hệ thống tại handleChat:", error);
    res.status(500).json({ error: error.message });
  }
};