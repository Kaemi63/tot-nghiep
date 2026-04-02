const supabase = require('../config/supabaseClient');

// --- LOGIC ĐĂNG KÝ ---
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  // 1. Tạo tài khoản Auth trong Supabase
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: username } }
  });

  if (authError) return res.status(400).json({ error: authError.message });

  if (data.user) {
    // Đợi một chút để đảm bảo Auth User đã được khởi tạo
    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. Insert thông tin bổ sung vào bảng profiles
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
      return res.status(500).json({ error: "Lỗi tạo hồ sơ người dùng" });
    }
  }

  res.status(200).json({ message: "Đăng ký thành công!", user: data.user });
};

// --- LOGIC ĐĂNG NHẬP ---
exports.login = async (req, res) => {
  const { identifier, password } = req.body;
  
  try {
    // 1. Tìm profile theo Username hoặc Email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, role, status, fullname')
      .or(`username.eq.${identifier},email.eq.${identifier}`)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Tài khoản hoặc email không tồn tại." });
    }

    // 2. Kiểm tra trạng thái (Banned/Suspended)
    if (profile.status === 'banned' || profile.status === 'suspended') {
      return res.status(403).json({ error: `Tài khoản của bạn đang bị ${profile.status}.` });
    }

    // 3. Xác thực mật khẩu qua Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: password,
    });

    if (authError) {
      return res.status(401).json({ error: "Mật khẩu không chính xác." });
    }

    // 4. Cập nhật thời gian đăng nhập cuối
    await supabase
      .from('profiles')
      .update({ 
        last_login_at: new Date().toISOString(),
        email_verified_at: data.user.email_confirmed_at 
      })
      .eq('id', data.user.id);

    // 5. Trả về kết quả
    res.status(200).json({ 
      session: data.session, 
      user: {
        id: data.user.id,
        email: data.user.email,
        role: profile.role,
        fullname: profile.fullname,
        status: profile.status
      } 
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi hệ thống khi đăng nhập." });
  }
};
// 1. Lấy thông tin Profile
exports.getProfile = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// 2. Cập nhật Thông tin
exports.updateProfile = async (req, res) => {
  const { id, fullname, phone, date_of_birth, gender } = req.body;
  
  const { error } = await supabase
    .from('profiles')
    .update({ fullname, phone, date_of_birth, gender })
    .eq('id', id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Cập nhật thông tin thành công" });
};

// 3. Đổi mật khẩu
exports.changePassword = async (req, res) => {
  const { id, currentPassword, password } = req.body;

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', id)
      .single();

    if (profileError || !profile) {
      return res.status(400).json({ error: "Không tìm thấy thông tin người dùng" });
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    });

    if (signInError) {
      return res.status(400).json({ error: "Mật khẩu hiện tại không chính xác" });
    }

    const { error: updateError } = await supabase.auth.admin.updateUserById(id, {
      password: password
    });

    if (updateError) throw updateError;

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu:", error);
    res.status(500).json({ error: "Có lỗi xảy ra trong quá trình đổi mật khẩu" });
  }
};