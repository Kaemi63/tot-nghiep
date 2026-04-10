import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';

export const useAdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [limit, setLimit] = useState(24);

  const getToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Vui lòng đăng nhập lại");
    return session.access_token;
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const params = {
        limit,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && { category_id: categoryFilter }),
        ...(brandFilter && { brand_id: brandFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
      };
      const data = await productService.getAdminProducts(token, params);
      setProducts(data);
    } catch (error) {
      toast.error(error.message || "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, brandFilter, statusFilter, limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const saveProduct = async (productData) => {
    setSaving(true);
    try {
      const token = await getToken();
      if (productData.id) {
        await productService.updateProduct(token, productData.id, productData);
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        await productService.createProduct(token, productData);
        toast.success("Tạo sản phẩm thành công!");
      }
      await fetchProducts();
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || "Có lỗi xảy ra");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = await getToken();
      await productService.deleteProduct(token, id);
      toast.success("Đã xóa sản phẩm!");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      toast.error(error.response?.data?.error || "Không thể xóa sản phẩm");
    }
  };

  return {
    products, loading, saving,
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    brandFilter, setBrandFilter,
    statusFilter, setStatusFilter,
    limit, setLimit,
    fetchProducts,
    saveProduct,
    deleteProduct,
  };
};
