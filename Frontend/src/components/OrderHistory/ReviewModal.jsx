import React, { useState } from 'react';
import { useReview } from '../../hooks/useReview';
import toast from 'react-hot-toast';

// mode: 'create' | 'edit'
const ReviewModal = ({ order, product, onClose, mode = 'create', existingReview = null, onSubmitEdit }) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [comment, setComment] = useState(existingReview?.comment ?? '');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState(
    // Hiển thị ảnh cũ nếu đang edit
    existingReview?.review_images?.map(img => img.image_url || img) ?? []
  );
  const { postReview, editReview, submitting } = useReview(product?.product_id);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 4) {
      return toast.error("Tối đa 4 hình ảnh");
    }
    setSelectedFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return toast.error("Vui lòng nhập nhận xét");

    let success = false;

    if (mode === 'edit' && existingReview) {
      // Gọi editReview từ hook
      success = await editReview(existingReview.id, { rating, comment }, selectedFiles);
      if (success && onSubmitEdit) onSubmitEdit();
    } else {
      // Gọi postReview từ hook
      success = await postReview({
        product_id: product?.product_id,
        order_id: order.id,
        rating,
        comment
      }, selectedFiles);
    }

    if (success) onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase tracking-tight text-lg">
            {mode === 'edit' ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
            <img
              src={product?.products?.thumbnail_url || product?.products?.image || 'https://via.placeholder.com/150'}
              className="w-14 h-14 rounded-xl object-cover border border-white shadow-sm"
              alt={product?.product_name}
            />
            <p className="font-bold text-slate-700 text-sm line-clamp-2">
              {product?.product_name || product?.products?.name || "Sản phẩm"}
            </p>
          </div>

          {/* Chọn sao */}
          <div className="flex justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-4xl transition-all active:scale-90 ${star <= rating ? 'text-amber-400 drop-shadow-sm' : 'text-slate-200'}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            className="w-full rounded-2xl border border-slate-200 p-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 min-h-[100px] transition-all resize-none"
            placeholder="Chất lượng sản phẩm tuyệt vời, đóng gói chắc chắn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* Ảnh */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hình ảnh thực tế (Tối đa 4)</p>
            <div className="flex flex-wrap gap-2">
              {previews.map((src, idx) => (
                <div key={idx} className="relative w-20 h-20 group">
                  <img src={src} className="w-full h-full object-cover rounded-xl border border-slate-100" alt="" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center border-2 border-white"
                  >✕</button>
                </div>
              ))}
              {previews.length < 4 && (
                <label className="w-20 h-20 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all text-slate-400">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] font-bold">Thêm ảnh</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-indigo-600 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all"
          >
            {submitting
              ? 'ĐANG TẢI LÊN...'
              : mode === 'edit' ? 'CẬP NHẬT ĐÁNH GIÁ' : 'GỬI ĐÁNH GIÁ NGAY'
            }
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
