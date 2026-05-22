const supabase = require('../config/supabaseClient');
const crypto = require('crypto');
const https = require('https');

// =========================================================================
// 0. CẤU HÌNH THÔNG TIN MOMO SANDBOX (Sử dụng bộ key công khai từ MoMo GitHub)
// =========================================================================
const momoConfig = {
  partnerCode: "MOMO",
  accessKey: "F8BBA842ECF85",
  secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  hostname: "test-payment.momo.vn",
  path: "/v2/gateway/api/create",
  redirectUrl: "http://localhost:5173/payment-success", // Trang Frontend của bạn khi trả tiền xong
  ipnUrl: "https://your-domain.ngrok-free.app/api/payments/webhook", // Thay bằng link ngrok public của bạn
};

// Hàm Helper bằng Promise để gửi yêu cầu HTTPS Client lên MoMo (Dựa theo MoMo.js)
const sendHttpsRequest = (options, body) => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error("Lỗi parse JSON phản hồi từ MoMo"));
        }
      });
    });
    req.on('error', (e) => reject(e));
    req.write(body);
    req.end();
  });
};

// =========================================================================
// 1. TẠO GIAO DỊCH THANH TOÁN (Khách hàng nhấn Xác nhận thanh toán)
// =========================================================================
exports.createPayment = async (req, res) => {
  try {
    const { order_id, payment_method, amount } = req.body;

    // Kiểm tra dữ liệu bắt buộc đầu vào
    if (!order_id || !payment_method || !amount) {
      return res.status(400).json({ success: false, error: "Thiếu thông tin thanh toán bắt buộc" });
    }

    // Lấy thông tin đơn hàng từ bảng orders để kiểm tra tính hợp lệ
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('id, user_id, order_code')
      .eq('id', order_id)
      .single();

    if (orderErr || !order) {
      return res.status(404).json({ success: false, error: "Không tìm thấy đơn hàng liên quan" });
    }

    // Bảo mật: Đảm bảo người tạo thanh toán chính là chủ đơn hàng
    if (order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, error: "Bạn không có quyền thanh toán cho đơn hàng này" });
    }

    // Chèn lịch sử bản ghi giao dịch thanh toán mới ở trạng thái 'pending' vào bảng payments
    const { data: payment, error: payErr } = await supabase
      .from('payments')
      .insert([{
        order_id,
        payment_method: payment_method.toLowerCase(),
        amount: Number(amount),
        status: 'pending'
      }])
      .select()
      .single();

    if (payErr) throw payErr;

    // -----------------------------------------------------------------
    // XỬ LÝ NHÁNH: THANH TOÁN QUA VÍ ĐIỆN TỬ MOMO
    // -----------------------------------------------------------------
    if (payment_method.toLowerCase() === 'momo') {
      const requestId = momoConfig.partnerCode + new Date().getTime();
      const orderId = order.id; // Gửi UUID của order sang MoMo làm tham chiếu đối soát
      const orderInfo = `Thanh toán đơn hàng ${order.order_code}`;
      const extraData = ""; 
      const requestType = "captureWallet"; // Chuẩn quét mã QR ví điện tử

      // Định dạng chuỗi thô để ký (Strict format tuân thủ MoMo API v2)
      const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${momoConfig.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${momoConfig.redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
      
      // Tiến hành mã hóa sinh chữ ký bảo mật HMAC-SHA256
      const signature = crypto.createHmac('sha256', momoConfig.secretKey)
        .update(rawSignature)
        .digest('hex');

      // Tạo cấu trúc Body JSON gửi đi
      const requestBody = JSON.stringify({
        partnerCode: momoConfig.partnerCode,
        accessKey: momoConfig.accessKey,
        requestId,
        amount: amount.toString(),
        orderId,
        orderInfo,
        redirectUrl: momoConfig.redirectUrl,
        ipnUrl: momoConfig.ipnUrl,
        extraData,
        requestType,
        signature,
        lang: 'vi'
      });

      const options = {
        hostname: momoConfig.hostname,
        port: 443,
        path: momoConfig.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      // Gửi tín hiệu sang cổng thanh toán thử nghiệm của MoMo
      const momoResponse = await sendHttpsRequest(options, requestBody);

      // Nếu thành công (resultCode = 0), trả link payUrl về cho Frontend bốc đầu chuyển hướng
      if (momoResponse && momoResponse.resultCode === 0) {
        return res.status(201).json({ 
          success: true, 
          payment_id: payment.id,
          payUrl: momoResponse.payUrl 
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          error: momoResponse.message || "Không thể khởi tạo giao dịch trên MoMo" 
        });
      }
    }

    // -----------------------------------------------------------------
    // XỬ LÝ NHÁNH: CÁC PHƯƠNG THỨC KHÁC (COD, BANK_TRANSFER, VNPAY)
    // -----------------------------------------------------------------
    return res.status(201).json({ 
      success: true, 
      message: "Khởi tạo giao dịch nội bộ thành công", 
      data: payment 
    });

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// =========================================================================
// 2. WEBHOOK / IPN (MoMo tự động gọi về Backend để thông báo kết quả)
// =========================================================================
exports.handlePaymentWebhook = async (req, res) => {
  try {
    console.log("👉 Nhận được gói tin IPN Webhook tự động:", req.body);

    // Bốc các trường cốt lõi mà MoMo trả về sau khi khách thao tác quét mã xong
    const { orderId, transId, resultCode, message } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: "Thiếu dữ liệu ID đơn hàng xử lý" });
    }

    // Theo tài liệu MoMo: resultCode bằng 0 nghĩa là người dùng đã thanh toán thành công tiền
    const isSuccess = (resultCode === 0);

    // A. Cập nhật trạng thái lịch sử giao dịch ở bảng payments
    const { error: payErr } = await supabase
      .from('payments')
      .update({
        transaction_code: transId ? transId.toString() : null,
        status: isSuccess ? 'success' : 'failed',
        paid_at: isSuccess ? new Date() : null,
        response_data: req.body, // Lưu trọn vẹn JSON log để phục vụ đối soát, khiếu nại
        updated_at: new Date()
      })
      .eq('order_id', orderId);

    if (payErr) throw payErr;

    // B. Đồng bộ cập nhật trạng thái thanh toán (payment_status) của đơn hàng bên bảng orders
    const { error: orderErr } = await supabase
      .from('orders')
      .update({
        payment_status: isSuccess ? 'paid' : 'unpaid',
        updated_at: new Date()
      })
      .eq('id', orderId);

    if (orderErr) throw orderErr;

    // Trả về HTTP Status 204 hoặc 200 trống để báo cho hệ thống MoMo biết bạn đã nhận được gói tin thành công
    return res.status(200).send();

  } catch (error) {
    console.error("⚠️ Lỗi nghiêm trọng khi xử lý Webhook thanh toán:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// =========================================================================
// 3. LẤY LỊCH SỬ THANH TOÁN CỦA CÁ NHÂN USER ĐANG ĐĂNG NHẬP
// =========================================================================
exports.getMyPayments = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders(order_code, total_amount, user_id)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Lọc lại danh sách để chỉ hiển thị các hóa đơn thuộc về chính User này
    const filteredData = data.filter(p => p.orders && p.orders.user_id === req.user.id);

    return res.status(200).json({ success: true, data: filteredData });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// =========================================================================
// 4. QUẢN LÝ TOÀN BỘ GIAO DỊCH TRÊN HỆ THỐNG (Dành cho Dashboard của Admin)
// =========================================================================
exports.getAllPaymentsForAdmin = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        orders(order_code, recipient_name, total_amount)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};