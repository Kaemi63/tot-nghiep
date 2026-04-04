import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

// Import các thành phần con
import AdminSidebar from '../../components/UserManagement/AdminSideBar';
import UserHeader from '../../components/UserManagement/UserHeader';
import UserFilters from '../../components/UserManagement/UserFilters';
import UserTable from '../../components/UserManagement/UserTable';
import UserEditModal from '../../components/UserManagement/UserEdit';

const UserManagement = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({
    id: '', fullname: '', username: '', email: '', role: '', date_of_birth: '', avatar_url: ''
  });

  // 1. Lấy danh sách (Trực tiếp từ Supabase)
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase.from('profiles').select('*');
      if (searchTerm) {
        query = query.or(`fullname.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleOpenEdit = (user) => {
    setEditingUser({ ...user });
    setIsEditModalOpen(true);
  };

  // 2. Logic Cập nhật (Qua Backend)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    const savingToast = toast.loading('Đang lưu thay đổi...');
    try {
      const response = await fetch('http://localhost:3001/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Lỗi cập nhật");

      toast.success("Cập nhật thành công!", { id: savingToast });
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.message, { id: savingToast });
    }
  };

  const handleDeleteUser = async (userId) => {
  if (!window.confirm("Bạn có chắc chắn muốn xóa vĩnh viễn người dùng này?")) return;

  const deletingToast = toast.loading('Đang xử lý xóa...');
  try {
    const response = await fetch(`http://localhost:3001/api/admin/delete-user/${userId}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Lỗi không xác định");
    }

    toast.success(result.message, { id: deletingToast });
    
    // RẤT QUAN TRỌNG: Gọi lại hàm lấy danh sách để F5 giao diện
    fetchUsers(); 
  } catch (err) {
    toast.error("Không thể xóa: " + err.message, { id: deletingToast });
  }
};

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <AdminSidebar activePage="users" onLogout={onLogout} />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <UserHeader />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Quản lý người dùng</h1>
            
            <UserFilters 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              roleFilter={roleFilter} 
              setRoleFilter={setRoleFilter} 
              onSearch={fetchUsers}
              onRefresh={fetchUsers}
              loading={loading}
            />
            
            <UserTable 
              users={users} 
              loading={loading} 
              onEdit={handleOpenEdit} 
              onDelete={handleDeleteUser} // Đã truyền đúng hàm xóa thực tế
            />
          </div>
        </main>
      </div>

      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        setUser={setEditingUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UserManagement;