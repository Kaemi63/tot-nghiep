import React from 'react';
import { Search, Filter, PackagePlus, RefreshCw, Layers3, Zap } from 'lucide-react';

const ProductFilters = ({ 
  searchTerm, setSearchTerm, 
  categoryFilter, setCategoryFilter, 
  brandFilter, setBrandFilter,
  categories = [], brands = [],
  onSearch, onAddClick, onRefresh, loading 
}) => {
  
  const getSelectClass = () => `
    bg-white border border-slate-200 pl-9 pr-4 py-2.5 rounded-xl outline-none 
    focus:border-indigo-500 transition-all shadow-sm text-sm font-bold text-slate-700 
    cursor-pointer min-w-[160px] appearance-none
  `;

  return (
    <div className="flex flex-col xl:flex-row justify-between items-center gap-4 mb-6">
      <div className="flex flex-1 w-full gap-2">
        {/* Tìm kiếm tên/SKU */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
          <input 
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm font-medium"
            placeholder="Tìm theo tên sản phẩm hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        
        <button 
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center justify-center w-12 h-12 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-200 rounded-xl transition-all disabled:opacity-50 shadow-sm shrink-0"
          title="Làm mới danh sách"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex items-center gap-3 w-full xl:w-auto">
        <div className="relative flex-1 xl:flex-initial">
          <Layers3 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)} 
            className={getSelectClass()}
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 xl:flex-initial">
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10" size={16} />
          <select 
            value={brandFilter} 
            onChange={(e) => setBrandFilter(e.target.value)} 
            className={getSelectClass()}
          >
            <option value="all">Tất cả thương hiệu</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>{brand.name}</option>
            ))}
          </select>
        </div>
        
        {/* Nút Thêm mới */}
        <button 
          onClick={onAddClick} 
          className="flex items-center gap-2.5 bg-indigo-600 text-white px-6 py-3 rounded-xl font-extrabold hover:bg-indigo-700 hover:shadow-lg transition-all whitespace-nowrap active:scale-95 text-sm shrink-0 shadow-indigo-100/50 shadow-md"
        >
          <PackagePlus size={19} /> 
          <span>Thêm sản phẩm</span>
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;