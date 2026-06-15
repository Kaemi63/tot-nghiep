const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./config/supabaseClient');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/userRoutes');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/coupon');
const reviewRoutes = require('./routes/review');
const chatbotRoutes = require('./routes/chatbotRoutes');
const bannerRoutes = require('./routes/banner');
const paymentRoutes = require('./routes/payment');
const dashboardRoutes = require('./routes/dashboard');
const adminChatbotRoutes = require('./routes/adminChatbot');
const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin-chatbot', adminChatbotRoutes);
const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('any_table_name').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116' && error.message.includes('relation') === false) {
      console.error('Kết nối Supabase thất bại thực sự:', error.message);
    } else {
      console.log('Kết nối Supabase thành công!');
    }
  } catch (err) {
    console.error('Lỗi hệ thống (Có thể do sai URL hoặc Key):', err.message);
  }
};
checkSupabaseConnection();
const PORT = process.env.PORT || 3001; 

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy ổn định trên port ${PORT}`);
});

module.exports = app;