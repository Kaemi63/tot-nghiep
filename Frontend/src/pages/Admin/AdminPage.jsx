import React, { useState } from 'react';
import AdminSidebar from '../../components/UserManagement/AdminSideBar';
import UserHeader from '../../components/UserManagement/UserHeader';

// Import trang nội dung
import Dashboard from './Dashboard';
import AdminAI from './AdminAI';
import UserManagementContent from './UserManagement'; 
import ProductManagementContent from './ProductManagement';
import AdminOrderManagement from './AdminOrderManagement';
import AdminPaymentManagement from './AdminPaymentManagement';

const AdminDashboard = ({ onLogout }) => {
  // Quản lý trạng thái: 'dashboard', 'ai', 'users', 'products', 'orders', 'payments'
  const [activePage, setActivePage] = useState('dashboard');

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Truyền cả activePage và setActivePage vào Sidebar */}
      <AdminSidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onLogout={onLogout} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header dùng chung - không show khi ở AI page */}
        {activePage !== 'ai' && <UserHeader />}
        
        {/* Khu vực hiển thị nội dung thay đổi */}
        <main className={activePage === 'ai' ? 'flex-1 flex flex-col h-full overflow-hidden' : 'flex-1 overflow-y-auto'}>
          {activePage === 'dashboard' && (
            <Dashboard />
          )}

          {activePage === 'ai' && (
            <AdminAI onLogout={onLogout} />
          )}

          {activePage === 'users' && (
            <UserManagementContent />
          )}

          {activePage === 'products' && (
            <ProductManagementContent />
          )}

          {activePage === 'orders' && (
            <AdminOrderManagement />
          )}

          {activePage === 'payments' && (
            <AdminPaymentManagement />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;