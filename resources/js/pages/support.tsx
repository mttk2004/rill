import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Navigation } from "@/components/navigation";
import {
  HelpCircle,
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
  Send
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

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-2">
                <HelpCircle className="h-10 w-10 text-primary" />
                Trung tâm hỗ trợ
              </h1>
              <p className="text-xl text-muted-foreground">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
              </p>
            </div>

            {/* Contact Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-vinyl">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                      {method.icon}
                    </div>
                    <CardTitle>{method.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold text-lg">{method.info}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <Button className="w-full">{method.action}</Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* FAQ Section */}
              <div>
                <Card className="border-0 shadow-vinyl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Câu hỏi thường gặp
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="mt-6 border-0 shadow-vinyl">
                  <CardHeader>
                    <CardTitle>Hành động nhanh</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Theo dõi đơn hàng
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Đổi trả sản phẩm
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Hỗ trợ thanh toán
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Truck className="h-4 w-4 mr-2" />
                      Thông tin vận chuyển
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Chính sách bảo mật
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div>
                <Card className="border-0 shadow-vinyl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5 text-primary" />
                      Gửi yêu cầu hỗ trợ
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Họ tên *</label>
                        <Input placeholder="Nhập họ tên" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email *</label>
                        <Input type="email" placeholder="Nhập email" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Số điện thoại</label>
                        <Input placeholder="Nhập số điện thoại" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Loại yêu cầu *</label>
                        <Select>
                          <SelectTrigger>
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
                      <label className="text-sm font-medium mb-2 block">Mã đơn hàng (nếu có)</label>
                      <Input placeholder="VD: RL-001234" />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Nội dung *</label>
                      <Textarea
                        placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                        rows={5}
                      />
                    </div>

                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Gửi yêu cầu
                    </Button>

                    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-accent font-medium mb-2">
                        <Clock className="h-4 w-4" />
                        Thời gian phản hồi
                      </div>
                      <p className="text-sm text-muted-foreground">
                        • Email: Trong vòng 24 giờ<br/>
                        • Điện thoại: Ngay lập tức (giờ hành chính)<br/>
                        • Chat: 1-5 phút (T2-T6: 8:00-22:00)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
