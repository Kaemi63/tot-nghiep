import { useState, useCallback } from 'react';
import { paymentService } from '../services/paymentService';

export const usePayments = () => {
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  // Hàm xử lý kích hoạt thanh toán khi khách bấm nút "Thanh toán toán ngay"
  const processPayment = useCallback(async (orderId, method, totalAmount) => {
    setProcessing(true);
    setPaymentError(null);
    try {
      const response = await paymentService.createPayment({
        order_id: orderId,
        payment_method: method,
        amount: totalAmount
      });

      if (response.success) {
        // MỞ RỘNG SAU NÀY: Nếu Backend tích hợp VNPay/MoMo trả về url thanh toán (paymentUrl):
        // window.location.href = response.data.paymentUrl;
        return response.data;
      } else {
        throw new Error(response.error || 'Giao dịch không hợp lệ');
      }
    } catch (err) {
      setPaymentError(err.message);
      throw err;
    } finally {
      setProcessing(false);
    }
  }, []);

  // Hàm tải lịch sử giao dịch (Cho trang cá nhân hoặc trang quản trị)
  const fetchHistory = useCallback(async (isAdmin = false) => {
    setProcessing(true);
    setPaymentError(null);
    try {
      const res = isAdmin 
        ? await paymentService.getAllPaymentsForAdmin() 
        : await paymentService.getMyPaymentHistory();
        
      if (res.success) {
        setPaymentHistory(res.data);
      }
    } catch (err) {
      setPaymentError(err.message);
    } finally {
      setProcessing(false);
    }
  }, []);

  return {
    processing,
    paymentError,
    paymentHistory,
    processPayment,
    fetchHistory
  };
};