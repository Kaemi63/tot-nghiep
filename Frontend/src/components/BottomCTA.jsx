import React from 'react';

const BottomCTA = ({ onRegisterClick }) => {
  return (
    <section className="py-20 md:py-32 relative flex justify-center items-center text-center overflow-hidden min-h-[40vh] md:min-h-[50vh]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full z-[1] pointer-events-none opacity-15 hidden md:block">
        <p className="text-lg leading-loose font-medium text-slate-400 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_80%)]">
        </p>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h2 className="text-[2.2rem] md:text-[3.5rem] font-bold leading-[1.1] text-slate-800 mb-8 tracking-[-1px]">
          Hãy tham gia<br />
          <span className="text-slate-400 font-normal">AI ChatBot của chúng tôi</span>
        </h2>

        <button onClick={onRegisterClick} className="bg-slate-800 text-white py-4 px-8 rounded-lg font-medium text-base inline-flex items-center gap-2 transition-all duration-200 hover:bg-slate-900 hover:-translate-y-[2px]">
          Tham gia ChatBot ↗
        </button>
      </div>
    </section>
  );
};

export default BottomCTA;
