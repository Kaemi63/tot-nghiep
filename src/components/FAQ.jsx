import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQData = [
  "1. Chatbot AI là gì?",
  "2. Chatbot AI hoạt động như thế nào?",
  "3. Tôi có thể hỏi chatbot AI những gì?",
  "4. Dữ liệu của tôi có an toàn không?",
  "5. Chatbot AI có thể học hỏi từ các cuộc trò chuyện không?",
  "6. Chatbot AI có những hạn chế gì?"
];

const FAQItem = ({ question, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-200 cursor-pointer transition-all duration-200 group" onClick={toggle}>
      <div className={`flex justify-between items-center py-6 text-[1rem] md:text-[1.05rem] font-medium transition-colors duration-200 ${isOpen ? 'text-slate-800' : 'text-slate-800 group-hover:text-blue-500'}`}>
        <span>{question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-slate-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
      </div>
      <div className={`overflow-hidden transition-all duration-300 text-slate-500 leading-[1.6] ${isOpen ? 'max-h-[200px] pb-6' : 'max-h-0'}`}>
        {/* Placeholder answer since design only shows questions */}
        <p>Chatbot AI được thiết kế để hỗ trợ và tư vấn thông qua giao tiếp thông minh, giúp tự động hóa quá trình hỏi đáp và cải thiện trải nghiệm người dùng.</p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-32 bg-white flex justify-center">
      <div className="w-full max-w-[800px] px-8">
        <h2 className="text-center text-[2rem] md:text-[2.5rem] font-bold leading-[1.2] mb-16 text-slate-800">
          Những câu hỏi<br />
          <span className="text-slate-400 font-normal">bạn có thể quan tâm</span>
        </h2>

        <div className="flex flex-col gap-6">
          {FAQData.map((question, index) => (
            <FAQItem
              key={index}
              question={question}
              isOpen={openIndex === index}
              toggle={() => toggleFAQ(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
