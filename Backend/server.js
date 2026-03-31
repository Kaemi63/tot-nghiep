const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const supabase = require('./src/config/supabaseClient');

require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

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
// Route Signup
app.post('/api/auth/signup', async (req, res) => {
  const { email, password, username } = req.body;

  // 1. Tạo tài khoản Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: username } }
  });

  if (authError) return res.status(400).json({ error: authError.message });

  if (data.user) {
    // Nghỉ một chút để đảm bảo Auth User đã sẵn sàng trong DB
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Insert vào profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          fullname: username, 
          username: username, 
          email: email, 
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        }
      ]);

    if (profileError) {
      console.error("Lỗi database:", profileError.message);
      return res.status(500).json({ error: "Lỗi tạo hồ sơ" });
    }
  }

  res.status(200).json({ message: "Đăng ký thành công!", user: data.user });
});
// Route Login
app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  let targetEmail = identifier;

  // Nếu không có '@', hiểu là Username -> Đi tìm Email
  if (!identifier.includes('@')) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('email') // Khớp với cột 'email' bạn vừa tạo
      .eq('username', identifier)
      .single();

    if (profile) {
      targetEmail = profile.email;
    } else {
      return res.status(404).json({ error: "Không tìm thấy Username này" });
    }
  }

  // Login bằng email cuối cùng tìm được
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: targetEmail,
    password: password,
  });

  if (authError) return res.status(401).json({ error: authError.message });
  res.status(200).json({ session: data.session, user: data.user });
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