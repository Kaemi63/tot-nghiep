const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./config/supabaseClient');
const productRoutes = require('./routes/product');
const adminRoutes = require('./routes/adminRoutes');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/coupon');
const reviewRoutes = require('./routes/review');

const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
//API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    // Lấy tin nhắn
    const lastMessage = messages[messages.length - 1].content;
    
    console.log("User hỏi:", lastMessage);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Thiết lập Header cho Streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');

    const result = await model.generateContentStream(lastMessage);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
      res.write(chunkText);
    }

    res.end();
  } catch (error) {
    console.error("Lỗi Backend:", error);
    res.status(500).send(error.message);
  }
});

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
app.listen(PORT, () => console.log(`Server AI đang chạy tại cổng ${PORT}`));