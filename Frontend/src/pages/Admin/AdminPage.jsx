import React, { useState } from 'react';
import AdminSidebar from '../../components/UserManagement/AdminSideBar';
import UserHeader from '../../components/UserManagement/UserHeader';

// Import 2 trang nội dung của bạn
import UserManagementContent from './UserManagement'; 
import ProductManagementContent from './ProductManagement';

const AdminDashboard = ({ onLogout }) => {
  // Quản lý trạng thái: 'users' hoặc 'products'
  const [activePage, setActivePage] = useState('users');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Truyền cả activePage và setActivePage vào Sidebar */}
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header dùng chung cho cả 2 trang */}
        <UserHeader />
        
        {/* Khu vực hiển thị nội dung thay đổi */}
        <main className="flex-1 overflow-y-auto">
          {activePage === 'users' && (
            <UserManagementContent />
          )}

          {activePage === 'products' && (
            <ProductManagementContent />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;