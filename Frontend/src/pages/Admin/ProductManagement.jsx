// src/pages/Admin/ProductManagement.jsx
import React, { useState } from 'react';
import ProductFilters from '../../components/ProductManagement/ProductFilters';
import ProductTable from '../../components/ProductManagement/ProductTable';
import ProductEditModal from '../../components/ProductManagement/ProductEdit';
import { PackagePlus } from 'lucide-react';
import { useAdminProducts } from '../../hooks/useAdminProducts';
import { useCategories } from '../../services/useCategories';
import { useBrands } from '../../services/useBrands';

const EMPTY_PRODUCT = {
  name: '', slug: '', short_description: '', description: '',
  thumbnail_url: '', base_price: 0, status: 'active', is_featured: false,
  category_id: '', brand_id: '',
  product_variants: [],
  product_images: [],
  product_specifications: []
};

const AdminProductsPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(EMPTY_PRODUCT);

  const {
    products, loading, saving,
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    brandFilter, setBrandFilter,
    statusFilter, setStatusFilter,
    limit, setLimit,
    fetchProducts,
    saveProduct,
    deleteProduct,
  } = useAdminProducts();

  const { categories } = useCategories();
  const { brands } = useBrands(100);

  const handleAddClick = () => {
    setEditingProduct(EMPTY_PRODUCT);
    setModalOpen(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác!")) return;
    await deleteProduct(id);
  };

  const handleSave = async () => {
    const success = await saveProduct(editingProduct);
    if (success) setModalOpen(false);
  };

  const handleSearch = () => fetchProducts();

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Quản lý sản phẩm</h1>
          <span className="text-sm text-slate-400 font-semibold">{products.length} sản phẩm</span>
        </div>

        <ProductFilters
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
          brandFilter={brandFilter} setBrandFilter={setBrandFilter}
          statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          categories={categories} brands={brands}
          onSearch={handleSearch}
          onAddClick={handleAddClick}
          onRefresh={fetchProducts}
          loading={loading}
        />

        <ProductTable
          products={products}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />

        {products.length >= limit && !loading && (
          <div className="flex justify-center mt-12 pb-10">
            <button
              onClick={() => setLimit(prev => prev + 24)}
              className="px-10 py-3.5 bg-white hover:bg-slate-100 text-indigo-600 rounded-xl font-black text-sm transition-all shadow-xl border border-slate-100 flex items-center gap-2"
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
        onSave={handleSave}
        loadingSave={saving}
      />
    </div>
  );
};

export default AdminProductsPage;
