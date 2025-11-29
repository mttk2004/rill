
import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, ChevronDown, ChevronUp, HelpCircle, FileText, Truck, RotateCcw } from 'lucide-react';
import Reveal from '../components/Reveal';
import Button from '../components/Button';

// FAQ Item Component
const FAQItem = ({ question, answer, isOpen, onClick }: { key?: any, question: string, answer: string, isOpen: boolean, onClick: () => void }) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-primary focus:outline-none"
      >
        <span className={`font-medium text-lg ${isOpen ? 'text-primary' : 'text-gray-900'}`}>{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-primary" /> : <ChevronDown size={20} className="text-gray-400" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed text-sm md:text-base pr-8">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Support = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Đĩa than của Rill Store có phải chính hãng không?",
      answer: "Tuyệt đối chính hãng. Chúng tôi nhập khẩu trực tiếp từ các hãng thu âm lớn tại Mỹ, Anh, Nhật và các nhà phát hành uy tín tại Việt Nam. Rill Store cam kết hoàn tiền 200% nếu phát hiện hàng giả, hàng nhái."
    },
    {
      question: "Quy trình đóng gói vận chuyển như thế nào?",
      answer: "Chúng tôi hiểu đĩa than rất dễ tổn thương. Rill sử dụng hộp carton 5 lớp chuyên dụng cho Vinyl, chèn xốp chống sốc 4 góc và bọc lớp bong bóng khí dày. Đĩa được lấy ra khỏi bìa (nếu chưa seal) để tránh rách bìa trong quá trình vận chuyển (theo yêu cầu)."
    },
    {
      question: "Tôi có được kiểm tra hàng trước khi nhận không?",
      answer: "Có. Rill Store khuyến khích khách hàng đồng kiểm với shipper. Bạn được phép mở hộp kiểm tra tình trạng bìa và đĩa (không trầy xước, cong vênh) trước khi thanh toán. Tuy nhiên, vui lòng không thử đĩa (play) khi chưa thanh toán."
    },
    {
      question: "Chính sách đổi trả ra sao?",
      answer: "Chúng tôi hỗ trợ đổi trả 1-1 trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất (cong vênh nặng, nhảy tin, xước đĩa sẵn có) hoặc lỗi vận chuyển (gãy vỡ). Vui lòng quay video mở hộp để được hỗ trợ nhanh nhất."
    },
    {
      question: "Cửa hàng có bán máy nghe nhạc (Turntable) không?",
      answer: "Hiện tại chúng tôi tập trung vào đĩa than (Records). Tuy nhiên, chúng tôi có các đối tác uy tín cung cấp thiết bị và sẵn sàng tư vấn miễn phí cho bạn các dòng máy phù hợp với ngân sách."
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-primary py-16 md:py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-black/20"></div>
         {/* Decorative circles */}
         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
         
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Reveal>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">Trung Tâm Hỗ Trợ</h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light">
                Chúng tôi luôn sẵn sàng lắng nghe và giải đáp mọi thắc mắc của bạn về sản phẩm và dịch vụ.
              </p>
            </Reveal>
         </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
        
        {/* Contact Cards */}
        <Reveal width="100%" direction="up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Hotline</h3>
              <p className="text-gray-500 mb-6 text-sm">Tư vấn sản phẩm & Khiếu nại (8:00 - 21:00)</p>
              <a href="tel:19001234" className="text-2xl font-bold text-primary hover:text-accent transition-colors">
                1900 1234
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
              <p className="text-gray-500 mb-6 text-sm">Gửi yêu cầu hỗ trợ 24/7</p>
              <a href="mailto:support@rillstore.vn" className="text-xl font-bold text-primary hover:text-accent transition-colors">
                support@rillstore.vn
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} />
              </div>
              <h3 className="font-bold text-lg text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-500 mb-6 text-sm">Chat trực tiếp qua Fanpage</p>
              <Button className="bg-[#1877F2] hover:bg-[#166fe5] border-transparent text-white w-full max-w-[160px]">
                Chat ngay
              </Button>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* FAQ Section */}
           <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-3 mb-8">
                   <HelpCircle className="text-accent" size={28} />
                   <h2 className="font-serif text-3xl font-bold text-gray-900">Câu hỏi thường gặp</h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  {faqs.map((faq, index) => (
                    <FAQItem
                      key={index}
                      question={faq.question}
                      answer={faq.answer}
                      isOpen={openIndex === index}
                      onClick={() => toggleFAQ(index)}
                    />
                  ))}
                </div>
              </Reveal>
           </div>

           {/* Quick Links Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <Reveal delay={0.2} direction="left">
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                   <h3 className="font-bold text-gray-900 mb-4">Chủ đề phổ biến</h3>
                   <div className="space-y-3">
                      <button className="flex items-center gap-3 w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all text-left text-sm font-medium text-gray-700 shadow-sm">
                         <Truck size={18} className="text-gray-400" /> Chính sách vận chuyển
                      </button>
                      <button className="flex items-center gap-3 w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all text-left text-sm font-medium text-gray-700 shadow-sm">
                         <RotateCcw size={18} className="text-gray-400" /> Đổi trả & Hoàn tiền
                      </button>
                      <button className="flex items-center gap-3 w-full p-3 bg-white rounded-lg border border-gray-200 hover:border-primary hover:text-primary transition-all text-left text-sm font-medium text-gray-700 shadow-sm">
                         <FileText size={18} className="text-gray-400" /> Hướng dẫn bảo quản
                      </button>
                   </div>
                </div>

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 text-center">
                   <h3 className="font-bold text-primary mb-2">Vẫn cần giúp đỡ?</h3>
                   <p className="text-sm text-gray-600 mb-4">Đội ngũ CSKH của chúng tôi sẽ phản hồi trong vòng 24h.</p>
                   <Button variant="outline" fullWidth className="bg-white">Gửi yêu cầu</Button>
                </div>
              </Reveal>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Support;