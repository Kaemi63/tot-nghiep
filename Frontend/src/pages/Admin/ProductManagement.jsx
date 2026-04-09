import React, { useState } from 'react';
import ProductFilters from '../../components/ProductManagement/ProductFilters';
import ProductTable from '../../components/ProductManagement/ProductTable';
import ProductEditModal from '../../components/ProductManagement/ProductEdit';
import { PackagePlus } from 'lucide-react';
import { fmt } from '../../utils/format.js';
import { useAllProducts } from '../../services/useProducts.js'; 
import { useCategories } from '../../services/useCategories.js'; 
import { useBrands } from '../../services/useBrands.js'; 

const AdminProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [limit, setLimit] = useState(24);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState({});

  const { products, loading: loadingProducts } = useAllProducts({
    categorySlug: categoryFilter !== 'all' ? categoryFilter : null,
    limit: limit
  });
  const { categories } = useCategories();
  const { brands } = useBrands(100);

  const handleRefresh = () => window.location.reload();
  const handleAddClick = () => {
    setEditingProduct({
        name: '', base_price: 0, status: 'active', is_featured: false,
        product_variants: [], product_images: [], product_specifications: []
    });
    setModalOpen(true);
  };
  const handleEditClick = (p) => {
    setEditingProduct(p);
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Quản lý sản phẩm</h1>
        
        <ProductFilters 
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          brandFilter={brandFilter} setBrandFilter={setBrandFilter}
          categories={categories} brands={brands}
          onSearch={handleRefresh} 
          onAddClick={handleAddClick} 
          onRefresh={handleRefresh} 
          loading={loadingProducts}
        />

        <ProductTable 
          products={products} 
          loading={loadingProducts} 
          onEdit={handleEditClick} 
          onDelete={(id) => console.log('Delete', id)} 
        />

        {products.length >= limit && !loadingProducts && (
          <div className="flex justify-center mt-12 pb-10">
            <button 
              onClick={() => setLimit(prev => prev + 24)}
              className="px-10 py-3.5 bg-white hover:bg-slate-100 text-indigo-600 rounded-xl font-black text-sm transition-all shadow-xl shadow-slate-50/50 border border-slate-100 flex items-center gap-2"
            >
              <PackagePlus size={18} /> Xem thêm sản phẩm
            </button>
          </div>
        )}
      </div>

      <ProductEditModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        product={editingProduct}
        setProduct={setEditingProduct}
        categories={categories}
        brands={brands}
      />
    </div>
  );
};

export default AdminProductsPage;