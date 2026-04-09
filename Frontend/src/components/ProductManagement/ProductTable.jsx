import React from 'react';
import { Edit2, Trash2, Tag, Zap, Layers3, AlertTriangle, Eye } from 'lucide-react';
import { fmt } from '../../utils/format.js';

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  
  // Tính tổng tồn kho của sản phẩm
  const calculateTotalStock = (product) => {
    if (!product.product_variants || product.product_variants.length === 0) return 0;
    return product.product_variants.reduce((sum, v) => sum + (v.stock_quantity || 0), 0);
  };

  // Label cho status tuân thủ style
  const StatusLabel = ({ status, featured }) => {
    let classes = "text-[10px] font-black uppercase px-2 py-0.5 rounded-md";
    if (status === 'active') classes += ' bg-emerald-100 text-emerald-700';
    else if (status === 'archived') classes += ' bg-slate-100 text-slate-500';
    else classes += ' bg-amber-100 text-amber-700'; // Draft/Pending
    
    return (
      <div className="flex gap-1.5 items-center">
        <span className={classes}>{status}</span>
        {featured && <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">★ Featured</span>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-50/50 overflow-hidden animate-in fade-in duration-500">
      <table className="w-full text-left border-collapse table-fixed">
        <colgroup>
          <col className="w-[40%]" /> <col className="w-[20%]" /> <col className="w-[18%]" /> <col className="w-[12%]" /> <col className="w-[10%]" /> 
        </colgroup>
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <th className="px-6 py-5">Thông tin chung</th>
            <th className="px-6 py-5">Phân loại</th>
            <th className="px-6 py-5">Giá / Kho</th>
            <th className="px-6 py-5">Trạng thái</th>
            <th className="px-6 py-5 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr><td colSpan="5" className="py-28 text-center text-slate-400 italic font-medium"><Layers3 size={32} className="mx-auto mb-4 animate-pulse"/>Đang tải danh sách sản phẩm...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan="5" className="py-28 text-center text-slate-400 italic font-medium"><AlertTriangle size={32} className="mx-auto mb-4 text-amber-300"/>Không tìm thấy sản phẩm nào phù hợp.</td></tr>
          ) : (
            products.map((product) => {
              const totalStock = calculateTotalStock(product);
              const totalVariants = product.product_variants?.length || 0;

              return (
                <tr key={product.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-start gap-4">
                      {/* Ảnh Thumbnail */}
                      <img 
                        src={product.thumbnail_url || 'https://via.placeholder.com/60'} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-inner shrink-0 mt-1" 
                        alt="" 
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-extrabold text-slate-800 leading-snug break-words line-clamp-2" title={product.name}>
                          {product.name}
                        </p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 tracking-tight flex items-center gap-1.5">
                          <Tag size={12} className="text-slate-300" />
                          SKU gốc: {product.product_variants?.[0]?.sku || 'Chưa đặt'}
                          <span className="text-slate-200">|</span>
                          {totalVariants} biến thể
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1.5">
                      <p className="text-sm text-slate-700 flex items-center gap-2 font-medium">
                        <Layers3 size={15} className="text-slate-300"/>
                        {product.categories?.name || 'Không danh mục'}
                      </p>
                      <p className="text-[12px] text-slate-500 flex items-center gap-2">
                        <Zap size={13} className="text-slate-300" /> 
                        {product.brands?.name || 'Không thương hiệu'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="space-y-1">
                      <p className="text-sm font-extrabold text-indigo-700 tracking-tight">
                        {fmt(product.base_price)}
                      </p>
                      <p className={`text-[12px] flex items-center gap-2 ${totalStock > 0 ? 'text-slate-600 font-bold' : 'text-rose-500 font-black'}`}>
                        Tồn: {totalStock}
                        {totalStock <= 5 && totalStock > 0 && <span className="text-[10px] text-amber-600 font-bold">(Sắp hết)</span>}
                        {totalStock === 0 && <span className="text-[10px] text-rose-600 font-bold">(Hết hàng)</span>}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusLabel status={product.status} featured={product.is_featured} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(product)}
                        className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        title="Chỉnh sửa / Xem chi tiết"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => onDelete(product.id)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                        title="Xóa sản phẩm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;