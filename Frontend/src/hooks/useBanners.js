import { useState, useEffect, useCallback } from 'react';
import { bannerService } from '../services/bannerService';

export const useBanners = (isAdmin = false) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm fetch dữ liệu linh hoạt dựa theo vai trò (Admin hoặc Client)
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (isAdmin) {
        res = await bannerService.getAllBannersForAdmin();
      } else {
        res = await bannerService.getPublicBanners();
      }
      
      if (res.success) {
        setBanners(res.data);
      } else {
        throw new Error(res.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  // Tự động chạy lần đầu khi component gắn vào cây DOM
  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    loading,
    error,
    refreshBanners: fetchBanners, // Hàm này dùng để gọi lại khi cần reload dữ liệu
  };
};