import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#1e1e24] text-slate-200 pt-20 w-full">
      <div className="max-w-[1200px] mx-auto px-8 flex flex-col md:flex-row justify-between gap-12 md:gap-16">

        {/* Logo Section */}
        <div className="flex-1 max-w-[300px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white rounded-lg relative flex items-center justify-center after:content-[''] after:block after:w-4 after:h-4 after:bg-blue-500 after:rounded"></div>
            <span className="text-xl font-bold tracking-tight text-white">ChatBot</span>
          </div>
        </div>

        {/* Links Grid Section */}
        <div className="flex-[2] flex justify-start md:justify-between flex-wrap gap-12 md:gap-8">
          <div className="min-w-[120px] md:min-w-0">
            <h4 className="text-[0.95rem] font-semibold text-white mb-6">ChatGPT</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Explore ChatGPT</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Teams</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Education</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Pricing</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Download</a></li>
            </ul>
          </div>

          <div className="min-w-[120px] md:min-w-0">
            <h4 className="text-[0.95rem] font-semibold text-white mb-6">Latest Ad</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Blog</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Newsletter</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Events</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Help center</a></li>
            </ul>
          </div>

          <div className="min-w-[120px] md:min-w-0">
            <h4 className="text-[0.95rem] font-semibold text-white mb-6">Company</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">About Us</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Career</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Our charter</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Brand</a></li>
            </ul>
          </div>

          <div className="min-w-[120px] md:min-w-0">
            <h4 className="text-[0.95rem] font-semibold text-white mb-6">More</h4>
            <ul className="list-none p-0 m-0">
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">News</a></li>
              <li className="mb-4"><a href="#" className="text-slate-400 text-sm no-underline transition-colors duration-200 hover:text-white">Stories</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="mt-16 border-t border-white/10 py-8">
        <div className="max-w-[1200px] mx-auto px-8 flex justify-center md:justify-end">
          <div className="flex gap-8">
            <a href="#" className="text-slate-400 text-[0.85rem] no-underline transition-colors duration-200 hover:text-white">Privacy policy</a>
            <a href="#" className="text-slate-400 text-[0.85rem] no-underline transition-colors duration-200 hover:text-white">Security</a>
            <a href="#" className="text-slate-400 text-[0.85rem] no-underline transition-colors duration-200 hover:text-white">Safety</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
