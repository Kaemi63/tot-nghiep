import React from 'react';

/**
 * FlashSaleBanner – promotional CTA with gradient background.
 *
 * Props:
 *   onOpenListing() – navigate to product listing
 */
const FlashSaleBanner = ({ onOpenListing }) => (
  <section className="rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-700 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
    <div className="flex-1 text-white">
      <span className="inline-block bg-white/20 backdrop-blur text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
        ⚡ Flash Sale
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
        Giảm đến <span className="text-yellow-300">50%</span>
      </h2>
      <p className="text-white/80 mt-2 text-sm md:text-base">
        Ưu đãi có hạn — kết thúc trong 24 giờ. Đừng bỏ lỡ!
      </p>
    </div>
    <button
      onClick={() => onOpenListing()}
      className="px-8 py-3.5 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-yellow-300 hover:text-indigo-900 transition-all duration-200 shadow-lg flex-shrink-0"
    >
      Mua ngay →
    </button>
  </section>
);

export default FlashSaleBanner;
