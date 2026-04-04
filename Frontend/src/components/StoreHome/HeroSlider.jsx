import React, { useState, useEffect } from 'react';

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Bộ sưu tập\nHè 2026',
    sub: 'Phong cách streetwear — tối giản mà đẳng cấp',
    cta: 'Khám phá ngay',
    ctaId: 'nam',
    gradient: 'from-slate-900/70 via-slate-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    accent: '#6366f1',
  },
  {
    id: 2,
    title: 'Thời trang Nữ\nQuyến rũ & Tự tin',
    sub: 'Hơn 500 mẫu mới mỗi tuần — cập nhật liên tục',
    cta: 'Mua sắm ngay',
    ctaId: 'nu',
    gradient: 'from-rose-900/60 via-rose-900/30 to-transparent',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
    accent: '#f43f5e',
  },
  {
    id: 3,
    title: 'Giày & Phụ kiện\nHot trend',
    sub: 'Sneaker, sandal, túi xách — trọn bộ style',
    cta: 'Xem bộ sưu tập',
    ctaId: 'giay',
    gradient: 'from-amber-900/60 via-amber-900/30 to-transparent',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
    accent: '#f59e0b',
  },
];

/**
 * HeroSlider – auto-playing hero banner with 3 slides, arrows, and dot navigation.
 *
 * Props:
 *   onOpenListing(categoryId) – navigate to product listing
 */
const HeroSlider = ({ onOpenListing }) => {
  const [idx, setIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = (next) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => { setIdx(next); setAnimating(false); }, 350);
  };

  useEffect(() => {
    const t = setInterval(() => goTo((idx + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  const slide = HERO_SLIDES[idx];

  return (
    <div className="relative rounded-3xl overflow-hidden h-[480px] md:h-[540px] shadow-2xl">
      {/* Background image */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${animating ? 'scale-105 opacity-60' : 'scale-100 opacity-100'}`}
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

      {/* Text content */}
      <div
        className={`relative h-full flex flex-col justify-center px-10 md:px-16 transition-all duration-500
          ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
      >
        <div className="max-w-xl">
          <span
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 text-white"
            style={{ background: slide.accent + 'cc' }}
          >
            FSA Fashion Store
          </span>
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-tight whitespace-pre-line">
            {slide.title}
          </h1>
          <p className="mt-3 text-white/80 text-base md:text-lg">{slide.sub}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => onOpenListing(slide.ctaId)}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg hover:scale-105 transition-transform"
              style={{ background: slide.accent }}
            >
              {slide.cta}
            </button>
            <button
              onClick={() => onOpenListing()}
              className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition"
            >
              Tất cả sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === idx ? 'w-6 bg-white' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={() => goTo((idx - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white text-xl hover:bg-white/40 transition"
      >
        ‹
      </button>
      <button
        onClick={() => goTo((idx + 1) % HERO_SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white text-xl hover:bg-white/40 transition"
      >
        ›
      </button>
    </div>
  );
};

export default HeroSlider;
