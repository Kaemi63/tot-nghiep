import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

const WishlistPage = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Tự động lấy danh sách yêu thích khi vào trang
  useEffect(() => {
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

const mappedItems = data.map(w => {
  const product = w.products;
  // Truy cập sâu vào object brands để lấy name
  const brandName = product?.brands?.name || 'Thương hiệu cao cấp';

    return {
      id: w.id, 
      image: product?.thumbnail_url,
      name: product?.name,
      brand: brandName, 
      price: product?.base_price || 0,
      originalProduct: product 
    };
  });
  setItems(mappedItems);
      } catch (error) {
        toast.error("Không thể tải danh sách yêu thích");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  // 2. Hàm xử lý xóa khỏi danh sách yêu thích
  const handleRemove = async (id) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    // Thêm /remove/ vào URL cho đúng với route wishlist.js
    const response = await fetch(`http://localhost:3001/api/wishlist/remove/${id}`, { 
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (!response.ok) throw new Error("Không thể xóa");
    
    // Cập nhật giao diện ngay lập tức
    setItems(items.filter(item => item.id !== id));
    toast.success("Đã xóa khỏi danh sách!",);
  } catch (error) {
    toast.error(error.message);
  }
};

  if (loading) return null; // Hoặc thêm skeleton loading ở đây nếu thích
  if (!items.length) {
    return <div className="h-full overflow-y-auto bg-white p-6">
      <Toaster position="top-center" reverseOrder={false} />
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center">Danh sách yêu thích trống.</div></div>;
  }

  return (
    <div className="h-full overflow-y-auto bg-white p-6">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm yêu thích</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4 flex items-center gap-4 bg-white">
            <img src={item.image} alt={item.name} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-slate-500">{item.brand}</p>
              <p className="text-indigo-600 font-bold">{item.price.toLocaleString('vi-VN')}₫</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => onAddToCart(item.originalProduct || item)} 
                className="rounded-lg bg-emerald-600 px-3 py-2 text-white"
              >
                Thêm giỏ hàng
              </button>
              <button 
                onClick={() => handleRemove(item.id)} 
                className="rounded-lg border border-red-500 px-3 py-2 text-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;