import React from 'react';
import { Edit2, Trash2, Tag, Zap, Layers3, AlertTriangle } from 'lucide-react';
import { fmt } from '../../utils/format.js';

const StatusLabel = ({ status, featured }) => {
  const base = "text-[10px] font-black uppercase px-2 py-0.5 rounded-md";
  const color = status === 'active' ? 'bg-emerald-100 text-emerald-700'
    : status === 'archived' ? 'bg-slate-100 text-slate-500'
    : 'bg-amber-100 text-amber-700';
  return (
    <div className="flex gap-1.5 items-center flex-wrap">
      <span className={`${base} ${color}`}>{status}</span>
      {featured && <span className={`${base} bg-indigo-100 text-indigo-700`}>★ Featured</span>}
    </div>
  );
};

const ProductTable = ({ products, loading, onEdit, onDelete }) => {
  const totalStock = (product) =>
    (product.product_variants || []).reduce((sum, v) => sum + (v.stock_quantity || 0), 0);

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-5 w-[35%]">Thông tin chung</th>
              <th className="px-6 py-5 w-[18%]">Phân loại</th>
              <th className="px-6 py-5 w-[15%]">Giá / Kho</th>
              <th className="px-6 py-5 w-[15%]">Biến thể / Ảnh</th>
              <th className="px-6 py-5 w-[10%]">Trạng thái</th>
              <th className="px-6 py-5 w-[7%] text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-28 text-center text-slate-400 italic font-medium">
                  <Layers3 size={32} className="mx-auto mb-4 animate-pulse" />
                  Đang tải danh sách sản phẩm...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-28 text-center text-slate-400 italic font-medium">
                  <AlertTriangle size={32} className="mx-auto mb-4 text-amber-300" />
                  Không tìm thấy sản phẩm nào phù hợp.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stock = totalStock(product);
                const variantCount = product.product_variants?.length || 0;
                const imageCount = product.product_images?.length || 0;

                return (
                  <tr key={product.id} className="hover:bg-indigo-50/30 transition-all group">
                    {/* Thông tin chung */}
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <img
                          src={product.thumbnail_url || 'https://via.placeholder.com/60'}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-100 shadow-inner shrink-0"
                          alt=""
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2" title={product.name}>
                            {product.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">
                            {product.slug || '—'}
                          </p>
                          {product.short_description && (
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                              {product.short_description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Phân loại */}
                    <td className="px-6 py-5">
                      <div className="space-y-1.5">
                        <p className="text-sm text-slate-700 flex items-center gap-2 font-medium">
                          <Layers3 size={14} className="text-slate-300" />
                          {product.categories?.name || <span className="text-slate-300 italic">Chưa phân loại</span>}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <Zap size={13} className="text-slate-300" />
                          {product.brands?.name || <span className="text-slate-300 italic">Chưa có thương hiệu</span>}
                        </p>
                      </div>
                    </td>

                    {/* Giá / Kho */}
                    <td className="px-6 py-5">
                      <p className="text-sm font-extrabold text-indigo-700">{fmt(product.base_price)}</p>
                      <p className={`text-xs mt-1 font-bold ${stock > 5 ? 'text-emerald-600' : stock > 0 ? 'text-amber-600' : 'text-rose-500'}`}>
                        Tồn: {stock}
                        {stock <= 5 && stock > 0 && <span className="ml-1">(Sắp hết)</span>}
                        {stock === 0 && <span className="ml-1">(Hết hàng)</span>}
                      </p>
                    </td>

                    {/* Biến thể / Ảnh */}
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 font-bold">{variantCount} biến thể</p>
                        <p className="text-xs text-slate-400">{imageCount} ảnh</p>
                        <p className="text-xs text-slate-400">{product.product_specifications?.length || 0} thông số</p>
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-5">
                      <StatusLabel status={product.status} featured={product.is_featured} />
                    </td>

                    {/* Thao tác */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(product)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          onClick={() => onDelete(product.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 size={17} />
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
    </div>
  );
};

export default ProductTable;
