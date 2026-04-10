// src/components/ProductManagement/ProductEdit.jsx
import React, { useRef } from 'react';
import {
  X, Camera, Tag, PlusCircle, Trash2, Zap, Layers3,
  ChevronsUpDown, Info, Package, Image as ImageIcon,
  Scale, AlertTriangle, RefreshCw, Upload, Star
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

const ProductEditModal = ({ isOpen, onClose, product, setProduct, categories = [], brands = [], onSave, loadingSave }) => {
  const thumbnailInputRef = useRef(null);
  const albumInputRef = useRef(null);

  if (!isOpen) return null;
  const isAddMode = !product?.id;

  const inputClass = `w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none 
    transition-all font-medium focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 placeholder:font-normal text-sm`;
  const labelClass = "block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2";

  const SectionHeader = ({ icon: Icon, title, desc }) => (
    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-base font-black text-slate-900">{title}</h4>
        {desc && <p className="text-xs text-slate-500">{desc}</p>}
      </div>
    </div>
  );

  // ===================== UPLOAD ẢNH LÊN SUPABASE STORAGE =====================
  const uploadImageToStorage = async (file, folder = 'products') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
    const { error } = await supabase.storage.from('products').upload(fileName, file, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(fileName);
    return publicUrl;
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const toastId = toast.loading("Đang tải ảnh lên...");
    try {
      const url = await uploadImageToStorage(file, 'thumbnails');
      setProduct({ ...product, thumbnail_url: url });
      toast.success("Tải ảnh thành công!", { id: toastId });
    } catch (err) {
      toast.error("Lỗi tải ảnh: " + err.message, { id: toastId });
    }
  };

  const handleAlbumUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const toastId = toast.loading(`Đang tải ${files.length} ảnh...`);
    try {
      const urls = await Promise.all(files.map(f => uploadImageToStorage(f, 'album')));
      const newImages = urls.map((url, idx) => ({
        image_url: url,
        sort_order: (product.product_images?.length || 0) + idx
      }));
      setProduct({ ...product, product_images: [...(product.product_images || []), ...newImages] });
      toast.success(`Đã tải ${files.length} ảnh!`, { id: toastId });
    } catch (err) {
      toast.error("Lỗi tải ảnh: " + err.message, { id: toastId });
    }
  };

  // ===================== VARIANTS =====================
  const handleVariantChange = (idx, field, value) => {
    const updated = [...(product.product_variants || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setProduct({ ...product, product_variants: updated });
  };
  const addVariant = () => setProduct({
    ...product,
    product_variants: [...(product.product_variants || []), { sku: '', variant_name: '', price: product.base_price || 0, stock_quantity: 0, color: '', size: '' }]
  });
  const removeVariant = (idx) => setProduct({
    ...product,
    product_variants: (product.product_variants || []).filter((_, i) => i !== idx)
  });

  // ===================== IMAGES =====================
  const handleImageChange = (idx, field, value) => {
    const updated = [...(product.product_images || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setProduct({ ...product, product_images: updated });
  };
  const addImageManual = () => setProduct({
    ...product,
    product_images: [...(product.product_images || []), { image_url: '', sort_order: product.product_images?.length || 0 }]
  });
  const removeImage = (idx) => setProduct({
    ...product,
    product_images: (product.product_images || []).filter((_, i) => i !== idx)
  });

  // ===================== SPECS =====================
  const handleSpecChange = (idx, field, value) => {
    const updated = [...(product.product_specifications || [])];
    updated[idx] = { ...updated[idx], [field]: value };
    setProduct({ ...product, product_specifications: updated });
  };
  const addSpec = () => setProduct({
    ...product,
    product_specifications: [...(product.product_specifications || []), { spec_name: '', spec_value: '' }]
  });
  const removeSpec = (idx) => setProduct({
    ...product,
    product_specifications: (product.product_specifications || []).filter((_, i) => i !== idx)
  });

  // Flatten categories
  const flatCategories = categories.flatMap(cat => [cat, ...(cat.children || [])]);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl w-full max-w-7xl shadow-2xl flex flex-col h-[92vh] overflow-hidden animate-in zoom-in-95 duration-300">

        {/* HEADER */}
        <div className="px-8 pt-7 pb-5 border-b border-slate-100 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              {isAddMode ? <Package size={28} /> : <ImageIcon size={28} />}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {isAddMode ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {product.id ? `ID: ${product.id}` : "Điền đầy đủ thông tin sản phẩm"}
                {product.status && <span className={`ml-4 font-bold ${product.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>● {product.status}</span>}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600">
            <X size={22} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">

          {/* SECTION 1: Thông tin cơ bản */}
          <section>
            <SectionHeader icon={Info} title="Thông tin cơ bản" desc="Tên, mô tả, danh mục, thương hiệu, giá" />
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-2 space-y-5">
                <div>
                  <label className={labelClass}>Tên sản phẩm <span className="text-rose-500">*</span></label>
                  <input type="text" className={inputClass} value={product.name || ''} onChange={(e) => setProduct({ ...product, name: e.target.value })} placeholder="Nhập tên sản phẩm..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Slug (URL)</label>
                    <input type="text" className={inputClass} value={product.slug || ''} onChange={(e) => setProduct({ ...product, slug: e.target.value })} placeholder="vd: ao-thun-oversize" />
                  </div>
                  <div>
                    <label className={labelClass}>Giá gốc (VND) <span className="text-rose-500">*</span></label>
                    <input type="number" className={`${inputClass} font-extrabold text-indigo-700`} value={product.base_price || 0} onChange={(e) => setProduct({ ...product, base_price: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Mô tả ngắn</label>
                  <textarea className={`${inputClass} h-20 resize-none`} value={product.short_description || ''} onChange={(e) => setProduct({ ...product, short_description: e.target.value })} placeholder="Mô tả ngắn gọn về sản phẩm..." />
                </div>
                <div>
                  <label className={labelClass}>Mô tả chi tiết</label>
                  <textarea className={`${inputClass} h-28 resize-none`} value={product.description || ''} onChange={(e) => setProduct({ ...product, description: e.target.value })} placeholder="Mô tả đầy đủ về sản phẩm..." />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}><Layers3 size={12} className="inline mr-1" />Danh mục</label>
                  <select className={`${inputClass} cursor-pointer`} value={product.category_id || ''} onChange={(e) => setProduct({ ...product, category_id: e.target.value })}>
                    <option value="">Chọn danh mục...</option>
                    {flatCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.parent_id ? `  └ ${cat.name}` : cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}><Zap size={12} className="inline mr-1" />Thương hiệu</label>
                  <select className={`${inputClass} cursor-pointer`} value={product.brand_id || ''} onChange={(e) => setProduct({ ...product, brand_id: e.target.value })}>
                    <option value="">Chọn thương hiệu...</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Trạng thái</label>
                  <select className={`${inputClass} cursor-pointer`} value={product.status || 'draft'} onChange={(e) => setProduct({ ...product, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer" onClick={() => setProduct({ ...product, is_featured: !product.is_featured })}>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${product.is_featured ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                    {product.is_featured && <Star size={12} className="text-white fill-white" />}
                  </div>
                  <label className="text-sm font-bold text-slate-700 cursor-pointer">Sản phẩm nổi bật (Featured)</label>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Media */}
          <section>
            <SectionHeader icon={ImageIcon} title="Media & Ảnh sản phẩm" desc="Ảnh đại diện và album ảnh — upload lên Supabase Storage" />
            <div className="grid grid-cols-3 gap-6">

              {/* Thumbnail */}
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <label className={`${labelClass} mb-3`}>Ảnh đại diện (Thumbnail)</label>
                <div className="relative group w-36 h-36 mb-4 border-4 border-white rounded-2xl shadow-xl overflow-hidden cursor-pointer" onClick={() => thumbnailInputRef.current?.click()}>
                  <img src={product.thumbnail_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white mb-1" size={22} />
                    <span className="text-white text-[10px] font-bold">Tải ảnh lên</span>
                  </div>
                </div>
                <input ref={thumbnailInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                <button onClick={() => thumbnailInputRef.current?.click()} className="text-xs font-bold text-indigo-600 hover:underline mb-2">
                  Chọn file ảnh
                </button>
                <p className="text-[10px] text-slate-400 mb-2">hoặc paste URL:</p>
                <input type="text" className={`${inputClass} text-center text-xs`} value={product.thumbnail_url || ''} onChange={(e) => setProduct({ ...product, thumbnail_url: e.target.value })} placeholder="https://..." />
              </div>

              {/* Album */}
              <div className="col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <label className={labelClass}>Album ảnh ({product.product_images?.length || 0} ảnh)</label>
                  <button
                    onClick={() => albumInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                  >
                    <Upload size={14} /> Tải ảnh lên
                  </button>
                  <input ref={albumInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAlbumUpload} />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {(product.product_images || []).map((img, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
                      <img src={img.image_url || 'https://via.placeholder.com/50'} className="w-11 h-11 rounded-lg object-cover border border-slate-100 shrink-0" alt="" />
                      <input type="text" className={`${inputClass} flex-1 text-xs`} value={img.image_url || ''} onChange={(e) => handleImageChange(idx, 'image_url', e.target.value)} placeholder="URL ảnh..." />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] text-slate-400">Thứ tự:</span>
                        <input type="number" className={`${inputClass} w-14 text-center text-xs`} value={img.sort_order ?? idx} onChange={(e) => handleImageChange(idx, 'sort_order', parseInt(e.target.value) || 0)} />
                      </div>
                      <button onClick={() => removeImage(idx)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={addImageManual} className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-xs">
                  <PlusCircle size={16} /> Thêm URL ảnh thủ công
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: Variants */}
          <section>
            <SectionHeader icon={ChevronsUpDown} title="Biến thể sản phẩm" desc="Màu sắc, kích cỡ, SKU, giá và tồn kho chi tiết" />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              {product.id && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-700 items-start mb-4">
                  <AlertTriangle className="shrink-0 mt-0.5" size={16} />
                  <p className="text-xs font-medium">SKU nên theo định dạng: <span className="font-mono bg-amber-100 px-1 rounded">MÃ_SẢN_PHẨM_MÀU_SIZE</span></p>
                </div>
              )}

              <div className="grid grid-cols-12 gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">
                <div className="col-span-3">SKU</div>
                <div className="col-span-2">Tên biến thể</div>
                <div className="col-span-2">Màu sắc</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-2">Giá (VND)</div>
                <div className="col-span-1">Tồn kho</div>
                <div className="col-span-1 text-right">Xóa</div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(product.product_variants || []).map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm group hover:shadow-md transition-all">
                    <div className="col-span-3">
                      <input type="text" className={inputClass} value={v.sku || ''} onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)} placeholder="SKU..." />
                    </div>
                    <div className="col-span-2">
                      <input type="text" className={inputClass} value={v.variant_name || ''} onChange={(e) => handleVariantChange(idx, 'variant_name', e.target.value)} placeholder="Tên..." />
                    </div>
                    <div className="col-span-2">
                      <input type="text" className={inputClass} value={v.color || ''} onChange={(e) => handleVariantChange(idx, 'color', e.target.value)} placeholder="Màu..." />
                    </div>
                    <div className="col-span-1">
                      <input type="text" className={inputClass} value={v.size || ''} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} placeholder="Size" />
                    </div>
                    <div className="col-span-2">
                      <input type="number" className={`${inputClass} font-bold text-indigo-700`} value={v.price || 0} onChange={(e) => handleVariantChange(idx, 'price', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-1">
                      <input type="number" className={`${inputClass} font-bold ${v.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-500'}`} value={v.stock_quantity || 0} onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-1 flex justify-end items-center">
                      <button onClick={() => removeVariant(idx)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg opacity-50 group-hover:opacity-100 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={addVariant} className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-white transition-all font-bold text-sm active:scale-[0.98]">
                <PlusCircle size={18} /> Thêm biến thể
              </button>
            </div>
          </section>

          {/* SECTION 4: Specifications */}
          <section>
            <SectionHeader icon={Info} title="Thông số kỹ thuật" desc="Chất liệu, xuất xứ và các thông số chi tiết khác" />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {(product.product_specifications || []).map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3 items-center bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
                    <input type="text" className={inputClass} value={spec.spec_name || ''} onChange={(e) => handleSpecChange(idx, 'spec_name', e.target.value)} placeholder="Tên thông số (vd: Chất liệu, Xuất xứ...)" />
                    <div className="flex gap-2">
                      <input type="text" className={`${inputClass} flex-1`} value={spec.spec_value || ''} onChange={(e) => handleSpecChange(idx, 'spec_value', e.target.value)} placeholder="Giá trị..." />
                      <button onClick={() => removeSpec(idx)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addSpec} className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-sm">
                <PlusCircle size={17} /> Thêm thông số kỹ thuật
              </button>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white rounded-b-3xl shrink-0 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">
            {isAddMode ? "Sản phẩm mới sẽ được tạo ngay sau khi lưu" : `Cập nhật lần cuối: ${product.updated_at ? new Date(product.updated_at).toLocaleString('vi-VN') : '—'}`}
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-6 py-3 font-extrabold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">
              Hủy bỏ
            </button>
            <button
              onClick={onSave}
              disabled={loadingSave}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-extrabold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2"
            >
              {loadingSave ? <RefreshCw size={18} className="animate-spin" /> : <Tag size={18} />}
              {isAddMode ? "Tạo sản phẩm" : "Lưu thay đổi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;
