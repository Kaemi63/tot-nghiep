const supabase = require('../config/supabaseClient');

const getUsers = async (req, res) => {
  try {
    const { search, role } = req.query;
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (search && search.trim()) {
      query = query.or(`fullname.ilike.%${search}%,username.ilike.%${search}%,email.ilike.%${search}%`);
    }

    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    const { data, error } = await query;
    if (error) throw error;

    return res.status(200).json({ success: true, count: data.length, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error) throw error;
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, fullname, username, role, avatar_url } = req.body;

    // 1. Tạo User bên Auth (Confirm luôn email)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { fullname, role }
    });

    if (authError) throw authError;

    // 2. Chèn vào bảng Profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        fullname,
        username,
        email,
        role,
        avatar_url,
        created_at: new Date().toISOString()
      }]);

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw profileError;
    }

    return res.status(201).json({ success: true, message: 'Tạo thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, username, role, avatar_url, date_of_birth, phone } = req.body;

    const { data, error } = await supabase
      .from('profiles')
      .update({
        fullname, username, role, avatar_url, date_of_birth, phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select().single();

    if (error) throw error;
    return res.status(200).json({ success: true, message: 'Cập nhật thành công', data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    // Xóa bên Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) throw authError;

    // Xóa bên Profiles
    const { error: profileError } = await supabase.from('profiles').delete().eq('id', id);
    if (profileError) throw profileError;

    return res.status(200).json({ success: true, message: 'Xóa thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };