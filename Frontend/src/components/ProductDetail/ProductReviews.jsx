
import React from 'react';

const ProductReviews = ({ reviews = [] }) => {
  return (
    <section className="mt-12 border-t border-slate-100 pt-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Đánh giá từ cộng đồng</h2>
      
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((rev, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 p-6 border border-slate-100 transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < rev.rating ? "fill-current" : "text-slate-200"}>★</span>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium">Xác nhận đã mua hàng</span>
              </div>
              <p className="text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
              {rev.images && (
                <img src={rev.images} alt="Review" className="mt-4 h-20 w-20 rounded-lg object-cover border border-white shadow-sm" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <p className="text-slate-400 italic font-light">Chưa có đánh giá nào cho sản phẩm này.</p>
        </div>
      )}
    </section>
  );
};

export default ProductReviews;