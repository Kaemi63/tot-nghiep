import React from 'react';

const Hero = ({onRegisterClick}) => {
  return (
    <section className="pt-[140px] pb-[80px] min-h-[90vh] flex flex-col items-center relative overflow-hidden text-center bg-white">
      <div className="absolute inset-0 bg-white z-[1]"></div>
      <div className="max-w-[800px] mx-auto z-10 px-6 flex flex-col items-center w-full relative">
        <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.1] font-bold tracking-tight text-[#1e293b] mb-6 z-10 relative">
          Trợ lý AI<br />
          <span className="text-[#cbd5e1] tracking-tight font-medium">Tư vấn sản phẩm</span>
        </h1>

        <p className="text-[1rem] md:text-[1.1rem] text-[#64748b] mb-8 max-w-[500px]">
          FSA AI để nhận tư vấn sản phẩm phù hợp với nhu cầu của bạn.
        </p>

        <button onClick={onRegisterClick} className="bg-[#1e293b] text-white py-3.5 px-8 rounded-lg font-medium text-[0.95rem] inline-flex items-center gap-2 transition-all duration-200 shadow-lg hover:bg-[#0f172a] hover:-translate-y-0.5 mb-16">
          Tham gia ChatBot của chúng tôi <span className="text-white text-lg leading-none">↗</span>
        </button>
      </div>


      <div className="absolute top-0 left-0 w-full h-full z-[5] pointer-events-none hidden lg:block">
        <div className="absolute top-[35%] left-[2%] xl:left-[8%] w-[220px] h-[280px] -rotate-6 z-10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#f1f5f9] pointer-events-auto overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1601762603339-fd61e28b698a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Fashion 1" 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        <div className="absolute top-[20%] right-[2%] xl:right-[8%] w-[200px] h-[280px] rotate-6 z-10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] border border-[#f1f5f9] pointer-events-auto overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Fashion 2" 
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
