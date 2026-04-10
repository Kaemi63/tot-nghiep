import React, { useState } from 'react';
import ReviewModal from '../../components/OrderHistory/ReviewModal';

// Tính số sao trung bình
const calcAverage = (reviews) => {
  if (!reviews.length) return 0;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

// Tính % từng mức sao (1-5)
const calcStarCounts = (reviews) => {
  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (counts[r.rating] !== undefined) counts[r.rating]++;
  });
  return counts;
};

const StarDisplay = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'lg' ? 'text-3xl' : 'text-base';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`${sizeClass} ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
      ))}
    </div>
  );
};

const ProductReviews = ({ reviews = [], currentUserId, onEditReview }) => {
  const [editingReview, setEditingReview] = useState(null);
  const average = calcAverage(reviews);
  const starCounts = calcStarCounts(reviews);
  const total = reviews.length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Tổng quan rating */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          
          {/* Số sao trung bình */}
          <div className="flex flex-col items-center gap-2 min-w-[120px]">
            <span className="text-6xl font-black text-slate-900">{average}</span>
            <StarDisplay rating={average} size="lg" />
            <span className="text-xs text-slate-400 font-semibold">{total} đánh giá</span>
          </div>

          {/* Thanh phân bố từng sao */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star];
              const percent = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-4">{star}</span>
                  <span className="text-amber-400 text-sm">★</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Đánh giá từ cộng đồng
        </h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {total} nhận xét
        </span>
      </div>

      {/* Danh sách review */}
      {total > 0 ? (
        <div className="grid gap-4">
          {reviews.map((rev, idx) => {
            const isOwner = currentUserId && rev.user_id === currentUserId;
            const images = rev.review_images || [];
            const userName = rev.profiles?.fullname || rev.profiles?.username || 'Khách hàng';
            const avatar = rev.profiles?.avatar_url;
            const date = rev.created_at
              ? new Date(rev.created_at).toLocaleDateString('vi-VN')
              : null;

            return (
              <div key={idx} className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-indigo-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {avatar
                        ? <img src={avatar} alt={userName} className="w-full h-full object-cover" />
                        : <span className="text-indigo-600 font-black text-sm">{userName[0]}</span>
                      }
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{userName}</p>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                        Đã mua hàng
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {date && <span className="text-xs text-slate-400">{date}</span>}
                    {/* Nút sửa nếu là review của mình */}
                    {isOwner && (
                      <button
                        onClick={() => setEditingReview(rev)}
                        className="text-xs font-bold text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-full transition-all"
                      >
                        ✏️ Sửa
                      </button>
                    )}
                  </div>
                </div>

                {/* Sao */}
                <StarDisplay rating={rev.rating} />

                {/* Nội dung */}
                {rev.comment && (
                  <p className="mt-3 text-slate-600 leading-relaxed font-medium italic">
                    "{rev.comment}"
                  </p>
                )}

                {/* Ảnh review */}
                {images.length > 0 && (
                  <div className="mt-4 flex gap-2 flex-wrap">
                    {images.map((img, i) => (
                      <img
                        key={i}
                        src={img.image_url || img}
                        alt={`Review ${i + 1}`}
                        className="h-20 w-20 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105 cursor-pointer"
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Chưa có đánh giá nào cho sản phẩm này
          </p>
        </div>
      )}

      {/* Modal chỉnh sửa đánh giá */}
      {editingReview && (
        <ReviewModal
          mode="edit"
          existingReview={editingReview}
          product={{ product_id: editingReview.product_id, product_name: editingReview.product_name, products: editingReview.products }}
          order={{ id: editingReview.order_id }}
          onClose={() => setEditingReview(null)}
          onSubmitEdit={onEditReview}
        />
      )}
    </div>
  );
};

export default ProductReviews;
