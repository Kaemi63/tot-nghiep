import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import './FAQ.css';

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
    <div className={`faq-item ${isOpen ? 'open' : ''}`} onClick={toggle}>
      <div className="faq-question">
        <span>{question}</span>
        {isOpen ? <Minus className="faq-icon" /> : <Plus className="faq-icon" />}
      </div>
      <div className="faq-answer">
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
    <section className="faq">
      <div className="faq-container">
        <h2 className="faq-title">
          Những câu hỏi<br />
          <span className="faq-title-highlight">bạn có thể quan tâm</span>
        </h2>
        
        <div className="faq-list">
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
