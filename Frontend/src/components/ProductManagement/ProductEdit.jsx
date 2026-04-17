import React, { useRef, useState } from 'react';
import {
  X, Camera, Tag, PlusCircle, Trash2, Zap, Layers3,
  ChevronsUpDown, Info, Package, Image as ImageIcon,
  Scale, AlertTriangle, RefreshCw, Upload, Star,
  Palette, Ruler, ChevronDown, ChevronUp, Eye, EyeOff,
  Copy, Check
} from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import toast from 'react-hot-toast';

// ===================== CONSTANTS =====================
const PRESET_COLORS = [
  { label: 'Đen', value: 'Đen', hex: '#1a1a1a' },
  { label: 'Trắng', value: 'Trắng', hex: '#f5f5f5' },
  { label: 'Xám', value: 'Xám', hex: '#6b7280' },
  { label: 'Đỏ', value: 'Đỏ', hex: '#ef4444' },
  { label: 'Hồng', value: 'Hồng', hex: '#ec4899' },
  { label: 'Cam', value: 'Cam', hex: '#f97316' },
  { label: 'Vàng', value: 'Vàng', hex: '#eab308' },
  { label: 'Xanh lá', value: 'Xanh lá', hex: '#22c55e' },
  { label: 'Xanh dương', value: 'Xanh dương', hex: '#3b82f6' },
  { label: 'Xanh navy', value: 'Xanh navy', hex: '#1e3a5f' },
  { label: 'Tím', value: 'Tím', hex: '#a855f7' },
  { label: 'Nâu', value: 'Nâu', hex: '#92400e' },
  { label: 'Be', value: 'Be', hex: '#d4b896' },
  { label: 'Xanh rêu', value: 'Xanh rêu', hex: '#4d7c0f' },
];

const PRESET_SIZES_CLOTHES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'];
const PRESET_SIZES_SHOES = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

// ===================== SUB-COMPONENTS =====================
const SectionHeader = ({ icon: Icon, title, desc, count }) => (
  <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100 shrink-0">
      <Icon size={20} />
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h4 className="text-base font-black text-slate-900">{title}</h4>
        {count !== undefined && (
          <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{count}</span>
        )}
      </div>
      {desc && <p className="text-xs text-slate-500">{desc}</p>}
    </div>
  </div>
);

// Color picker inline
const ColorPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const selected = PRESET_COLORS.find(c => c.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 transition-all"
      >
        {selected
          ? <span className="w-4 h-4 rounded-full border border-white shadow shrink-0" style={{ background: selected.hex }} />
          : <Palette size={14} className="text-slate-400" />
        }
        <span className="truncate flex-1 text-left">{value || 'Chọn màu...'}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Màu có sẵn</p>
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {PRESET_COLORS.map(c => (
              <button
                key={c.value}
                type="button"
                title={c.label}
                onClick={() => { onChange(c.value); setOpen(false); }}
                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${value === c.value ? 'border-indigo-500 scale-110' : 'border-transparent'}`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
          <div className="border-t border-slate-100 pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Nhập tên màu khác</p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
                placeholder="VD: Xanh pastel..."
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && custom.trim()) { onChange(custom.trim()); setCustom(''); setOpen(false); } }}
              />
              <button
                type="button"
                onClick={() => { if (custom.trim()) { onChange(custom.trim()); setCustom(''); setOpen(false); } }}
                className="px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
              >OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Size picker
const SizePicker = ({ value, onChange, category = 'clothes' }) => {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');
  const presets = category === 'shoes' ? PRESET_SIZES_SHOES : PRESET_SIZES_CLOTHES;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:border-indigo-300 transition-all"
      >
        <Ruler size={14} className="text-slate-400 shrink-0" />
        <span className="flex-1 text-left font-bold">{value || 'Chọn size...'}</span>
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Size phổ biến</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {presets.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => { onChange(s); setOpen(false); }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all hover:scale-105 ${value === s ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-300'}`}
              >{s}</button>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Size khác</p>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-400"
                placeholder="VD: 42.5, Oversize..."
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && custom.trim()) { onChange(custom.trim()); setCustom(''); setOpen(false); } }}
              />
              <button
                type="button"
                onClick={() => { if (custom.trim()) { onChange(custom.trim()); setCustom(''); setOpen(false); } }}
                className="px-2.5 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700"
              >OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== MAIN COMPONENT =====================
