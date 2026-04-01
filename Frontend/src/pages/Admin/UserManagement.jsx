import React, { useState } from 'react';
import AdminSideBar from '../../components/Admin/AdminSideBar.jsx';
import UserTable from '../../components/Admin/UserTable';

const UserManagement = () => {
  const [activePage, setActivePage] = useState('users');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar cố định bên trái */}
      <AdminSideBar activePage={activePage} setActivePage={setActivePage} />

      {/* Vùng nội dung chính */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header trên cùng */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Hệ thống quản trị viên</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-500">Xin chào, Admin</span>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200"></div>
          </div>
        </header>

        {/* Nội dung thay đổi theo tab */}
        <main className="flex-1 overflow-y-auto p-8">
          {activePage === 'users' ? (
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý người dùng</h1>
                <p className="text-slate-500 mt-1">Quản lý tài khoản, phân quyền và kiểm soát bảo mật hệ thống.</p>
              </div>
              
              {/* Hiển thị bảng danh sách */}
              <UserTable />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 italic">
              Tính năng {activePage} đang được cập nhật...
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserManagement;