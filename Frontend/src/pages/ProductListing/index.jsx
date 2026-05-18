import React, { useState, useMemo } from 'react';
import { PageShell, EmptyState } from '../../components/ShopUI/ShopUI.jsx';
import ListingCard from '../../components/ProductListing/ListingCard';
import ListingFilters from '../../components/ProductListing/ListingFilters';
import ListingPagination from '../../components/ProductListing/ListingPagination';
import { useAllProducts } from '../../services/useProducts';

const PER_PAGE = 9;

// Map slug → tiêu đề mô tả đầy đủ
const CATEGORY_DESCRIPTIONS = {
  'nam': { title: 'Thời trang Nam', sub: 'Các sản phẩm thời trang dành riêng cho Nam' },
  'nu': { title: 'Thời trang Nữ', sub: 'Các sản phẩm thời trang dành riêng cho Nữ' },
  'giay': { title: 'Giày & Dép', sub: 'Bộ sưu tập giày dép cho Nam và Nữ' },
  'phu-kien': { title: 'Phụ kiện thời trang', sub: 'Túi xách, trang sức và phụ kiện thời trang' },
};

const getCategoryMeta = (slug, label) => {
  if (slug && CATEGORY_DESCRIPTIONS[slug]) return CATEGORY_DESCRIPTIONS[slug];
  if (label) return { title: label, sub: `Khám phá các sản phẩm thuộc danh mục ${label}` };
  return { title: 'Tất cả sản phẩm', sub: 'Khám phá toàn bộ bộ sưu tập của chúng tôi' };
};

const applyFilters = (products, { searchQuery, brandFilter, priceRange, sort }) => {
  let list = [...products];
  if (searchQuery) list = list.filter((p) => {
    const name = p.name?.toLowerCase() || '';
    const brand = (p.brands?.name || p.brand || '').toLowerCase();
    return name.includes(searchQuery.toLowerCase()) || brand.includes(searchQuery.toLowerCase());
  });
  if (brandFilter) list = list.filter((p) => (p.brands?.name || p.brand) === brandFilter);
  if (priceRange) {
    const getPrice = (p) => p.base_price ?? p.priceRaw ?? 0;
    if (priceRange === 'under500') list = list.filter((p) => getPrice(p) < 500000);
    else if (priceRange === '500to1000') list = list.filter((p) => { const v = getPrice(p); return v >= 500000 && v <= 1000000; });
    else if (priceRange === 'above1000') list = list.filter((p) => getPrice(p) > 1000000);
  }
  const getPrice = (p) => p.base_price ?? p.priceRaw ?? 0;
  if (sort === 'priceAsc') list.sort((a, b) => getPrice(a) - getPrice(b));
  else if (sort === 'priceDesc') list.sort((a, b) => getPrice(b) - getPrice(a));
  else if (sort === 'bestseller') list.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
  return list;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
    <div className="h-56 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="h-4 bg-slate-200 rounded w-4/5" />
      <div className="h-4 bg-slate-200 rounded w-1/3" />
    </div>
  </div>
);

const ProductListing = ({ categorySlug, categoryLabel, searchQuery, onSelectProduct, onAddToCart, onAddToWishlist }) => {
  const [brandFilter, setBrandFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  // Pass categorySlug to hook so DB does the filtering
  const { products: raw, loading, error } = useAllProducts({ categorySlug, limit: 100 });

  const filtered = useMemo(() => applyFilters(raw, { searchQuery, brandFilter, priceRange, sort }), [raw, searchQuery, brandFilter, priceRange, sort]);
  const totalPage = Math.ceil(filtered.length / PER_PAGE);
  const slice = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const brands = [...new Set(raw.map((p) => p.brands?.name || p.brand).filter(Boolean))];

  const handlePage = (n) => { setPage(n); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const catMeta = getCategoryMeta(categorySlug, categoryLabel);

  return (
    <PageShell>
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-800">{catMeta.title}</h1>
        <p className="text-slate-500 text-sm mt-1">{catMeta.sub}</p>
        {searchQuery && <p className="text-slate-500 text-sm mt-1">Kết quả tìm kiếm cho "<strong>{searchQuery}</strong>"</p>}
      </div>

      <div className="mb-5">
        <ListingFilters brandFilter={brandFilter} setBrandFilter={setBrandFilter} priceRange={priceRange} setPriceRange={setPriceRange} sort={sort} setSort={setSort} brands={brands} totalCount={filtered.length} />
      </div>

      {error && <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">Lỗi tải dữ liệu: {error}</div>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : slice.length === 0 ? (
        <EmptyState icon="🔍" title="Không tìm thấy sản phẩm" desc="Thay đổi bộ lọc hoặc từ khóa để tìm kết quả khác." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slice.map((product) => <ListingCard key={product.id} product={product} onSelect={onSelectProduct} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} />)}
        </div>
      )}

      <ListingPagination page={page} totalPage={totalPage} onPage={handlePage} />
    </PageShell>
  );
};

export default ProductListing;
