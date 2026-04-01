const { createClient } = require('@supabase/supabase-js');

// Khởi tạo Admin SDK với Service Role Key (Bắt buộc để có quyền Admin)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// --- HÀM CẬP NHẬT NGƯỜI DÙNG ---
exports.updateUser = async (req, res) => {
  const { id, fullname, role, username, date_of_birth, email, avatar_url } = req.body;

  try {
    // 1. Cập nhật bảng profiles (Dữ liệu hiển thị)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        fullname, 
        role, 
        username, 
        date_of_birth,
        email,       
        avatar_url,   
        updated_at: new Date() 
      })
      .eq('id', id);

    if (profileError) throw profileError;

    // 2. Cập nhật thông tin trong hệ thống Auth (Email và Role trong Metadata)
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      { 
        email: email, 
        user_metadata: { role: role } 
      }
    );

    if (authError) throw authError;

    res.status(200).json({ message: "Cập nhật thông tin thành công" });
  } catch (err) {
    console.error("Lỗi Update:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// --- HÀM XÓA NGƯỜI DÙNG (TRIỆT ĐỂ) ---
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) return res.status(400).json({ error: "Thiếu ID người dùng" });

    // BƯỚC 1: XÓA TRONG AUTH (Xóa gốc trước)
    // Lệnh này xóa quyền đăng nhập vĩnh viễn
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
    
    if (authError) {
      // Nếu không tìm thấy trong Auth, vẫn tiếp tục để xóa rác trong Profiles
      console.warn("User không tồn tại trong Auth:", authError.message);
    }

    // BƯỚC 2: XÓA TRONG PROFILES (Xóa ngọn sau)
    // Nếu bạn đã thiết lập SQL CASCADE thì dòng này có thể không cần, 
    // nhưng viết thêm để đảm bảo 100% sạch dữ liệu.
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id);

    if (profileError) throw profileError;

    res.status(200).json({ message: "Đã xóa vĩnh viễn người dùng khỏi hệ thống" });
  } catch (err) {
    console.error("Lỗi Delete:", err.message);
    res.status(400).json({ error: err.message });
  }
};