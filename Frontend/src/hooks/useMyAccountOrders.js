import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../services/supabaseClient';
import { orderService } from '../services/orderService';

export const useOrders = (user, activeTab) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const loadOrders = async () => {
    if (!user) return;
    setLoadingOrders(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const data = await orderService.getMyOrders(session.access_token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải lịch sử đơn hàng');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && activeTab === 'orders') {
      loadOrders();
    }
  }, [activeTab, user]);

  return {
    orders,
    selectedOrder,
    setSelectedOrder,
    loadingOrders,
    loadOrders,
  };
};
