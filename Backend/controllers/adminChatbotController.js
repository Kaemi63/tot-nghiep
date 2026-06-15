const { streamText, generateObject } = require('ai');
const { createGoogleGenerativeAI } = require('@ai-sdk/google');
const supabase = require('../config/supabaseClient');
const { z } = require('zod');

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_ADMIN_KEY,
});
// 1. TẠO CUỘC HỘI THOẠI MỚI (CHO ADMIN)
exports.createAdminSession = async (req, res) => {
  try {
    const adminId = req.user?.id || null; // Lấy từ middleware auth xác thực tài khoản Admin

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ 
        user_id: adminId,
        title: 'Báo cáo phân tích mới', // Tiêu đề mặc định ban đầu
        status: 'active' 
      })
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("⚠️ Lỗi tạo admin session:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 2. LẤY DANH SÁCH CÁC CUỘC HỘI THOẠI (CHO SIDEBAR ADMIN)
exports.getAdminSessions = async (req, res) => {
  try {
    const adminId = req.user?.id;
    if (!adminId) return res.status(401).json({ error: "Chưa xác thực quyền Admin" });

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', adminId)
      // Thay 'created_at' bằng tên cột thời gian thực tế trong DB của bạn (ví dụ: 'started_at')
      .order('started_at', { ascending: false }); 

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("⚠️ Lỗi lấy danh sách session admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 2.5. ĐỔI TÊN CUỘC HỘI THOẠI
exports.updateAdminSessionTitle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const { data, error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("⚠️ Lỗi cập nhật tiêu đề session:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 3. LẤY LỊCH SỬ TIN NHẮN CỦA 1 SESSION (ĐỔ VÀO KHUNG CHAT ADMIN)
exports.getAdminMessageHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error("⚠️ Lỗi lấy lịch sử tin nhắn admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// 4. XÓA CUỘC HỘI THOẠI
exports.deleteAdminSession = async (req, res) => {
  try {
    const { id } = req.params;

    // Do cấu hình ON DELETE CASCADE ở bảng chat_messages, khi xóa session thì tin nhắn tự động bay màu theo
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ success: true, message: "Đã xóa cuộc hội thoại thành công" });
  } catch (error) {
    console.error("⚠️ Lỗi xóa cuộc hội thoại admin:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.handleAdminAnalyticsChat = async (req, res) => {
  try {
    // Lấy thêm sessionId từ body gửi lên để xác định phiên chat dữ liệu
    const { messages, sessionId } = req.body; 

    // Lấy tin nhắn cuối cùng của Admin để đưa vào AI phân tích ý định
    const lastAdminMessage = messages
      .slice()
      .reverse()
      .find((m) => m.role === 'user' || m.role === 'admin')?.content || '';

    // TỰ ĐỘNG LƯU VẾT TIN NHẮN ĐẦU VÀO CỦA ADMIN VÀO DATABASE
    if (sessionId && sessionId !== 'temporary-popup-chat') {
      try {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'user') {
          await supabase.from('chat_messages').insert({
            session_id: sessionId,
            sender_role: 'admin',
            content: lastMessage.content || '',
            metadata: null
          });
        }
      } catch (e) {
        console.error("⚠️ Lỗi lưu vết tin nhắn của Admin vào DB:", e.message);
      }
    }
    // BƯỚC 1: AI PHÂN TÍCH Ý ĐỊNH  & CƠ CHẾ DỰ PHÒNG CHỐNG NGHẼN API
    let intentParams = { isGeneralGreeting: true };
    
    const analyticsKeywords = /doanh thu|bao cao|thong ke|tai chinh|bieu do|san pham|hot|trend|ban chay|kinh doanh|loi nhuan|tien/i;
    const cleanMessage = lastAdminMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const cleanKeywords = /doanh thu|bao cao|thong ke|tai chinh|bieu do|san pham|ban chay|kinh doanh|loi nhuan/i;

    try {
      const intentResult = await generateObject({
        model: google('gemini-2.5-flash'),
        schema: z.object({
          isGeneralGreeting: z.boolean().describe(
            'True nếu câu chat chỉ là chào hỏi xã giao (hello, hi, chào bạn), test hệ thống, hỏi thăm ngoài lề và KHÔNG CHỨA nhu cầu phân tích số liệu, thống kê hay dự báo doanh thu.'
          )
        }),
        prompt: `Hãy phân tích câu chat này của Admin quản trị hệ thống để xác định ý định: "${lastAdminMessage}"`,
      });
      intentParams = intentResult.object;
    } catch (extractErr) {
      console.warn("⚠️ AI Tầng 1 quá tải (High Demand). Kích hoạt bộ lọc từ khóa Regex dự phòng...");
      // Nếu lỗi API xảy ra, hệ thống tự động quét từ khóa để ép AI chạy đúng nhánh dữ liệu
      if (analyticsKeywords.test(lastAdminMessage) || cleanKeywords.test(cleanMessage)) {
        console.log("🎯 Khớp từ khóa phân tích! Ép luồng xử lý số liệu.");
        intentParams.isGeneralGreeting = false;
      } else {
        intentParams.isGeneralGreeting = true;
      }
    }

    let storeContext = "";
    let currentMatchedRevenueData = null; // Biến ngoại cục hứng data để nén snapshot vào metadata lúc sau

    // BƯỚC 2: PHÂN NHÁNH TRUY VẤN DỮ LIỆU
    if (intentParams.isGeneralGreeting) {
      // Nhánh 1: Chào hỏi phiếm -> Không truy vấn nặng DB, chỉ tạo ngữ cảnh ngắn gọn
      storeContext = `
        --- NGỮ CẢNH HỆ THỐNG ---
        Admin đang chào hỏi giao tiếp xã giao hoặc kiểm tra tín hiệu kết nối hệ thống (Ví dụ: hello, hi, chào bạn).
        Hãy đóng vai CFO phản hồi lại một cách ngắn gọn, lịch sự, chuyên nghiệp. Chủ động hỏi xem Admin có cần hỗ trợ trích xuất báo cáo doanh thu, phân tích sản phẩm hot-trend hay lập mô hình dự báo tài chính tháng 6, 7, 8 không.
      `;
    } else {
      // Nhánh 2: Thực sự hỏi số liệu -> Chạy toàn bộ thuật toán phân tích nâng cao
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount, created_at')
        .neq('order_status', 'cancelled')
        .eq('payment_status', 'paid');

      if (ordersError) throw ordersError;

      const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
      const totalOrders = orders?.length || 0;
      const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

      const yearlyRevenue = {};
      const quarterlyRevenue = {};
      const monthlyRevenue = {};

      orders?.forEach(order => {
        const date = new Date(order.created_at);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const quarter = Math.ceil(month / 3);

        yearlyRevenue[year] = (yearlyRevenue[year] || 0) + Number(order.total_amount);
        const quarterKey = `${year}-Q${quarter}`;
        quarterlyRevenue[quarterKey] = (quarterlyRevenue[quarterKey] || 0) + Number(order.total_amount);
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + Number(order.total_amount);
      });

      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select(`
          total, quantity, product_id, product_name,
          orders!inner(created_at, order_status, payment_status),
          products(
            categories(name),
            brands(name)
          )
        `)
        .neq('orders.order_status', 'cancelled')
        .eq('orders.payment_status', 'paid');

      if (itemsError) throw itemsError;

      const categorySummary = {};
      const brandSummary = {};
      const productSummary = {};

      orderItems?.forEach(item => {
        const total = Number(item.total);
        const qty = Number(item.quantity);
        const prodInfo = item.products;
        const orderDate = new Date(item.orders.created_at);
        const monthStr = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;

        if (prodInfo) {
          if (prodInfo.categories?.name) {
            const catName = prodInfo.categories.name;
            if (!categorySummary[catName]) categorySummary[catName] = { revenue: 0, quantity: 0 };
            categorySummary[catName].revenue += total;
            categorySummary[catName].quantity += qty;
          }
          if (prodInfo.brands?.name) {
            const brandName = prodInfo.brands.name;
            if (!brandSummary[brandName]) brandSummary[brandName] = { revenue: 0, quantity: 0 };
            brandSummary[brandName].revenue += total;
            brandSummary[brandName].quantity += qty;
          }
        }

        if (item.product_name) {
          const prodName = item.product_name;
          if (!productSummary[prodName]) {
            productSummary[prodName] = { total_revenue: 0, total_quantity: 0, timeline_trends: {} };
          }
          productSummary[prodName].total_revenue += total;
          productSummary[prodName].total_quantity += qty;
          productSummary[prodName].timeline_trends[monthStr] = (productSummary[prodName].timeline_trends[monthStr] || 0) + total;
        }
      });

      const sortedProductsAnalysis = Object.keys(productSummary).map(name => ({
        product_name: name,
        total_revenue: productSummary[name].total_revenue,
        total_quantity: productSummary[name].total_quantity,
        monthly_distribution: productSummary[name].timeline_trends
      })).sort((a, b) => b.total_revenue - a.total_revenue);

      const top7Products = sortedProductsAnalysis.slice(0, 7);

      // ĐÓNG GÓI DỮ LIỆU TINH GỌN PHỤC VỤ LƯU METADATA LÚC SAU
      currentMatchedRevenueData = {
        total_revenue: totalRevenue,
        total_orders: totalOrders,
        average_order_value: averageOrderValue,
        top_products: top7Products.map(p => ({ name: p.product_name, revenue: p.total_revenue }))
      };

      // Đóng gói siêu context báo cáo tài chính
      storeContext = `
      DƯỚI ĐÂY LÀ SỐ LIỆU DOANH THU THỰC TẾ TRÍCH XUẤT ĐỒNG BỘ TỪ DASHBOARD:
      1. SỐ LIỆU TỔNG QUAN KINH DOANH:
      - Tổng doanh thu tích lũy: ${totalRevenue.toLocaleString('vi-VN')} VND | Tổng đơn: ${totalOrders} | AOV: ${averageOrderValue.toLocaleString('vi-VN')} VND
      2. BIẾN ĐỘNG DOANH THU THEO THỜI GIAN VĨ MÔ:
      - Theo Năm: ${JSON.stringify(yearlyRevenue)}
      - Theo Quý: ${JSON.stringify(quarterlyRevenue)}
      - Theo Tháng: ${JSON.stringify(monthlyRevenue)}
      3. DOANH THU THEO DANH MỤC: ${JSON.stringify(categorySummary)}
      4. DOANH THU THEO THƯƠNG HIỆU: ${JSON.stringify(brandSummary)}
      5. TOP SẢN PHẨM HOT-TRENDS: ${JSON.stringify(top7Products)}

      HƯỚNG DẪN BIỆN PHÁP PHÂN TÍCH VÀ QUY TẮC PHẢN HỒI BẮT BUỘC:
      - Hãy làm một báo cáo tài chính đầy đủ, so sánh danh mục/thương hiệu cao - thấp.
      - Ứng dụng mô hình dự báo đưa ra con số VND cụ thể cho từng tháng đơn lẻ: Tháng 6/2026, Tháng 7/2026, Tháng 8/2026. Chỉ rõ lý do biến động.
      - Đưa ra dự báo mặt hàng hứa hẹn sẽ tiếp tục hot dựa trên xu hướng thực tế và đề xuất chiến lược kinh doanh hành động cho Admin.
      `;
    }

    // BƯỚC 3: SYSTEM PROMPT & STREAM TEXT TRẢ PHẢN HỒI KÈM LƯU BOT VÀO METADATA
    const systemPrompt = `
Bạn là một Giám đốc Tài chính (CFO) kiêm Chuyên gia Phân tích Dữ liệu Kinh doanh (Business Intelligence AI) cấp cao của chuỗi thời trang cao cấp FSA.
Nhiệm vụ của bạn là đồng hành và hỗ trợ ban quản trị phân tích, vận hành dòng tiền kinh doanh một cách hiệu quả.

Thời gian hiện tại của hệ thống: Tháng 06 năm 2026.

DỮ LIỆU ĐƯỢC PHÂN PHÁP ĐỘNG:
${storeContext}

QUY TẮC PHẢN HỒI:
1. Nếu rơi vào tình huống khách chào hỏi thông thường, hãy tương tác lịch sự ngắn gọn, sẵn sàng tác nghiệp. Không tự ý bung báo cáo khi chưa được yêu cầu.
2. Nếu phân tích dữ liệu, bắt buộc phải dùng số tiền định dạng VND rõ ràng (Ví dụ: 50.000.000 VND), trình bày khoa học, tiêu đề rõ ràng, gạch đầu dòng tường minh. Giọng điệu chuyên nghiệp, tự tin.
`;

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: messages,
      onFinish: async ({ text }) => {
        // Nếu không có sessionId hoặc là chat tạm thời thì bỏ qua không lưu DB
        if (!sessionId || sessionId === 'temporary-popup-chat') return;
        
        try {
          // TỰ ĐỘNG NÉN SNAPSHOT DOANH THU VÀO CỘT METADATA KHI BOT TRẢ LỜI XONG
          await supabase.from('chat_messages').insert({
            session_id: sessionId, 
            sender_role: 'bot', 
            content: text,
            metadata: {
              analytics_context: {
                is_greeting: intentParams.isGeneralGreeting,
                snapshot_summary: currentMatchedRevenueData // Đóng băng số liệu kinh doanh đúng thời điểm chat
              }
            }
          });
          console.log("✅ Đã lưu bot admin message kèm metadata đóng băng dữ liệu tài chính!");
        } catch (dbErr) { 
          console.error("⚠️ Thất bại khi lưu bot admin message kèm metadata:", dbErr.message); 
        }
      },
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const textPart of result.textStream) {
      res.write(`0:${JSON.stringify(textPart)}\n`); 
    }
    res.end();

  } catch (error) {
    console.error("⚠️ Lỗi tại luồng AI Analytics Dashboard:", error.message);
    res.status(500).json({ error: error.message });
  }
};