const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient'); // Đảm bảo file trong config tên đúng là supabaseClient.js

// 1. Route Signup (Đường dẫn bây giờ chỉ cần là '/' vì server.js đã có /api/auth)
router.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;

  // Tạo tài khoản Auth
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: username } }
  });

  if (authError) return res.status(400).json({ error: authError.message });

  if (data.user) {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Insert vào profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: data.user.id, 
          fullname: username, 
          username: username, 
          email: email,
          created_at: data.user.created_at, 
          role: 'user',
          status: 'active',
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

// 2. Route Login (Đường dẫn bây giờ chỉ cần là '/login')
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  
  // Tìm thông tin profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, email, role, status, fullname')
    .or(`username.eq.${identifier},email.eq.${identifier}`)
    .single();

  if (profileError || !profile) {
    return res.status(404).json({ error: "Không tìm thấy người dùng này" });
  }

  if (profile.status === 'banned' || profile.status === 'suspended') {
    return res.status(403).json({ error: `Tài khoản của bạn đang bị ${profile.status}!` });
  }

  // Đăng nhập Auth
  const { data, error: authError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password: password,
  });

  if (authError) return res.status(401).json({ error: authError.message });

  // Đồng bộ thông tin
  const emailVerifiedAt = data.user.email_confirmed_at;
  await supabase
    .from('profiles')
    .update({ 
      last_login_at: new Date().toISOString(),
      email_verified_at: emailVerifiedAt 
    })
    .eq('id', data.user.id);

  res.status(200).json({ 
    session: data.session, 
    user: {
      id: data.user.id,
      email: data.user.email,
      role: profile.role,
      fullname: profile.fullname,
      status: profile.status,
      email_verified_at: emailVerifiedAt
    } 
  });
});

module.exports = router;