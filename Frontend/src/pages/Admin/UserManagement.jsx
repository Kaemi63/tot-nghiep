import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

import UserFilters from '../../components/UserManagement/UserFilters';
import UserTable from '../../components/UserManagement/UserTable';
import UserEditModal from '../../components/UserManagement/UserEdit';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState({
    id: '', fullname: '', username: '', email: '', role: '', date_of_birth: '', avatar_url: ''
  });

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
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    const deletingToast = toast.loading("Đang xóa...");
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (error) throw error;
      toast.success("Đã xóa người dùng thành công", { id: deletingToast });
      fetchUsers();
    } catch (err) {
      toast.error("Không thể xóa: " + err.message, { id: deletingToast });
    }
  };

  return (
    <div className="p-8">
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
          onDelete={handleDeleteUser} 
        />
      </div>

      <UserEditModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={editingUser}
        setUser={setEditingUser}
        onSave={() => {
            setIsEditModalOpen(false);
            fetchUsers();
        }}
      />
    </div>
  );
};

export default UserManagement;