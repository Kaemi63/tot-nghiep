import React from 'react';

const dummyProducts = Array.from({ length: 24 }).map((_, idx) => ({
  id: idx + 1,
  name: `Sản phẩm thời trang #${idx + 1}`,
  category: idx % 2 === 0 ? 'Nam' : 'Nữ',
  brand: ['Zara', 'H&M', 'Uniqlo', 'Nike'][idx % 4],
  price: (299000 + idx * 10000).toLocaleString('vi-VN') + 'đ',
  rating: (4 + (idx % 5) * 0.1).toFixed(1),
  reviewCount: 10 + (idx % 20),
  color: ['Đen', 'Trắng', 'Xám', 'Xanh'][idx % 4],
  ram: ['4GB', '8GB'][idx % 2],
  rom: ['64GB', '128GB', '256GB'][idx % 3],
  pin: ['3000mAh', '4000mAh', '5000mAh'][idx % 3],
  screen: ['5.5"', '6.1"', '6.5"'][idx % 3],
  image: `https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80&sig=${idx}`,
}));

const ProductListing = ({ category, searchQuery, onSelectProduct, onAddToCart, onAddToWishlist }) => {
  const [brandFilter, setBrandFilter] = React.useState('');
  const [priceRange, setPriceRange] = React.useState('');
  const [sort, setSort] = React.useState('newest');
  const [page, setPage] = React.useState(1);

  const perPage = 9;

  let products = dummyProducts.filter((product) => {
    if (category && !product.category.toLowerCase().includes(category.toLowerCase())) return false;
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (brandFilter && product.brand !== brandFilter) return false;
    if (priceRange === 'under500') return Number(product.price.replace(/\D/g, '')) < 500000;
    if (priceRange === '500to1000') {
      const p = Number(product.price.replace(/\D/g, ''));
      return p >= 500000 && p <= 1000000;
    }
    if (priceRange === 'above1000') return Number(product.price.replace(/\D/g, '')) > 1000000;
    return true;
  });

  if (sort === 'newest') products = products.slice().reverse();
  if (sort === 'bestseller') products = products.slice().sort((a, b) => b.reviewCount - a.reviewCount);
  if (sort === 'priceAsc') products = products.slice().sort((a, b) => Number(a.price.replace(/\D/g, '')) - Number(b.price.replace(/\D/g, '')));
  if (sort === 'priceDesc') products = products.slice().sort((a, b) => Number(b.price.replace(/\D/g, '')) - Number(a.price.replace(/\D/g, '')));

  const totalPage = Math.ceil(products.length / perPage);
  const slice = products.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800">Danh sách sản phẩm</h2>

        <div className="mt-4 grid gap-4 md:grid-cols-4">
          <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Thương hiệu</option>
            <option value="Zara">Zara</option>
            <option value="H&M">H&M</option>
            <option value="Uniqlo">Uniqlo</option>
            <option value="Nike">Nike</option>
          </select>
          <select value={priceRange} onChange={(e) => setPriceRange(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="">Giá</option>
            <option value="under500">Dưới 500.000đ</option>
            <option value="500to1000">500.000 - 1.000.000đ</option>
            <option value="above1000">Trên 1.000.000đ</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="newest">Mới nhất</option>
            <option value="bestseller">Bán chạy</option>
            <option value="priceAsc">Giá tăng dần</option>
            <option value="priceDesc">Giá giảm dần</option>
          </select>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((product) => (
            <div key={product.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md">
              <img src={product.image} alt={product.name} className="h-48 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-indigo-600 font-bold">{product.price}</p>
                <p className="text-sm text-slate-500">{product.brand}</p>
                <p className="text-sm mt-1">⭐ {product.rating} ({product.reviewCount})</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => onSelectProduct(product)} className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm text-white">Xem chi tiết</button>
                  <button onClick={() => onAddToCart && onAddToCart(product)} className="rounded-lg border border-green-500 px-3 py-2 text-sm text-green-600">Thêm giỏ</button>
                </div>
                <button onClick={() => onAddToWishlist && onAddToWishlist(product)} className="mt-2 w-full rounded-lg border border-amber-500 px-3 py-2 text-sm text-amber-600">Yêu thích</button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-slate-500">Trang {page}/{totalPage}</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg bg-slate-200 px-3 py-1 disabled:opacity-50"
            >Trước</button>
            <button
              disabled={page >= totalPage}
              onClick={() => setPage((p) => Math.min(totalPage, p + 1))}
              className="rounded-lg bg-slate-200 px-3 py-1 disabled:opacity-50"
            >Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing;
