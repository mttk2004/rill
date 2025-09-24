import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Award, Users, Truck, Clock, Disc3 } from "lucide-react";
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function About() {
  const { auth } = usePage<SharedData>().props;

  const stats = [
    { icon: Users, label: "Khách hàng hài lòng", value: "10,000+" },
    { icon: Award, label: "Đĩa than chính hãng", value: "1,500+" },
    { icon: Truck, label: "Đơn hàng đã giao", value: "25,000+" },
    { icon: Clock, label: "Năm kinh nghiệm", value: "5+" }
  ];

  const values = [
    {
      icon: Heart,
      title: "Đam mê âm nhạc",
      description: "Chúng tôi tin rằng âm nhạc là ngôn ngữ chung của nhân loại. Mỗi đĩa than không chỉ là sản phẩm mà là cách để truyền tải cảm xúc và kỷ niệm."
    },
    {
      icon: Award,
      title: "Chất lượng hàng đầu",
      description: "Tất cả sản phẩm đều được kiểm tra kỹ lưỡng về chất lượng âm thanh và tình trạng vật lý trước khi đến tay khách hàng."
    },
    {
      icon: Users,
      title: "Cộng đồng sưu tầm",
      description: "Xây dựng một cộng đồng những người yêu nhạc, nơi mọi người có thể chia sẻ đam mê và khám phá những album tuyệt vời."
    }
  ];

  const team = [
    {
      name: "Nguyễn Minh Anh",
      role: "Founder & CEO",
      description: "15 năm kinh nghiệm trong ngành âm nhạc và đam mê sưu tầm đĩa than từ những năm 2000.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Trần Hoàng Nam",
      role: "Head of Curation",
      description: "Chuyên gia về âm nhạc cổ điển và rock, phụ trách tuyển chọn các album chất lượng cao.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Lê Thị Mai",
      role: "Customer Experience",
      description: "Đảm bảo mọi khách hàng đều có trải nghiệm mua sắm tuyệt vời và được hỗ trợ tận tình.",
      image: "/placeholder-avatar.jpg"
    }
  ];

  return (
    <>
      <Head title="Về chúng tôi - Rill" />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-primary/90 text-white py-16 lg:py-24">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              🎵 Câu chuyện của Rill
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Kết nối đam mê âm nhạc
              <span className="block text-accent">qua từng đĩa than</span>
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Từ năm 2019, Rill đã trở thành điểm đến tin cậy cho những người yêu âm nhạc và sưu tầm đĩa than tại Việt Nam.
              Chúng tôi tự hào mang đến những album kinh điển với chất lượng hoàn hảo.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-accent mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Story */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
                <p className="text-lg text-muted-foreground">
                  Rill ra đời với sứ mệnh bảo tồn và lan tỏa văn hóa âm nhạc qua đĩa than
                </p>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed mb-6">
                  Trong thời đại số hóa, chúng tôi tin rằng vẫn có một chỗ đứng đặc biệt cho âm nhạc analog.
                  Âm thanh ấm áp, đầy đủ từ đĩa than mang lại trải nghiệm nghe nhạc không thể thay thế.
                </p>

                <p className="text-lg leading-relaxed mb-6">
                  Rill không chỉ là cửa hàng bán đĩa than. Chúng tôi là nơi kết nối những tâm hồn yêu âm nhạc,
                  nơi mỗi album đều có câu chuyện riêng và mỗi khách hàng đều được tư vấn tận tình để tìm được
                  những bản nhạc phù hợp với sở thích cá nhân.
                </p>

                <p className="text-lg leading-relaxed">
                  Từ những album rock kinh điển của The Beatles, Pink Floyd đến jazz huyền thoại của Miles Davis,
                  hay những tác phẩm hiện đại của các nghệ sĩ Việt Nam, Rill luôn đảm bảo chất lượng và tính chính hãng
                  của từng sản phẩm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Giá trị cốt lõi</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Những nguyên tắc định hướng mọi hoạt động của Rill
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card
                  key={value.title}
                  className="text-center border-0 shadow-vinyl animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
                      <value.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Những người đam mê âm nhạc đứng sau thành công của Rill
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <Card
                  key={member.name}
                  className="text-center border-0 shadow-vinyl animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                      <Disc3 className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                    <p className="text-accent font-medium mb-4">{member.role}</p>
                    <p className="text-muted-foreground leading-relaxed">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Hãy cùng chúng tôi khám phá âm nhạc
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Liên hệ với Rill để được tư vấn về những album phù hợp với sở thích của bạn
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="accent" size="lg">
                Liên hệ ngay
              </Button>
              <Button variant="hero" size="lg">
                Khám phá sản phẩm
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
