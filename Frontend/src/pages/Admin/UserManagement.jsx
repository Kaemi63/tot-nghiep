import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../../services/supabaseClient';
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
    id: '', fullname: '', username: '', email: '', role: 'user', password: '', avatar_url: '' 
  });

  const API_URL = "http://localhost:3001/api/users";

  // --- Hàm fetch chính ---
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('Phiên đăng nhập hết hạn.');
        return;
      }

      const response = await fetch(`${API_URL}?search=${searchTerm}&role=${roleFilter}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}` 
        },
      });

      const result = await response.json();
      if (result.success) {
        setUsers(result.data || []);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- HÀM CHO NÚT LÀM MỚI ---
  const handleRefresh = () => {
    setSearchTerm(''); // Reset thanh tìm kiếm
    setRoleFilter('all'); // Reset bộ lọc role
    fetchUsers(); // Gọi lại hàm lấy dữ liệu
    toast.success('Đã làm mới dữ liệu');
  };

  const handleSaveUser = async () => {
    const isEdit = !!editingUser.id;
    const tid = toast.loading("Đang xử lý...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(isEdit ? `${API_URL}/${editingUser.id}` : API_URL, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(editingUser)
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Thành công!", { id: tid });
        setIsEditModalOpen(false);
        fetchUsers();
      } else throw new Error(result.message);
    } catch (err) { toast.error(err.message, { id: tid }); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Xóa người dùng này?")) return;
    const tid = toast.loading("Đang xóa...");
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa!", { id: tid });
        fetchUsers();
      } else throw new Error(data.message);
    } catch (err) { toast.error(err.message, { id: tid }); }
  };

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-slate-900">Quản lý người dùng</h1>
        
        <UserFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          roleFilter={roleFilter} 
          setRoleFilter={setRoleFilter} 
          onAddClick={() => { 
            setEditingUser({ id: '', fullname: '', username: '', email: '', role: 'user', password: '', avatar_url: '' }); 
            setIsEditModalOpen(true); 
          }}
          onRefresh={handleRefresh} // <--- GÁN HÀM LÀM MỚI VÀO ĐÂY
        />

        <UserTable 
          users={users} 
          loading={loading} 
          onEdit={(u) => { setEditingUser(u); setIsEditModalOpen(true); }} 
          onDelete={handleDeleteUser} 
        />
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