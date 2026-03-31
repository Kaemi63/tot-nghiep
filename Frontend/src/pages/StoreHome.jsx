import React from 'react';

const categories = [
  { id: 'nam', name: 'Thời trang Nam' },
  { id: 'nu', name: 'Thời trang Nữ' },
  { id: 'phukien', name: 'Phụ kiện' },
  { id: 'giay', name: 'Giày dép' },
  { id: 'aokhoac', name: 'Áo khoác' },
  { id: 'quanjeans', name: 'Quần Jeans' },
];

const topBrands = ['Zara', 'H&M', 'Uniqlo', 'Nike', 'Adidas', 'Vascara', 'Coolmate'];

const featuredProducts = [
  { id: 1, name: 'Áo thun trơn cổ tròn', price: '299.000đ', rating: 4.8, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80' },
  { id: 2, name: 'Quần jeans dáng ôm', price: '549.000đ', rating: 4.7, image: 'https://images.unsplash.com/photo-1530692872307-4fdb328a3678?auto=format&fit=crop&w=600&q=80' },
  { id: 3, name: 'Áo khoác denim', price: '899.000đ', rating: 4.9, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80' },
];

const trendyPromo = {
  title: 'Mùa hè style streetwear 2026',
  subtitle: 'Giảm đến 40% cho đơn hàng đầu tiên',
  image: 'https://images.unsplash.com/photo-1556909216-6f54002f2ac8?auto=format&fit=crop&w=1600&q=80',
};

const StoreHome = ({ onFilterCategory, onOpenListing }) => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, thương hiệu..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
          />
        </div>
        <div className="rounded-3xl overflow-hidden relative mb-8">
          <img src={trendyPromo.image} alt="Promo" className="w-full h-72 object-cover" />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-center text-white px-6">
              <h1 className="text-3xl md:text-5xl font-bold">{trendyPromo.title}</h1>
              <p className="mt-3 text-lg md:text-xl">{trendyPromo.subtitle}</p>
              <button onClick={() => onOpenListing('nam')} className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-700">Mua ngay</button>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Danh mục nổi bật</h2>
            <button onClick={() => onOpenListing()} className="text-indigo-600 hover:text-indigo-700">Xem tất cả</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => onFilterCategory(cat.id)} className="rounded-2xl border border-slate-200 p-4 bg-white hover:shadow-md text-center font-semibold">{cat.name}</button>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Sản phẩm bán chạy</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <article key={product.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-lg">{product.name}</h4>
                  <p className="text-indigo-600 font-bold mt-1">{product.price}</p>
                  <p className="text-sm text-slate-500 mt-1">⭐ {product.rating}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Thương hiệu nổi bật</h3>
          <div className="flex flex-wrap gap-3">
            {topBrands.map((b) => <span key={b} className="px-4 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700">{b}</span>)}
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Blog thời trang</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md">
              <h4 className="font-semibold">5 Cách phối đồ Streetwear mùa hè</h4>
              <p className="text-sm text-slate-500 mt-2">Xu hướng thời trang đường phố 2026, dễ phối và thoải mái.</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md">
              <h4 className="font-semibold">Mix & match công sở tinh tế</h4>
              <p className="text-sm text-slate-500 mt-2">Bí quyết chọn mẫu phù hợp với văn phòng cho cả nam và nữ.</p>
            </article>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Đánh giá khách hàng</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <blockquote className="rounded-2xl border border-slate-200 bg-white p-5">“Chất lượng rất tốt, giao hàng nhanh, mọi người nên thử.” <span className="block text-sm text-slate-500 mt-2">- Nguyễn Hà</span></blockquote>
            <blockquote className="rounded-2xl border border-slate-200 bg-white p-5">“Giá hợp lý và hỗ trợ tốt. Sẽ quay lại mua tiếp.” <span className="block text-sm text-slate-500 mt-2">- Lê Minh</span></blockquote>
            <blockquote className="rounded-2xl border border-slate-200 bg-white p-5">“Thiết kế đẹp, chất liệu ổn, phù hợp phong cách hiện đại.” <span className="block text-sm text-slate-500 mt-2">- Trương Phương</span></blockquote>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StoreHome;
