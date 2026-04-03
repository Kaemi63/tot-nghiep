import React from 'react';

const BLOGS = [
  {
    id: 1,
    tag: 'Xu hướng',
    title: '5 cách phối đồ Streetwear mùa hè 2026',
    desc: 'Khám phá những combo thời thượng từ oversized tee đến cargo pants cực kỳ dễ mặc.',
    img: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=600&q=80',
    date: '28 Th3 2026',
  },
  {
    id: 2,
    tag: 'Phong cách',
    title: 'Mix & match công sở tinh tế cho nàng',
    desc: 'Từ blazer đến midi skirt — bộ tứ không thể thiếu trong tủ đồ công sở hiện đại.',
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    date: '22 Th3 2026',
  },
  {
    id: 3,
    tag: 'Sneaker',
    title: 'Top 10 đôi sneaker đáng mua nhất 2026',
    desc: 'Nike, Adidas, New Balance — ai mới thực sự đang thống trị thị trường sneaker?',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80',
    date: '15 Th3 2026',
  },
];

/** BlogSection – static fashion blog preview cards */
const BlogSection = () => (
  <section>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-extrabold text-slate-800">Blog thời trang</h2>
      <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Xem thêm →</button>
    </div>
    <div className="grid gap-5 md:grid-cols-3">
      {BLOGS.map((b) => (
        <article
          key={b.id}
          className="group rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <div className="h-44 overflow-hidden">
            <img
              src={b.img}
              alt={b.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-4">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[11px] font-bold mb-2">
              {b.tag}
            </span>
            <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
              {b.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{b.desc}</p>
            <p className="text-[11px] text-slate-400 mt-3">{b.date}</p>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default BlogSection;
