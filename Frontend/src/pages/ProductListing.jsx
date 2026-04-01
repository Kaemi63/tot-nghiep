import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // Đảm bảo bạn đã config cái này

const ProductListing = ({ categorySlug, searchQuery, onSelectProduct, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Tạo URL cơ bản
      let url = 'http://localhost:3001/api/products';
      
      // 2. Chỉ thêm Query String nếu có dữ liệu
      const params = new URLSearchParams();
      if (categorySlug) params.append('category', categorySlug);
      if (searchQuery) params.append('search', searchQuery);
      
      // Nếu có params thì mới nối thêm dấu '?', không thì thôi
      const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

      console.log("Đang gọi API:", finalUrl); // Để bạn kiểm tra trong Console

      const response = await fetch(finalUrl);
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      } else {
        // Đây là nơi nhận lỗi "Permission Denied" từ Backend trả về
        console.error("Lỗi từ Backend:", data.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối mạng:", error.message);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [categorySlug, searchQuery]);

  if (loading) return <div className="py-20 text-center font-light italic">Đang tìm kiếm những thiết kế phù hợp...</div>;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          {categorySlug ? `Bộ sưu tập ${categorySlug}` : "Tất cả sản phẩm"}
        </h2>

        {/* Grid hiển thị sản phẩm đúng chất Zen Modern */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group cursor-pointer animate-in fade-in duration-700"
              onClick={() => onSelectProduct(product)}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] bg-slate-100 border border-slate-50 shadow-sm transition-all hover:shadow-xl">
                <img 
                  src={product.thumbnail_url} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                {product.is_featured && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                    Nổi bật
                  </span>
                )}
              </div>
              
              <div className="mt-6 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  {product.brands?.name}
                </p>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-900 font-light tracking-tighter">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;