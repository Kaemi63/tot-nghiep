module.exports = {
    partnerCode: "MOMO",
    accessKey: "F8BBA842ECF85",
    secretKey: "K951B6PE1waDMi640xX08PD3vg6EkVlz",
    hostname: "test-payment.momo.vn",
    path: "/v2/gateway/api/create",
    // Chỉnh lại link trỏ về Frontend và Backend của bạn
    redirectUrl: "http://localhost:5173/payment-success", // Trang Frontend xử lý sau khi khách trả tiền xong
    ipnUrl: "https://your-domain.ngrok-free.app/api/payments/webhook", // Link Backend nhận log từ MoMo (Phải dùng ngrok)
};