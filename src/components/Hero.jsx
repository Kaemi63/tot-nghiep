import React from 'react';

const Hero = () => {
  return (
    <section className="pt-[140px] pb-[80px] min-h-[90vh] flex flex-col items-center relative overflow-hidden text-center bg-[#fafafa]">
      <div className="max-w-[800px] mx-auto z-10 px-6 flex flex-col items-center w-full">
        <h1 className="text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] leading-[1.1] font-bold tracking-tight text-[#1e293b] mb-6 z-10 relative">
          Trợ lý AI<br />
          <span className="text-[#cbd5e1] tracking-tight font-medium">Tư vấn sản phẩm</span>
        </h1>

        <p className="text-[1rem] md:text-[1.1rem] text-[#64748b] mb-8 max-w-[500px]">
          Chat với AI để nhận tư vấn sản phẩm phù hợp với nhu cầu của bạn. 🪄
        </p>

        <button className="bg-[#1e293b] text-white py-3.5 px-8 rounded-lg font-medium text-[0.95rem] inline-flex items-center gap-2 transition-all duration-200 shadow-lg hover:bg-[#0f172a] hover:-translate-y-0.5 mb-16">
          Tham gia ChatBot của chúng tôi <span className="text-white text-lg leading-none">↗</span>
        </button>

        {/* Mockup Chat Widget */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.08)] border border-[#e2e8f0] p-2 w-[90%] md:w-[680px] mx-auto relative z-20 flex flex-col">
          {/* Top Tabs */}
          <div className="flex items-center justify-start gap-1 p-2 border-b border-[#e2e8f0] overflow-x-auto w-full">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#475569] bg-[#f1f5f9] rounded-md whitespace-nowrap">
              <span className="text-[#475569] text-[14px]">🛍️</span> Fashion
            </button>
          </div>

          {/* Central Input Area */}
          <div className="p-5 pb-8 relative flex flex-col justify-center min-h-[140px] w-full items-start">
            <p className="text-left text-xs text-[#94a3b8] font-medium mb-4">Bạn đang quan tâm đến sản phẩm nào trên thị trường hiện nay</p>
            <div className="flex items-center w-full relative">
              <span className="absolute left-0 text-[#cbd5e1] animate-pulse text-lg">|</span>
              <input type="text" className="w-full bg-transparent border-none outline-none text-[1.2rem] pl-3 text-[#334155] placeholder-[#cbd5e1] font-medium" placeholder="Hãy nhập nội dung bạn muốn hỏi..." />
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center p-3 text-xs w-full bg-white/50 border-t border-[#f8fafc] mt-auto rounded-b-xl rounded-t-lg">
            <div className="flex items-center gap-2 bg-[#f1f5f9]/80 p-1 rounded-lg">
              <span className="cursor-pointer text-[#94a3b8] px-3 py-1 font-medium hover:text-[#475569]">Mobile</span>
              <span className="cursor-pointer text-[#1e293b] font-medium bg-white shadow-sm px-3 py-1 rounded-md">Web <span className="text-blue-500">●</span></span>
            </div>
            <div className="flex items-center gap-3">
              <span className="cursor-pointer text-[#94a3b8] hover:text-[#475569]">🎙️</span>
              <button className="bg-blue-500 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-sm hover:bg-blue-600 transition-colors">
                <span className="text-[10px]">➤</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements & Background Text */}
      <div className="absolute top-0 left-0 w-full h-full z-[5] pointer-events-none hidden lg:block">
        <div className="absolute top-[35%] left-[2%] xl:left-[8%] w-[220px] -rotate-6 z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#f1f5f9] p-3 pointer-events-auto">
          <div className="py-2.5 text-[0.8rem] font-medium text-[#475569] border-b border-[#f1f5f9]">Tìm kiếm sản phẩm?</div>
          <div className="py-2.5 text-[0.75rem] text-[#64748b] border-b border-[#f1f5f9] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span> Sản phẩm mới
          </div>
          <div className="py-2 text-[0.75rem] text-[#334155] font-medium flex items-center gap-2 bg-[#f8fafc] border border-[#f1f5f9] rounded-lg px-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Sản phẩm hot
          </div>
        </div>

        <div className="absolute top-[20%] right-[2%] xl:right-[8%] w-[200px] rotate-6 z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-[#f1f5f9] p-3 pointer-events-auto">
          <div className="py-3 px-2 text-[0.8rem] font-medium text-[#475569] border-b border-[#f1f5f9] flex items-center gap-2">Tư vấn sản phẩm</div>
          <div className="py-3 px-2 text-[0.8rem] text-[#64748b] border-b border-[#f1f5f9] flex items-center gap-2">Thêm hình ảnh?</div>
          <div className="py-3 px-2 text-[0.8rem] text-[#64748b] flex items-center gap-2">Các gợp ý về sản phẩm?</div>
        </div>
      </div>

      {/* Huge Background Text */}
      <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] text-center z-[1] pointer-events-none opacity-[0.08] hidden md:block">
        <p className="text-[1.3rem] leading-[2.2] font-semibold text-[#64748b] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_60%)] filter blur-[0.5px]">
          Developers can create more efficient and engaging AI tools related to ChatGPT offer a wide range of functionalities that enhance communication, automate tasks, and improve user experiences across various domains. By leveraging these tools, businesses and developers can create more efficient and engaging applications. AI tools related to ChatGPT offer a wide range of functionalities that enhance communication, automate tasks, and improve user experiences across various domains. AI functionalities designed for everyone to access and improve.
        </p>
      </div>
    </section>
  );
};

export default Hero;
