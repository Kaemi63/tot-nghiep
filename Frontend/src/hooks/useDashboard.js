import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import { supabase } from '../services/supabaseClient'; // Import đúng client giống các hook khác
import toast from 'react-hot-toast';

export const useDashboard = (initialStartDate = '', initialEndDate = '') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    startDate: initialStartDate,
    endDate: initialEndDate,
  });

  // Học tập từ useAdminProducts: Tạo hàm lấy token đồng bộ từ Supabase Session
  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Phiên đăng nhập không tồn tại hoặc đã hết hạn. Vui lòng đăng nhập lại.");
    return session.access_token;
  };

  // Hàm tải dữ liệu Dashboard
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Lấy token chuẩn Supabase giống hệt các trang quản lý khác đang làm
      const token = await getToken();

      // Gọi service nộp token vào backend
      const result = await dashboardService.getRevenueData(token, filters.startDate, filters.endDate);
      
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message || 'Có lỗi xảy ra khi tải dữ liệu doanh thu');
    } finally {
      setLoading(false);
    }
  }, [filters.startDate, filters.endDate]);

  // Tự động kích hoạt khi mount component hoặc khi bộ lọc thời gian thay đổi
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Hàm cập nhật filter nếu sau này bạn làm thêm ô chọn khoảng ngày (Date Picker)
  const updateTimeFilters = useCallback((startDate, endDate) => {
    setFilters({ startDate, endDate });
  }, []);

  return {
    loading,
    error,
    filters,
    updateTimeFilters,
    refreshData: fetchDashboardData,
    // Trả về data hoặc object rỗng mặc định để giao diện không bị crash (undefined)
    summary: data?.summary || { total_revenue: 0, total_orders: 0, average_order_value: 0 },
    revenueByTime: data?.analytics?.revenue_by_time || [],
    revenueByCategory: data?.analytics?.revenue_by_category || [],
    revenueByProduct: data?.analytics?.revenue_by_product || [],
    revenueByBrand: data?.analytics?.revenue_by_brand || [],
  };
};