import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQData = [
  {
    question: "FSA AI là gì?",
    answer: "FSA AI là một trợ lý thông minh được thiết kế để giúp bạn tìm kiếm và nhận tư vấn về các sản phẩm thời trang. Nó sử dụng công nghệ AI tiên tiến để hiểu nhu cầu của bạn và cung cấp gợi ý phù hợp nhất."
  },
  {
    question: "FSA AI hoạt động như thế nào?",
    answer: "FSA AI hoạt động bằng cách phân tích câu hỏi của bạn về sản phẩm thời trang, hiểu bối cảnh và xu hướng hiện tại, sau đó cung cấp các gợi ý sản phẩm chi tiết kèm theo giải thích vì sao chúng phù hợp với bạn."
  },
  {
    question: "Tôi có thể hỏi FSA AI những gì?",
    answer: "Bạn có thể hỏi về bất kỳ thứ gì liên quan đến thời trang: tìm kiếm trang phục cho dịp đặc biệt, cố vấn về phong cách, gợi ý kết hợp trang phục, mẹo chăm sóc quần áo, và nhiều hơn nữa."
  },
  {
    question: "Dữ liệu của tôi có an toàn không?",
    answer: "Có, chúng tôi rất coi trọng quyền riêng tư của bạn. Tất cả dữ liệu cá nhân và tương tác với chatbot được mã hóa và bảo vệ theo các tiêu chuẩn bảo mật quốc tế cao nhất."
  },
  {
    question: "FSA AI có thể học hỏi từ các cuộc trò chuyện không?",
    answer: "Vâng, chatbot của chúng tôi liên tục được cải thiện dựa trên các cuộc trò chuyện. Phản hồi của bạn giúp chúng tôi cung cấp gợi ý tốt hơn, nhưng tất cả dữ liệu được xử lý một cách ẩn danh."
  },
  {
    question: "FSA AI có những hạn chế gì?",
    answer: "FSA AI hoạt động tốt nhất với các mô tả rõ ràng về thể loại trang phục và phong cách bạn tìm kiếm. Nó dựa trên dữ liệu sản phẩm có sẵn, vì vậy đôi khi các mục quá hiếm có hoặc mới nhất có thể chưa có trong cơ sở dữ liệu."
  }
];

const FAQItem = ({ item, isOpen, toggle }) => {
  return (
    <div className="border-b border-slate-200 cursor-pointer group" onClick={toggle}>
      <div className={`flex justify-between items-center py-6 font-medium transition-colors ${isOpen ? 'text-slate-800' : 'text-slate-800 group-hover:text-blue-500'}`}>
        <span>{item.question}</span>
        {isOpen ? <Minus className="w-5 h-5 text-slate-500" /> : <Plus className="w-5 h-5 text-slate-500" />}
      </div>
      <div className={`overflow-hidden transition-all duration-300 text-slate-500 leading-[1.6] ${isOpen ? 'max-h-[300px] pb-6' : 'max-h-0'}`}>
        <p>{item.answer}</p>
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
          {FAQData.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
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