const ProductEditModal = ({ isOpen, onClose, product, setProduct, categories = [], brands = [], onSave, loadingSave }) => {
  const thumbnailInputRef = useRef(null);
  const albumInputRef = useRef(null);
  const [expandedVariant, setExpandedVariant] = useState(null);

  if (!isOpen) return null;
  const isAddMode = !product?.id;

  const inputClass = `w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl outline-none 
    transition-all font-medium focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-400 placeholder:font-normal text-sm`;
  const labelClass = "block text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2";

  // ===================== UPLOAD =====================
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

  const addVariant = () => {
    const newIdx = (product.product_variants || []).length;
    setProduct({
      ...product,
      product_variants: [
        ...(product.product_variants || []),
        { sku: '', variant_name: '', price: product.base_price || 0, stock_quantity: 0, color: '', size: '' }
      ]
    });
    setExpandedVariant(newIdx);
  };

  // Duplicate một variant
  const duplicateVariant = (idx) => {
    const src = product.product_variants[idx];
    const copy = { ...src, id: undefined, sku: src.sku + '_copy' };
    const updated = [...product.product_variants];
    updated.splice(idx + 1, 0, copy);
    setProduct({ ...product, product_variants: updated });
    setExpandedVariant(idx + 1);
    toast.success('Đã nhân đôi biến thể');
  };

  const removeVariant = (idx) => {
    setProduct({
      ...product,
      product_variants: (product.product_variants || []).filter((_, i) => i !== idx)
    });
    if (expandedVariant === idx) setExpandedVariant(null);
  };

  // Auto-generate SKU từ tên, màu, size
  const autoSku = (idx) => {
    const v = product.product_variants[idx];
    const baseName = (product.name || '').toUpperCase().replace(/\s+/g, '_').slice(0, 10);
    const color = (v.color || '').toUpperCase().replace(/\s+/g, '').slice(0, 5);
    const size = (v.size || '').replace(/\s+/g, '');
    const sku = [baseName, color, size].filter(Boolean).join('_');
    handleVariantChange(idx, 'sku', sku);
  };

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

  // Move image up/down
  const moveImage = (idx, dir) => {
    const imgs = [...(product.product_images || [])];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= imgs.length) return;
    [imgs[idx], imgs[newIdx]] = [imgs[newIdx], imgs[idx]];
    imgs.forEach((img, i) => img.sort_order = i);
    setProduct({ ...product, product_images: imgs });
  };

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

  // Quick-add spec templates
  const SPEC_TEMPLATES = [
    { spec_name: 'Chất liệu', spec_value: '' },
    { spec_name: 'Xuất xứ', spec_value: 'Việt Nam' },
    { spec_name: 'Cân nặng', spec_value: '' },
    { spec_name: 'Kích thước', spec_value: '' },
    { spec_name: 'Màu sắc', spec_value: '' },
    { spec_name: 'Bảo hành', spec_value: '12 tháng' },
  ];

  const addSpecTemplate = (tpl) => {
    const exists = (product.product_specifications || []).some(s => s.spec_name === tpl.spec_name);
    if (exists) { toast.error(`"${tpl.spec_name}" đã có rồi`); return; }
    setProduct({
      ...product,
      product_specifications: [...(product.product_specifications || []), { ...tpl }]
    });
  };

  const flatCategories = categories.flatMap(cat => [cat, ...(cat.children || [])]);

  const variants = product.product_variants || [];
  const images = product.product_images || [];
  const specs = product.product_specifications || [];

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
                {product.status && (
                  <span className={`ml-4 font-bold ${product.status === 'active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    ● {product.status}
                  </span>
                )}
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
                      <option key={cat.id} value={cat.id}>{cat.parent_id ? `  └ ${cat.name}` : cat.name}</option>
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
                <div
                  className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer"
                  onClick={() => setProduct({ ...product, is_featured: !product.is_featured })}
                >
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
            <SectionHeader icon={ImageIcon} title="Media & Ảnh sản phẩm" desc="Ảnh đại diện và album ảnh" count={images.length} />
            <div className="grid grid-cols-3 gap-6">
              {/* Thumbnail */}
              <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <label className={`${labelClass} mb-3`}>Ảnh đại diện (Thumbnail)</label>
                <div
                  className="relative group w-36 h-36 mb-4 border-4 border-white rounded-2xl shadow-xl overflow-hidden cursor-pointer"
                  onClick={() => thumbnailInputRef.current?.click()}
                >
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
                <input
                  type="text"
                  className={`${inputClass} text-center text-xs`}
                  value={product.thumbnail_url || ''}
                  onChange={(e) => setProduct({ ...product, thumbnail_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              {/* Album */}
              <div className="col-span-2 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <label className={labelClass}>Album ảnh ({images.length} ảnh)</label>
                  <button
                    onClick={() => albumInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all"
                  >
                    <Upload size={14} /> Tải nhiều ảnh
                  </button>
                  <input ref={albumInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAlbumUpload} />
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {images.map((img, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-white border border-slate-100 p-2 rounded-xl shadow-sm group">
                      {/* Preview */}
                      <img
                        src={img.image_url || 'https://via.placeholder.com/50'}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                        alt=""
                        onError={e => e.target.src = 'https://via.placeholder.com/50'}
                      />
                      {/* URL */}
                      <input
                        type="text"
                        className={`${inputClass} flex-1 text-xs`}
                        value={img.image_url || ''}
                        onChange={(e) => handleImageChange(idx, 'image_url', e.target.value)}
                        placeholder="URL ảnh..."
                      />
                      {/* Reorder */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          onClick={() => moveImage(idx, -1)}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30 transition-all"
                        ><ChevronUp size={13} /></button>
                        <button
                          onClick={() => moveImage(idx, 1)}
                          disabled={idx === images.length - 1}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded disabled:opacity-30 transition-all"
                        ><ChevronDown size={13} /></button>
                      </div>
                      {/* Sort order badge */}
                      <span className="text-[10px] font-black text-slate-400 w-6 text-center shrink-0">#{idx + 1}</span>
                      {/* Delete */}
                      <button
                        onClick={() => removeImage(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 opacity-50 group-hover:opacity-100 transition-all"
                      ><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addImageManual}
                  className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-xs"
                >
                  <PlusCircle size={16} /> Thêm URL ảnh thủ công
                </button>
              </div>
            </div>
          </section>

          {/* SECTION 3: Variants — CẢI TIẾN CHÍNH */}
          <section>
            <SectionHeader
              icon={ChevronsUpDown}
              title="Biến thể sản phẩm"
              desc="Chọn màu sắc và size từ danh sách hoặc nhập tùy chỉnh"
              count={variants.length}
            />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">

              {/* Summary chips hiển thị màu + size hiện có */}
              {variants.length > 0 && (
                <div className="mb-5 p-4 bg-white rounded-xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Tổng quan biến thể hiện có</p>
                  <div className="flex flex-wrap gap-2">
                    {/* Unique colors */}
                    {[...new Set(variants.filter(v => v.color).map(v => v.color))].map(color => {
                      const preset = PRESET_COLORS.find(c => c.value === color);
                      return (
                        <span key={color} className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-700">
                          {preset && <span className="w-3 h-3 rounded-full" style={{ background: preset.hex }} />}
                          <Palette size={11} className={preset ? 'hidden' : ''} />
                          {color}
                        </span>
                      );
                    })}
                    {/* Unique sizes */}
                    {[...new Set(variants.filter(v => v.size).map(v => v.size))].map(size => (
                      <span key={size} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600">
                        <Ruler size={11} /> {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Danh sách variants — accordion style */}
              <div className="space-y-2 mb-4">
                {variants.map((v, idx) => {
                  const isExpanded = expandedVariant === idx;
                  const colorPreset = PRESET_COLORS.find(c => c.value === v.color);
                  const stockColor = v.stock_quantity > 5 ? 'text-emerald-600' : v.stock_quantity > 0 ? 'text-amber-600' : 'text-rose-500';

                  return (
                    <div
                      key={idx}
                      className={`bg-white rounded-xl border transition-all ${isExpanded ? 'border-indigo-300 shadow-md' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}
                    >
                      {/* Accordion Header */}
                      <div
                        className="flex items-center gap-3 p-3 cursor-pointer"
                        onClick={() => setExpandedVariant(isExpanded ? null : idx)}
                      >
                        {/* Color dot */}
                        <div
                          className="w-8 h-8 rounded-lg border-2 border-white shadow shrink-0 flex items-center justify-center"
                          style={{ background: colorPreset?.hex || '#e2e8f0' }}
                          title={v.color || 'Chưa chọn màu'}
                        >
                          {!colorPreset && !v.color && <Palette size={14} className="text-slate-400" />}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-slate-800">
                              {v.color || <span className="text-slate-400 italic">Chưa chọn màu</span>}
                            </span>
                            {v.size && (
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-black rounded-md">
                                {v.size}
                              </span>
                            )}
                            {v.sku && <span className="text-[11px] text-slate-400 font-mono">{v.sku}</span>}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-indigo-700 font-bold">
                              {v.price?.toLocaleString('vi-VN')}đ
                            </span>
                            <span className={`text-xs font-bold ${stockColor}`}>
                              Tồn: {v.stock_quantity || 0}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={(e) => { e.stopPropagation(); duplicateVariant(idx); }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Nhân đôi biến thể"
                          ><Copy size={14} /></button>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeVariant(idx); }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Xóa biến thể"
                          ><Trash2 size={14} /></button>
                          {isExpanded ? <ChevronUp size={16} className="text-slate-400 ml-1" /> : <ChevronDown size={16} className="text-slate-400 ml-1" />}
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="px-4 pb-4 border-t border-slate-100 pt-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">

                            {/* Màu sắc */}
                            <div>
                              <label className={labelClass}><Palette size={11} className="inline mr-1" />Màu sắc</label>
                              <ColorPicker
                                value={v.color}
                                onChange={(val) => handleVariantChange(idx, 'color', val)}
                              />
                            </div>

                            {/* Size */}
                            <div>
                              <label className={labelClass}><Ruler size={11} className="inline mr-1" />Size</label>
                              <SizePicker
                                value={v.size}
                                onChange={(val) => handleVariantChange(idx, 'size', val)}
                              />
                            </div>

                            {/* SKU */}
                            <div>
                              <label className={labelClass}>SKU</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  className={`${inputClass} flex-1 font-mono text-xs`}
                                  value={v.sku || ''}
                                  onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                                  placeholder="VD: AOTHUN_DEN_L"
                                />
                                <button
                                  onClick={() => autoSku(idx)}
                                  className="px-3 py-2 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-bold transition-all whitespace-nowrap border border-slate-200"
                                  title="Tự tạo SKU từ tên + màu + size"
                                >
                                  Tự tạo
                                </button>
                              </div>
                            </div>

                            {/* Tên biến thể */}
                            <div>
                              <label className={labelClass}>Tên biến thể</label>
                              <input
                                type="text"
                                className={inputClass}
                                value={v.variant_name || ''}
                                onChange={(e) => handleVariantChange(idx, 'variant_name', e.target.value)}
                                placeholder="VD: Đen - L, Đỏ size M..."
                              />
                            </div>

                            {/* Giá */}
                            <div>
                              <label className={labelClass}>Giá bán (VND)</label>
                              <input
                                type="number"
                                className={`${inputClass} font-extrabold text-indigo-700`}
                                value={v.price || 0}
                                onChange={(e) => handleVariantChange(idx, 'price', parseInt(e.target.value) || 0)}
                              />
                            </div>

                            {/* Tồn kho */}
                            <div>
                              <label className={labelClass}>Tồn kho</label>
                              <input
                                type="number"
                                className={`${inputClass} font-extrabold ${v.stock_quantity > 0 ? 'text-emerald-700' : 'text-rose-500'}`}
                                value={v.stock_quantity || 0}
                                onChange={(e) => handleVariantChange(idx, 'stock_quantity', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={addVariant}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-indigo-200 rounded-xl text-indigo-500 hover:border-indigo-400 hover:text-indigo-700 hover:bg-white transition-all font-bold text-sm active:scale-[0.98]"
              >
                <PlusCircle size={18} /> Thêm biến thể mới
              </button>
            </div>
          </section>

          {/* SECTION 4: Specifications — CẢI TIẾN */}
          <section>
            <SectionHeader
              icon={Info}
              title="Thông số kỹ thuật"
              desc="Chất liệu, xuất xứ và các thông số chi tiết khác"
              count={specs.length}
            />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">

              {/* Quick-add templates */}
              <div className="mb-4">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Thêm nhanh</p>
                <div className="flex flex-wrap gap-2">
                  {SPEC_TEMPLATES.map(tpl => {
                    const exists = specs.some(s => s.spec_name === tpl.spec_name);
                    return (
                      <button
                        key={tpl.spec_name}
                        onClick={() => addSpecTemplate(tpl)}
                        disabled={exists}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          exists
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                        }`}
                      >
                        {exists ? <Check size={12} /> : <PlusCircle size={12} />}
                        {tpl.spec_name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spec rows */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {specs.map((spec, idx) => (
                  <div key={idx} className="flex gap-3 items-center bg-white border border-slate-100 p-3 rounded-xl shadow-sm group hover:shadow-md transition-all">
                    <span className="text-[10px] font-black text-slate-400 w-5 text-center shrink-0">#{idx + 1}</span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1 font-bold`}
                      value={spec.spec_name || ''}
                      onChange={(e) => handleSpecChange(idx, 'spec_name', e.target.value)}
                      placeholder="Tên thông số (VD: Chất liệu)"
                    />
                    <span className="text-slate-300 shrink-0">:</span>
                    <input
                      type="text"
                      className={`${inputClass} flex-1`}
                      value={spec.spec_value || ''}
                      onChange={(e) => handleSpecChange(idx, 'spec_value', e.target.value)}
                      placeholder="Giá trị (VD: Cotton 100%)"
                    />
                    <button
                      onClick={() => removeSpec(idx)}
                      className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0 opacity-50 group-hover:opacity-100 transition-all"
                    ><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>

              {specs.length === 0 && (
                <div className="text-center py-8 text-slate-400 italic text-sm">
                  Chưa có thông số nào. Thêm bằng nút bên dưới hoặc chọn nhanh từ template trên.
                </div>
              )}

              <button
                onClick={addSpec}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white transition-all font-bold text-sm"
              >
                <PlusCircle size={17} /> Thêm thông số tùy chỉnh
              </button>
            </div>
          </section>

        </div>

        {/* FOOTER */}
        <div className="px-8 py-5 border-t border-slate-100 bg-white rounded-b-3xl shrink-0 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">
            {isAddMode
              ? "Sản phẩm mới sẽ được tạo ngay sau khi lưu"
              : `Cập nhật lần cuối: ${product.updated_at ? new Date(product.updated_at).toLocaleString('vi-VN') : '—'}`
            }
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
