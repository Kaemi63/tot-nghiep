import { useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const clearCart = () => { setCartItems([]);};
  const fetchCart = useCallback(async () => {
  const { data: { session }, error: authError } = await supabase.auth.getSession();
  
  if (authError || !session) {
    console.warn("Chưa có phiên đăng nhập");
    setLoading(false);
    return;
  }
  
  setLoading(true);
  try {
    const data = await cartService.getCart(session.access_token);
    setCartItems(data.cart_items || []);
  } catch (error) {
    // In ra toàn bộ error để xem message từ server
    console.error("Chi tiết lỗi fetch giỏ hàng:", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
}, []);

  const addToCart = async (product, qty = 1) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return toast.error("Vui lòng đăng nhập");

  // Kiểm tra log xem product có id không
  console.log("Adding product:", product);

  const payload = {
    product_id: product.id, // Đảm bảo lấy đúng id
    quantity: qty,
    product_variant_id: product.product_variants?.[0]?.id || null,
    unit_price: product.base_price || 0 ,
    selected_color: product.selected_color, 
    selected_size: product.selected_size,
    product_variant_id: product.product_variants?.find(
      v => v.color === product.selected_color && v.size === product.selected_size
    )?.id || product.product_variants?.[0]?.id || null
  };

  try {
    const res = await fetch('http://localhost:3001/api/cart/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Đã thêm vào giỏ hàng");
      fetchCart(); // Gọi lại hàm lấy dữ liệu để cập nhật số lượng trên icon giỏ hàng
    } else {
      // Nếu lỗi 400, backend sẽ trả về message lỗi cụ thể
      toast.error(result.error || "Không thể thêm vào giỏ hàng");
      console.error("Backend error:", result);
    }
  } catch (err) {
    toast.error("Lỗi kết nối server");
  }
};
  const removeCartItem = async (itemId) => {
    const { data: { session } } = await supabase.auth.getSession();
    try {
      await cartService.removeItem(session.access_token, itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      toast.success("Đã xóa sản phẩm");
    } catch (error) {
      toast.error("Lỗi khi xóa");
    }
  };

  useEffect(() => { fetchCart(); }, [fetchCart]);

const updateCartQuantity = async (cartItemId, newQty) => {
  if (newQty < 1) return;
  const previousItems = [...cartItems];
  setCartItems(prevItems => {
    const updatedItems = prevItems.map(item =>
      item.id === cartItemId ? { ...item, quantity: newQty } : item
    );
    return [...updatedItems]; 
  });

  // 4. Lấy session để gọi API
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    toast.error("Vui lòng đăng nhập lại");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3001/api/cart/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ 
        cart_item_id: cartItemId, 
        quantity: newQty 
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      setCartItems(previousItems);
      toast.error(errorData.error || "Không thể cập nhật số lượng");
    } else {
    }
  } catch (err) {
    setCartItems(previousItems);
    console.error("Update error:", err);
    toast.error("Lỗi kết nối server");
  }
};
  return { cartItems, loading, addToCart, removeCartItem, refreshCart: fetchCart, updateCartQuantity,clearCart };
};
  