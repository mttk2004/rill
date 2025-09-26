import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  Search,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  ShieldCheck,
  Send,
  Disc3,
  Heart,
  Headphones,
  Star
} from "lucide-react";
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const faqs = [
  {
    id: "1",
    question: "Làm thế nào để đặt hàng trên Rill?",
    answer: "Để đặt hàng, bạn chỉ cần chọn sản phẩm yêu thích, thêm vào giỏ hàng, và tiến hành thanh toán. Chúng tôi hỗ trợ nhiều phương thức thanh toán như thẻ tín dụng, chuyển khoản ngân hàng và COD."
  },
  {
    id: "2",
    question: "Thời gian giao hàng là bao lâu?",
    answer: "Thời gian giao hàng thông thường là 2-5 ngày làm việc trong nội thành TP.HCM và Hà Nội, 3-7 ngày cho các tỉnh thành khác. Đối với những sản phẩm đặc biệt hoặc nhập khẩu, thời gian có thể lâu hơn 7-14 ngày."
  },
  {
    id: "3",
    question: "Tôi có thể đổi trả sản phẩm không?",
    answer: "Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm còn nguyên vẹn, chưa sử dụng và có đầy đủ bao bì, hóa đơn. Chi phí vận chuyển đổi trả sẽ do khách hàng chịu trừ khi lỗi từ phía shop."
  },
  {
    id: "4",
    question: "Làm thế nào để kiểm tra tình trạng đơn hàng?",
    answer: "Bạn có thể đăng nhập vào tài khoản và vào mục 'Đơn hàng của tôi' để theo dõi tình trạng đơn hàng. Chúng tôi cũng sẽ gửi email thông báo khi có cập nhật về đơn hàng của bạn."
  },
  {
    id: "5",
    question: "Rill có bảo hành sản phẩm không?",
    answer: "Tất cả sản phẩm đĩa than tại Rill đều được kiểm tra chất lượng kỹ lưỡng trước khi giao hàng. Chúng tôi cam kết đổi sản phẩm mới nếu phát hiện lỗi từ phía nhà sản xuất trong vòng 30 ngày."
  },
  {
    id: "6",
    question: "Tôi quên mật khẩu, làm sao để khôi phục?",
    answer: "Bạn có thể nhấn vào 'Quên mật khẩu' ở trang đăng nhập, nhập email đã đăng ký và chúng tôi sẽ gửi link khôi phục mật khẩu đến email của bạn."
  }
];

const contactMethods = [
  {
    icon: <Phone className="h-6 w-6" />,
    title: "Điện thoại",
    info: "1900-1234",
    description: "T2-T6: 8:00-18:00, T7: 8:00-12:00",
    action: "Gọi ngay"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Email",
    info: "support@rill.vn",
    description: "Phản hồi trong vòng 24h",
    action: "Gửi email"
  },
  {
    icon: <MessageCircle className="h-6 w-6" />,
    title: "Live Chat",
    info: "Chat trực tuyến",
    description: "Hỗ trợ tức thì T2-T6: 8:00-22:00",
    action: "Bắt đầu chat"
  }
];

