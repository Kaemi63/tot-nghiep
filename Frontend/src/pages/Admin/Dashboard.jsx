import React from 'react';
import AdminShell from '../../components/Admin/AdminShell';
import { BarChart3, Users, Calendar, ShoppingCart, TrendingUp, RefreshCw } from 'lucide-react';
import { useDashboard } from '../../hooks/useDashboard';

const Dashboard = () => {
  const {
    loading,
    error,
    summary,
    revenueByTime,
    revenueByCategory,
    revenueByProduct,
    revenueByBrand,
    refreshData
  } = useDashboard();

  const stats = [
    { label: 'Tổng người dùng', value: 'Hệ thống', icon: Users, color: 'bg-blue-500' },
    { label: 'Tổng đơn hàng', value: `${summary.total_orders} đơn`, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Doanh thu', value: `₫${summary.total_revenue.toLocaleString('vi-VN')}`, icon: BarChart3, color: 'bg-orange-500' },
    { label: 'Đơn hàng trung bình (AOV)', value: `₫${Math.round(summary.average_order_value).toLocaleString('vi-VN')}`, icon: TrendingUp, color: 'bg-emerald-500' },
  ];

  if (error) {
    return (
      <AdminShell title="Dashboard" subtitle="Tổng quan về hoạt động của cửa hàng">
        <div className="p-6 bg-red-50 border border-red-200 text-red-600 rounded-lg">
          Có lỗi xảy ra khi tải dữ liệu báo cáo: {error}
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Dashboard" subtitle="Tổng quan về hoạt động của cửa hàng">
      <div className="flex justify-end mb-4">
        <button 
          onClick={refreshData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Làm mới dữ liệu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                  <div className="text-2xl font-bold text-slate-900 mt-2">
                    {loading ? <span className="block h-7 w-24 bg-slate-200 animate-pulse rounded" /> : stat.value}
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Doanh thu theo thời gian (Tháng)</h3>
            <Calendar size={18} className="text-slate-400" />
          </div>
          {loading ? (
            <div className="h-48 bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-400">Đang dựng biểu đồ...</div>
          ) : revenueByTime.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Chưa có dữ liệu doanh thu phát sinh.</div>
          ) : (
            <div className="space-y-3">
              {revenueByTime.map((time, idx) => {
                const maxRevenue = Math.max(...revenueByTime.map(t => t.revenue), 1);
                const percentage = (time.revenue / maxRevenue) * 100;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-slate-700">Tháng {time.period}</span>
                      <span className="font-bold text-slate-900">₫{time.revenue.toLocaleString('vi-VN')}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Cơ cấu nhóm sản phẩm</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => <div key={n} className="h-10 bg-slate-100 animate-pulse rounded" />)}
            </div>
          ) : revenueByCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Không có dữ liệu phân loại.</div>
          ) : (
            <div className="space-y-4">
              {revenueByCategory.map((category, idx) => (
                <div key={idx} className="flex flex-col border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-800">{category.category_name}</span>
                    <span className="font-bold text-slate-900">₫{category.revenue.toLocaleString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-0.5">
                    <span>Đã bán: {category.quantity} sản phẩm</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Doanh thu theo thương hiệu</h3>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(n => <div key={n} className="h-12 bg-slate-100 animate-pulse rounded" />)}
            </div>
          ) : revenueByBrand.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Không tìm thấy dữ liệu thương hiệu.</div>
          ) : (
            <div className="space-y-3">
              {revenueByBrand.map((brand, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {brand.logo_url ? (
                      <img src={brand.logo_url} alt={brand.brand_name} className="w-8 h-8 rounded-full border object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                        {brand.brand_name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-800">{brand.brand_name}</span>
                  </div>
                  <span className="text-sm font-bold text-indigo-600">₫{brand.revenue.toLocaleString('vi-VN')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top sản phẩm đem lại doanh thu cao nhất</h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(n => <div key={n} className="h-12 bg-slate-100 animate-pulse rounded" />)}
            </div>
          ) : revenueByProduct.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Chưa có sản phẩm nào được thanh toán.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="pb-3 font-medium">Tên sản phẩm</th>
                    <th className="pb-3 font-medium text-center">Số lượng bán</th>
                    <th className="pb-3 font-medium text-right">Tổng doanh thu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {revenueByProduct.slice(0, 5).map((product, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 font-medium text-slate-800 max-w-[240px] truncate">{product.name}</td>
                      <td className="py-3 text-center text-slate-600 font-semibold">{product.total_quantity}</td>
                      <td className="py-3 text-right font-bold text-emerald-600">₫{product.total_revenue.toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
};

export default Dashboard;