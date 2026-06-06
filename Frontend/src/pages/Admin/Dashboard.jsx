import React from 'react';
import AdminShell from '../../components/Admin/AdminShell';
import { BarChart3, Users, Package, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  // Placeholder stats - có thể thêm logic sau
  const stats = [
    { label: 'Tổng người dùng', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Tổng sản phẩm', value: '0', icon: Package, color: 'bg-green-500' },
    { label: 'Tổng đơn hàng', value: '0', icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Doanh thu', value: '₫0', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <AdminShell 
      title="Dashboard" 
      subtitle="Tổng quan về hoạt động của cửa hàng"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder for charts and additional content */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm mt-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Biểu đồ</h2>
        <div className="h-64 flex items-center justify-center text-slate-400">
          Nội dung sẽ được thêm sau
        </div>
      </div>
    </AdminShell>
  );
};

export default Dashboard;
