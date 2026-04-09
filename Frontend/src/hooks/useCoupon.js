import { useState } from 'react';
import couponService from '../services/couponService'; // Bỏ dấu { } quanh couponService
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useCoupon = (subtotal) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;

    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Vui lòng đăng nhập để sử dụng mã");

      // Gọi service
      const result = await couponService.applyCoupon(
        session.access_token,
        couponCode,
        subtotal
      );

      setAppliedCoupon(result);
      setDiscount(result.discount_amount);
      toast.success(`Đã áp dụng mã: ${result.code}`);
    } catch (error) {
      setAppliedCoupon(null);
      setDiscount(0);
      toast.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setDiscount(0);
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    discount,
    loading,
    handleApplyCoupon,
    resetCoupon
  };
};