import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import couponService from '../services/couponService';

export const useCoupons = (user, activeTab) => {
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [usedCoupons, setUsedCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);

  const loadCoupons = async () => {
    if (!user) return;
    setLoadingCoupons(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [publicCoupons, myCoupons] = await Promise.all([
        couponService.getPublicCoupons(),
        couponService.getMyCoupons(session.access_token),
      ]);

      setAvailableCoupons(publicCoupons || []);
      setUsedCoupons(Array.isArray(myCoupons) ? myCoupons : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải thông tin mã giảm giá');
    } finally {
      setLoadingCoupons(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'coupons') {
      loadCoupons();
    }
  }, [activeTab, user]);

  return {
    availableCoupons,
    usedCoupons,
    loadingCoupons,
    loadCoupons,
  };
};
