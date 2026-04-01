import React, { useEffect, useState } from 'react';
// Kiểm tra đường dẫn này: Nếu StoreHome nằm cùng cấp với UserTable, đường dẫn sẽ giống hệt.
import { supabase } from '../lib/supabaseClient.js'; 

const StoreHome = ({ onFilterCategory, onOpenListing, onSearch, onSelectProduct }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'giay-nam', name: 'Giày Nam' },
    { id: 'ao-khoac', name: 'Áo Khoác' },
    { id: 'phu-kien', name: 'Phụ Kiện' },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true);
      try {
        // Thử query đơn giản nhất để test quyền
        const { data, error } = await supabase
          .from('products')
          .select('*') 
          .limit(4);

        if (error) {
          console.error("Lỗi lấy sản phẩm:", error.message);
        } else {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Lỗi hệ thống:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="max-w-7xl mx-auto p-6 lg:p-10">
        
        {/* Search Bar - Zen Style */}
        <div className="mb-12">
          <input
            type="text"
            placeholder="Tìm kiếm tinh hoa thời trang..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full rounded-2xl border-none bg-slate-100 px-8 py-5 text-slate-700 focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
          />
        </div>

        {/* Hero Cardboard */}
        <div className="relative h-[450px] rounded-[3rem] overflow-hidden mb-20 shadow-2xl group">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80" 
            alt="Banner" 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-16">
            <div className="text-white max-w-xl">
              <h1 className="text-6xl font-bold tracking-tight">Quiet Luxury</h1>
              <p className="mt-4 text-lg font-light opacity-80">Sự sang trọng thầm lặng trong từng đường nét tối giản.</p>
              <button onClick={() => onOpenListing('')} className="mt-8 rounded-full bg-white text-black px-12 py-4 font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-24">
          <h2 className="text-2xl font-bold mb-10 tracking-widest uppercase text-slate-400 text-center font-serif italic">Danh mục tinh tuyển</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => onFilterCategory(cat.id)}
                className="group relative h-48 rounded-[2.5rem] overflow-hidden bg-slate-900 transition-all hover:-translate-y-2 hover:shadow-2xl shadow-lg"
              >
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <span className="text-white text-xl font-bold tracking-[0.3em] uppercase">{cat.name}</span>
                </div>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-indigo-600/60 transition-colors z-10" />
              </button>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="mb-20">
          <div className="flex items-end justify-between mb-12 border-b border-slate-100 pb-8">
            <div>
              <h3 className="text-4xl font-bold text-slate-900 tracking-tighter">Sản phẩm tiêu biểu</h3>
              <p className="text-slate-400 mt-2">Chắt lọc từ những thương hiệu hàng đầu</p>
            </div>
            <button onClick={() => onOpenListing('')} className="text-indigo-600 font-bold hover:underline tracking-tight">Xem tất cả →</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {loading ? (
              <div className="col-span-full py-20 text-center animate-pulse text-slate-300 tracking-[0.3em] uppercase">Đang nạp dữ liệu...</div>
            ) : featuredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group cursor-pointer"
                onClick={() => onSelectProduct(product)}
              >
                {/* Product Cardboard Image */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-[3rem] bg-slate-50 border border-slate-100 shadow-sm transition-all duration-700 hover:shadow-2xl hover:-translate-y-2">
                  <img 
                    src={product.thumbnail_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                  />
                  {product.is_featured && (
                    <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Featured</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mt-8 text-center space-y-2 px-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
                    {product.brands?.name || 'Exclusive'}
                  </p>
                  <h4 className="font-bold text-xl text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight tracking-tight">
                    {product.name}
                  </h4>
                  <p className="text-slate-900 font-medium text-lg opacity-80">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.base_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StoreHome;