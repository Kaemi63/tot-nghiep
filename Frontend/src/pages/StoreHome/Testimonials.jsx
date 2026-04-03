import React from 'react';
import Stars from './Stars';

const REVIEWS = [
  { id: 1, name: 'Nguyễn Hà', avatar: 'NH', rating: 5, text: 'Chất lượng vải rất tốt, form đẹp đúng như ảnh. Giao hàng nhanh, đóng gói cẩn thận. Chắc chắn sẽ quay lại!', product: 'Áo thun Premium' },
  { id: 2, name: 'Lê Minh', avatar: 'LM', rating: 5, text: 'Giá hợp lý, nhân viên hỗ trợ nhiệt tình. Quần jeans mặc rất thoải mái và bền màu.', product: 'Quần Jeans Slim' },
  { id: 3, name: 'Trương Phương', avatar: 'TP', rating: 5, text: 'Thiết kế đẹp, chất liệu tốt và phù hợp phong cách hiện đại. Mình đã mua 3 lần rồi!', product: 'Áo khoác Denim' },
];

/** Testimonials – customer review cards (static data) */
const Testimonials = () => (
  <section>
    <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Khách hàng nói gì?</h2>
    <div className="grid gap-4 md:grid-cols-3">
      {REVIEWS.map((r) => (
        <blockquote
          key={r.id}
          className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {r.avatar}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{r.name}</p>
              <p className="text-xs text-slate-500">{r.product}</p>
            </div>
            <Stars rating={r.rating} />
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">"{r.text}"</p>
        </blockquote>
      ))}
    </div>
  </section>
);

export default Testimonials;
