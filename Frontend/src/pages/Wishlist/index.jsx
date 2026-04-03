import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient'; // Điều chỉnh đường dẫn file supabase của bạn
import toast, { Toaster } from 'react-hot-toast';
import WishlistCard from './WishlistCard';

const WishlistPage = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách yêu thích từ Backend
  const fetchWishlist = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3001/api/wishlist/${session.user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Map lại dữ liệu để truyền vào Card dễ hơn
      const mappedItems = data.map(w => {
        const product = w.products;
        return {
          id: w.id, 
          image: product?.thumbnail_url,
          name: product?.name,
          brand: product?.brands?.name || 'Thương hiệu cao cấp', 
          price: product?.base_price || 0,
          originalProduct: product 
        };
      });
      setItems(mappedItems);
    } catch (error) {
      toast.error("Không thể tải danh sách yêu thích");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 2. Xử lý xóa sản phẩm
  const handleRemove = async (id) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`http://localhost:3001/api/wishlist/remove/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error("Không thể xóa");
      
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success("Đã xóa khỏi danh sách!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-white p-6">
      <Toaster position="top-center" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800">Yêu thích</h1>
        <p className="text-slate-500 text-sm mt-1">{items.length} sản phẩm đã lưu</p>
      </div>

      {!items.length ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-12 text-center">
          <span className="text-4xl mb-4 block">❤️</span>
          <h2 className="text-xl font-bold text-slate-700">Danh sách yêu thích trống</h2>
          <p className="text-slate-500">Hãy thêm sản phẩm bạn thích vào đây nhé!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <WishlistCard 
              key={item.id} 
              item={item} 
              onAddToCart={onAddToCart} 
              onRemove={handleRemove} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;