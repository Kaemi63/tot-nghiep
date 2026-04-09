import React, { useState, useEffect } from 'react';
import { X, Camera, Tag, PlusCircle, Trash2, Zap, Layers3, ChevronsUpDown, Info, Package, Image as ImageIcon, Scale, AlertTriangle } from 'lucide-react';
import { fmt } from '../../utils/format.js';

const ProductEditModal = ({ isOpen, onClose, product, setProduct, categories = [], brands = [], onSave, loadingSave }) => {
  if (!isOpen) return null;
  const isAddMode = !product.id;

  // getInputClass tuân thủ style của UserEditModal
  const getInputClass = () => `
    w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none 
    transition-all font-medium focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 placeholder:font-normal text-sm
  `;
  const getLabelClass = () => "block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2";

  // Section Header tuân thủ style
  const SectionHeader = ({ icon: Icon, title, desc }) => (
    <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
        <Icon size={22} />
      </div>
      <div>
        <h4 className="text-lg font-black text-slate-900 leading-tight">{title}</h4>
        {desc && <p className="text-sm text-slate-500 font-medium">{desc}</p>}
      </div>
    </div>
  );

  // --- LOGIC QUẢN LÝ BIẾN THỂ (Variants) ---
  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...(product.product_variants || [])];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    setProduct({ ...product, product_variants: updatedVariants });
  };
  const addVariant = () => {
    setProduct({
      ...product,
      product_variants: [...(product.product_variants || []), { sku: '', price: product.base_price || 0, stock_quantity: 1, color: '', size: '' }]
    });
  };
  const removeVariant = (index) => {
    const updatedVariants = (product.product_variants || []).filter((_, i) => i !== index);
    setProduct({ ...product, product_variants: updatedVariants });
  };

  // --- LOGIC QUẢN LÝ THÔNG SỐ (Specifications) ---
  const handleSpecChange = (index, field, value) => {
    const updatedSpecs = [...(product.product_specifications || [])];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setProduct({ ...product, product_specifications: updatedSpecs });
  };
  const addSpec = () => {
    setProduct({
      ...product,
      product_specifications: [...(product.product_specifications || []), { spec_name: '', spec_value: '' }]
    });
  };
  const removeSpec = (index) => {
    const updatedSpecs = (product.product_specifications || []).filter((_, i) => i !== index);
    setProduct({ ...product, product_specifications: updatedSpecs });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      {/* Modal width cực lớn cho sản phẩm */}
      <div className="bg-white rounded-3xl p-0 w-full max-w-7xl shadow-2xl animate-in zoom-in-95 duration-300 relative flex flex-col h-[90vh] overflow-hidden">
        
        {/* HEADER MOdal */}
        <div className="px-8 pt-8 pb-6 border-b border-slate-100 shrink-0">
          <button onClick={onClose} className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
            <X size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black border-4 border-indigo-100 shadow-md">
              {isAddMode ? <Package size={32} /> : <ImageIcon size={32} />}
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                {isAddMode ? "Thêm sản phẩm mới" : "Chỉnh sửa sản phẩm"}
              </h2>
              <p className="text-slate-500 text-sm mt-1 font-medium flex gap-6 uppercase tracking-wider text-[11px] font-bold">
                {product.id ? `ID: ${product.id}` : "Nhập thông tin sản phẩm FSA"}
                {product.status && (
                  <span className={`font-black ${product.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    Trạng thái: {product.status}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* CONTENT Modal - Có Scrollbar */}
        <div className="flex-1 overflow-y-auto p-8 space-y-12 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          
          {/* SECTION 1: Thông tin chung */}
          <section>
            <SectionHeader icon={Info} title="Thông tin cơ bản" desc="Tên, mô tả, phân loại và giá bán gốc" />
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-4 space-y-6">
                <div>
                  <label className={getLabelClass()}>Tên sản phẩm <span className="text-rose-500">*</span></label>
                  <input type="text" className={getInputClass()} value={product.name || ''} onChange={(e) => setProduct({...product, name: e.target.value})} placeholder="Nhập tên sản phẩm FSA..." required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className={getLabelClass()}>SKU Gốc (Dùng cho ảnh)</label>
                    <input type="text" className={getInputClass()} value={product.slug || ''} onChange={(e) => setProduct({...product, slug: e.target.value})} placeholder="Dùng tên slug làm SKU gốc..." />
                  </div>
                  <div>
                    <label className={getLabelClass()}>Giá bán gốc (VND) <span className="text-rose-500">*</span></label>
                    <input type="number" className={`${getInputClass()} font-extrabold text-indigo-700`} value={product.base_price || 0} onChange={(e) => setProduct({...product, base_price: parseInt(e.target.value, 10)})} required />
                  </div>
                </div>
                <div>
                  <label className={getLabelClass()}>Mô tả ngắn</label>
                  <textarea className={`${getInputClass()} h-20 resize-none`} value={product.short_description || ''} onChange={(e) => setProduct({...product, short_description: e.target.value})} placeholder="Nhập mô tả ngắn gọn..." />
                </div>
              </div>

              {/* Phân loại & Ảnh Media */}
              <div className="col-span-2 space-y-6">
                <div>
                  <label className={getLabelClass()}><Layers3 size={14}/>Danh mục</label>
                  <select className={`${getInputClass()} font-bold text-slate-700 cursor-pointer`} value={product.category_id || ''} onChange={(e) => setProduct({...product, category_id: e.target.value})} required>
                    <option value="">Chọn danh mục...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={getLabelClass()}><Zap size={14}/>Thương hiệu</label>
                  <select className={`${getInputClass()} font-bold text-slate-700 cursor-pointer`} value={product.brand_id || ''} onChange={(e) => setProduct({...product, brand_id: e.target.value})}>
                    <option value="">Chọn thương hiệu...</option>
                    {brands.map(brand => <option key={brand.id} value={brand.id}>{brand.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={getLabelClass()}>Trạng thái</label>
                    <select className={`${getInputClass()} font-bold text-slate-700`} value={product.status || 'draft'} onChange={(e) => setProduct({...product, status: e.target.value})}>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 2: Media */}
          <section>
            <SectionHeader icon={ImageIcon} title="Media & Ảnh sản phẩm" desc="Ảnh đại diện và album ảnh sản phẩm" />
            <div className="grid grid-cols-6 gap-8">
              {/* PHẦN THUMBNAIL */}
              <div className="col-span-2 flex flex-col items-center p-6 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/50">
                <label className={getLabelClass()}>Ảnh đại diện (Thumbnail)</label>
                <div className="relative group w-40 h-40 mt-2 mb-4 border-4 border-white rounded-3xl shadow-xl overflow-hidden shadow-indigo-50/50">
                  <img src={product.thumbnail_url || 'https://via.placeholder.com/150'} className="w-full h-full object-cover rounded-3xl" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="text-white" size={28} />
                  </div>
                </div>
                <input type="text" placeholder="Dán URL ảnh đại diện..." className={`${getInputClass()} text-center`} value={product.thumbnail_url || ''} onChange={(e) => setProduct({...product, thumbnail_url: e.target.value})} />
              </div>
              
              {/* PHẦN ALBUM ẢNH */}
              <div className="col-span-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <label className={getLabelClass()}>Album ảnh sản phẩm (product_images)</label>
                <div className="space-y-3 mt-4">
                  {(product.product_images || []).map((img, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
                      <img src={img.image_url || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0" alt="" />
                      <input type="text" className={getInputClass()} value={img.image_url} onChange={(e) => handleSpecChange(idx, 'image_url', e.target.value)} placeholder="URL ảnh..." />
                      <input type="number" className={`${getInputClass()} w-20 text-centershrink-0`} value={img.sort_order} onChange={(e) => handleSpecChange(idx, 'sort_order', parseInt(e.target.value, 10))} />
                      <button onClick={() => removeSpec(idx)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"><Trash2 size={18} /></button>
                    </div>
                  ))}
                  <button onClick={addSpec} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-sm">
                    <PlusCircle size={18} /> Thêm ảnh vào album
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 3: Biến thể (Variants) */}
          <section>
            <SectionHeader icon={ChevronsUpDown} title="Biến thể sản phẩm (product_variants)" desc="Quản lý Màu sắc, Kích cỡ, SKU, Giá và Tồn kho chi tiết" />
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="space-y-4">
                {/* Tiêu đề bảng variants */}
                <div className="grid grid-cols-12 gap-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest px-4">
                  <div className="col-span-3">SKU (product_id + _COLOR_SIZE)</div>
                  <div className="col-span-2">Màu sắc</div>
                  <div className="col-span-2">Kích cỡ (Size)</div>
                  <div className="col-span-2">Giá biến thể</div>
                  <div className="col-span-2">Tồn kho</div>
                  <div className="col-span-1 text-right">Xóa</div>
                </div>
                
                {/* Danh sách variants */}
                {(product.product_variants || []).map((v, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md group">
                    <div className="col-span-3">
                      <input type="text" className={getInputClass()} value={v.sku || ''} onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)} placeholder="Nhập SKU..." />
                    </div>
                    <div className="col-span-2 relative">
                      <input type="text" className={getInputClass()} value={v.color || ''} onChange={(e) => handleVariantChange(idx, 'color', e.target.value)} placeholder="Màu..." />
                      {v.color && <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded border" style={{backgroundColor: v.color}} title={v.color}></div>}
                    </div>
                    <div className="col-span-2 relative">
                      <input type="text" className={getInputClass()} value={v.size || ''} onChange={(e) => handleVariantChange(idx, 'size', e.target.value)} placeholder="Size..." />
                      <Scale className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    </div>
                    <div className="col-span-2 relative">
                      <input type="number" className={`${getInputClass()} font-extrabold text-indigo-700`} value={v.price || 0} onChange={(e) => handleVariantChange(idx, 'price', parseInt(e.target.value, 10))} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-indigo-300 font-extrabold">VND</span>
                    </div>
                    <div className="col-span-2">
                      <input type="number" className={`${getInputClass()} font-bold ${v.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-500'}`} value={v.stock_quantity || 0} onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value, 10))} />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button onClick={() => removeVariant(idx)} className="p-2 text-rose-400 group-hover:bg-rose-50 group-hover:text-rose-600 rounded-lg shrink-0 opacity-40 group-hover:opacity-100 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Nút thêm mới */}
                {product.id && <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3 text-amber-700 items-start mb-2 mt-4 animate-in fade-in duration-300">
                  <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-bold text-sm">Lưu ý khi thêm biến thể:</p>
                    <p className="text-[12px]">Hệ thống FSA mong muốn SKU biến thể có định dạng: <span className="font-mono bg-amber-100 px-1 rounded">MÃ_SẢN_PHẨM + _ + MÀU_SẮC + _ + SIZE</span> (ví dụ: <span className="font-mono bg-amber-100 px-1 rounded">OVERCOAT_NAVY_41</span>). Hãy điền SKU chuẩn để đồng bộ dữ liệu.</p>
                  </div>
                </div>}
                <button onClick={addVariant} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-white transition-all font-black text-sm active:scale-[0.98]">
                  <PlusCircle size={19} /> Thêm biến thể Màu sắc / Kích cỡ
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 4: Thông số kỹ thuật (Specifications) */}
          <section>
            <SectionHeader icon={Info} title="Thông số kỹ thuật" desc="Quản lý chi tiết kỹ thuật, chất liệu, nguồn gốc (product_specifications)" />
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="space-y-3 mt-4">
                {(product.product_specifications || []).map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-3 items-center bg-white border border-slate-100 p-2.5 rounded-xl shadow-sm">
                    <input type="text" className={getInputClass()} value={spec.spec_name || ''} onChange={(e) => handleSpecChange(idx, 'spec_name', e.target.value)} placeholder="Tên thông số (Ví dụ: Chất liệu)..." />
                    <div className="flex gap-2">
                      <input type="text" className={`${getInputClass()} flex-1`} value={spec.spec_value || ''} onChange={(e) => handleSpecChange(idx, 'spec_value', e.target.value)} placeholder="Giá trị..." />
                      <button onClick={() => removeSpec(idx)} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
                <button onClick={addSpec} className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-sm">
                  <PlusCircle size={18} /> Thêm thông số kỹ thuật mới
                </button>
              </div>
            </div>
          </section>

        </div>

        {/* FOOTER MOdal - Chứa các nút thao tác */}
        <div className="px-8 py-6 border-t border-slate-100 bg-white rounded-b-3xl shrink-0 flex justify-end gap-3.5 shadow-inner">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-8 py-3.5 font-extrabold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
          >
            Hủy bỏ
          </button>
          
          <button 
            type="submit" 
            onClick={onSave}
            disabled={loadingSave}
            className="px-10 py-3.5 bg-indigo-600 text-white rounded-xl font-extrabold hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2.5"
          >
            {loadingSave ? <RefreshCw size={19} className="animate-spin" /> : <Tag size={19} />}
            {isAddMode ? "Tạo sản phẩm" : "Lưu thay đổi FSA"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductEditModal;