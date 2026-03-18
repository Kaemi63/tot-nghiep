import React from 'react';

const Brands = () => {
  return (
    <section className="py-16 border-t border-black/5 bg-white w-full">
      <div className="max-w-[1200px] mx-auto flex justify-center items-center flex-wrap gap-8 md:gap-12 px-8 opacity-60 grayscale transition-all duration-300 hover:opacity-80">
        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="text-2xl flex items-center justify-center">C</span>
          <span className="tracking-[-0.5px] font-extrabold">clerk</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="tracking-[-0.5px] font-medium font-mono text-[1.1rem]">together.ai</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="tracking-[-0.5px] font-serif italic text-[1.4rem]">Inflection</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="text-2xl flex items-center justify-center text-[#00b67a] text-[1.8rem]">★</span>
          <span className="tracking-[-0.5px] font-bold">Trustpilot</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="text-2xl flex items-center justify-center font-black">X</span>
          <span className="tracking-[-0.5px] font-light tracking-[2px] text-[1.1rem]">STATE</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="text-2xl flex items-center justify-center">@</span>
          <span className="tracking-[-0.5px] font-semibold">algolia</span>
        </div>

        <div className="flex flex-row items-center gap-1 font-bold text-xl text-slate-700">
          <span className="text-2xl flex items-center justify-center">W</span>
          <span className="tracking-[-0.5px]">web.dev</span>
        </div>
      </div>
    </section>
  );
};

export default Brands;
