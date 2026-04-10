// src/hooks/useWishlist.js
import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  const addToWishlist = async (product) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vui lòng đăng nhập!");
        return;
      }

      const userId = session.user.id;

      // 1. Kiểm tra sản phẩm đã có trong wishlist chưa
      const responseCheck = await fetch(`http://localhost:3001/api/wishlist/${userId}`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      const currentWishlist = await responseCheck.json();

      const existingItem = currentWishlist.find(item =>
        (item.products?.id === product.id) || (item.product_id === product.id)
      );

      if (existingItem) {
        // 2. Đã có -> Xóa khỏi wishlist
        const removeResponse = await fetch(`http://localhost:3001/api/wishlist/remove/${existingItem.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (removeResponse.ok) {
          toast.success("Đã xóa khỏi danh sách yêu thích");
          setWishlistItems(prev => prev.filter(item => item.id !== existingItem.id));
        }
      } else {
        // 3. Chưa có -> Thêm vào wishlist
        const addResponse = await fetch('http://localhost:3001/api/wishlist/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ user_id: userId, product_id: product.id })
        });

        if (addResponse.ok) {
          const result = await addResponse.json();
          setWishlistItems(prev => [...prev, result.data[0]]);
          toast.success("Đã thêm vào danh sách yêu thích");
        } else {
          const errorData = await addResponse.json();
          toast.error(errorData.error || "Không thể thêm vào yêu thích");
        }
      }
    } catch (error) {
      console.error("Lỗi Wishlist Toggle:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return { wishlistItems, setWishlistItems, addToWishlist };
};