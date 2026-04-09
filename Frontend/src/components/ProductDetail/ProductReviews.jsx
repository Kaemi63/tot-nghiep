import React from 'react';

const ProductReviews = ({ reviews = [] }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
          Đánh giá từ cộng đồng
        </h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {reviews.length} nhận xét
        </span>
      </div>
      
      {reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="group rounded-2xl bg-white p-6 border border-slate-100 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < rev.rating ? "text-amber-400" : "text-slate-200"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Người dùng đã xác thực
                  </span>
                </div>
                {rev.date && <span className="text-xs text-slate-400">{rev.date}</span>}
              </div>
              
              <p className="text-slate-600 leading-relaxed font-medium italic">
                "{rev.comment}"
              </p>
              
              {rev.images && (
                <div className="mt-4 flex gap-2">
                  <img 
                    src={rev.images} 
                    alt="Review" 
                    className="h-20 w-20 rounded-xl object-cover border-2 border-white shadow-sm ring-1 ring-slate-100 transition-transform group-hover:scale-105" 
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-100">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
            Chưa có đánh giá nào cho sản phẩm này
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;