export default function Support() {
  const { auth } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Hỗ trợ - Rill" />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        <main className="min-h-screen">
          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15),transparent_60%)]" />
            
            <div className="absolute top-10 left-10 opacity-30">
              <Disc3 className="w-32 h-32 animate-spin-slow text-accent/40" />
            </div>
            <div className="absolute bottom-10 right-10 opacity-30">
              <Headphones className="w-40 h-40 text-accent/20" />
            </div>
            
            <div className="container mx-auto px-4 text-center relative z-10 py-20 lg:py-32">
              <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-semibold bg-accent/90 text-white border-0 shadow-lg">
                🎧 Hỗ trợ 24/7
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-white">
                Trung tâm
                <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent drop-shadow-sm">
                  hỗ trợ khách hàng
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn trong hành trình khám phá âm nhạc vinyl
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-lg font-semibold">Phản hồi nhanh chóng</span>
                </div>
                <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse animation-delay-300" />
                  <span className="text-lg font-semibold">Hỗ trợ chuyên nghiệp</span>
                </div>
              </div>
            </div>
          </section>          {/* Contact Methods */}
          <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-accent/5 to-slate-50" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent" />
                  <MessageCircle className="w-8 h-8 text-accent" />
                  <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-accent bg-clip-text text-transparent">
                  Liên hệ với chúng tôi
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                  Chọn cách thức liên hệ phù hợp để được hỗ trợ nhanh chóng
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {contactMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in bg-gradient-to-br from-white to-accent/5"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardHeader className="text-center relative z-10">
                      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-accent/10 via-accent/5 to-transparent rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 transition-all duration-300">
                        {method.icon}
                      </div>
                      <CardTitle className="text-2xl font-bold text-slate-900">{method.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center relative z-10">
                      <p className="font-bold text-xl text-accent">{method.info}</p>
                      <p className="text-slate-600 leading-relaxed">{method.description}</p>
                      <Button
                        className="w-full shadow-lg hover:shadow-accent/30 transition-all duration-300"
                        variant="default"
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        {method.action}
                      </Button>
                      <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full opacity-60 group-hover:animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(217,119,6,0.15),transparent_60%)]" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 max-w-7xl mx-auto">
                {/* FAQ Section */}
                <div className="space-y-8">
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <Search className="h-6 w-6 text-accent" />
                        </div>
                        Câu hỏi thường gặp
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border border-accent/20 rounded-xl px-6 bg-white/5 backdrop-blur-sm"
                          >
                            <AccordionTrigger className="text-left text-white hover:text-accent transition-colors duration-300 py-6 drop-shadow-sm">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-200 pb-6 leading-relaxed drop-shadow-sm">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <Star className="h-6 w-6 text-accent" />
                        </div>
                        Hành động nhanh
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-accent/30 text-white hover:bg-accent hover:text-white transition-all duration-300">
                        <Package className="h-5 w-5 mr-3" />
                        Theo dõi đơn hàng
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-accent/30 text-white hover:bg-accent hover:text-white transition-all duration-300">
                        <RefreshCw className="h-5 w-5 mr-3" />
                        Đổi trả sản phẩm
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-accent/30 text-white hover:bg-accent hover:text-white transition-all duration-300">
                        <CreditCard className="h-5 w-5 mr-3" />
                        Hỗ trợ thanh toán
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-accent/30 text-white hover:bg-accent hover:text-white transition-all duration-300">
                        <Truck className="h-5 w-5 mr-3" />
                        Thông tin vận chuyển
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-white/10 border-accent/30 text-white hover:bg-accent hover:text-white transition-all duration-300">
                        <ShieldCheck className="h-5 w-5 mr-3" />
                        Chính sách bảo mật
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Contact Form */}
                <div>
                  <Card className="border-0 shadow-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl font-bold text-white">
                        <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                          <Send className="h-6 w-6 text-accent" />
                        </div>
                        Gửi yêu cầu hỗ trợ
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium mb-3 block text-white">Họ tên *</label>
                          <Input
                            placeholder="Nhập họ tên"
                            className="bg-white/10 border-accent/30 text-white placeholder:text-slate-400 focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-3 block text-white">Email *</label>
                          <Input
                            type="email"
                            placeholder="Nhập email"
                            className="bg-white/10 border-accent/30 text-white placeholder:text-slate-400 focus:border-accent"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm font-medium mb-3 block text-white">Số điện thoại</label>
                          <Input
                            placeholder="Nhập số điện thoại"
                            className="bg-white/10 border-accent/30 text-white placeholder:text-slate-400 focus:border-accent"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-3 block text-white">Loại yêu cầu *</label>
                          <Select>
                            <SelectTrigger className="bg-white/10 border-accent/30 text-white focus:border-accent">
                              <SelectValue placeholder="Chọn loại yêu cầu" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="order">Vấn đề đơn hàng</SelectItem>
                              <SelectItem value="product">Thông tin sản phẩm</SelectItem>
                              <SelectItem value="payment">Thanh toán</SelectItem>
                              <SelectItem value="shipping">Vận chuyển</SelectItem>
                              <SelectItem value="return">Đổi trả</SelectItem>
                              <SelectItem value="account">Tài khoản</SelectItem>
                              <SelectItem value="other">Khác</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block text-white">Mã đơn hàng (nếu có)</label>
                        <Input
                          placeholder="VD: RL-001234"
                          className="bg-white/10 border-accent/30 text-white placeholder:text-slate-400 focus:border-accent"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-3 block text-white">Nội dung *</label>
                        <Textarea
                          placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                          rows={6}
                          className="bg-white/10 border-accent/30 text-white placeholder:text-slate-400 focus:border-accent resize-none"
                        />
                      </div>

                      <Button className="w-full bg-accent hover:bg-accent/90 text-white shadow-xl hover:shadow-accent/30 transition-all duration-300 py-3">
                        <Send className="h-5 w-5 mr-2" />
                        Gửi yêu cầu hỗ trợ
                      </Button>

                      <div className="bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 rounded-xl p-6 backdrop-blur-sm">
                        <div className="flex items-center gap-3 text-accent font-bold mb-4">
                          <Clock className="h-6 w-6" />
                          Thời gian phản hồi
                        </div>
                        <div className="space-y-2 text-slate-300">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <span>Email: Trong vòng 24 giờ</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <span>Điện thoại: Ngay lập tức (giờ hành chính)</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-accent rounded-full" />
                            <span>Chat: 1-5 phút (T2-T6: 8:00-22:00)</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
