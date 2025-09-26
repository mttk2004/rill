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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,6,0.15),transparent_60%)]" />

          <div className="absolute top-10 left-10 opacity-30">
            <Disc3 className="w-32 h-32 animate-spin-slow text-accent/40" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-30">
            <Disc3 className="w-40 h-40 animate-reverse-spin text-accent/20" />
          </div>

          <div className="container mx-auto px-4 text-center relative z-10 py-20 lg:py-32">
            <Badge variant="secondary" className="mb-6 px-6 py-3 text-sm font-semibold bg-accent/90 text-white border-0 shadow-lg">
              🎵 Câu chuyện của Rill
            </Badge>
            <h1 className="text-5xl lg:text-7xl font-bold mb-8 leading-tight text-white">
              Kết nối đam mê
              <span className="block bg-gradient-to-r from-accent via-yellow-400 to-accent bg-clip-text text-transparent drop-shadow-sm">
                âm nhạc vintage
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-sm">
              Từ năm 2019, Rill đã trở thành điểm đến tin cậy cho những người yêu âm nhạc và sưu tầm đĩa than tại Việt Nam.
              Chúng tôi tự hào mang đến những album kinh điển với chất lượng hoàn hảo.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                <span className="text-lg font-semibold">Hành trình 5+ năm</span>
              </div>
              <div className="flex items-center gap-4 text-white bg-accent/20 px-6 py-3 rounded-full backdrop-blur-sm border border-accent/30">
                <div className="w-3 h-3 bg-accent rounded-full animate-pulse animation-delay-300" />
                <span className="text-lg font-semibold">25,000+ đơn hàng</span>
              </div>
            </div>
          </div>
        </section>        {/* Stats */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-accent/5 to-slate-50" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent text-accent mb-6 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-accent/20 transition-all duration-300 border border-accent/10">
                      <stat.icon className="h-10 w-10" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-pulse opacity-80" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-orange-600 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600 tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission & Story */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(217,119,6,0.15),transparent_60%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent" />
                  <Disc3 className="w-8 h-8 text-accent animate-spin-slow" />
                  <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-sm">
                  Sứ mệnh của chúng tôi
                </h2>
                <p className="text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
                  Rill ra đời với sứ mệnh bảo tồn và lan tỏa văn hóa âm nhạc qua đĩa than
                </p>
              </div>              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-accent/20">
                    <p className="text-lg leading-relaxed text-slate-200 drop-shadow-sm">
                      Trong thời đại số hóa, chúng tôi tin rằng vẫn có một chỗ đứng đặc biệt cho âm nhạc analog.
                      Âm thanh ấm áp, đầy đủ từ đĩa than mang lại trải nghiệm nghe nhạc không thể thay thế.
                    </p>
                  </div>

                  <div className="backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-accent/20">
                    <p className="text-lg leading-relaxed text-slate-200 drop-shadow-sm">
                      Rill không chỉ là cửa hàng bán đĩa than. Chúng tôi là nơi kết nối những tâm hồn yêu âm nhạc,
                      nơi mỗi album đều có câu chuyện riêng và mỗi khách hàng đều được tư vấn tận tình để tìm được
                      những bản nhạc phù hợp với sở thích cá nhân.
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <div className="backdrop-blur-sm bg-gradient-to-br from-accent/20 to-transparent rounded-3xl p-10 border border-accent/30">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Cam kết chất lượng</h3>
                        <p className="text-accent">Từng sản phẩm đều được tuyển chọn</p>
                      </div>
                    </div>
                    <p className="text-slate-200 leading-relaxed drop-shadow-sm">
                      Từ những album rock kinh điển của The Beatles, Pink Floyd đến jazz huyền thoại của Miles Davis,
                      hay những tác phẩm hiện đại của các nghệ sĩ Việt Nam, Rill luôn đảm bảo chất lượng và tính chính hãng
                      của từng sản phẩm.
                    </p>
                  </div>

                  <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-accent/10 animate-pulse" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-gradient-to-br from-accent/5 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-accent/5" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent" />
                <Award className="w-8 h-8 text-accent" />
                <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-accent bg-clip-text text-transparent">
                Giá trị cốt lõi
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                Những nguyên tắc định hướng mọi hoạt động của Rill
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <Card
                  key={value.title}
                  className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in bg-gradient-to-br from-white to-accent/5"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-accent/5 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-10 relative z-10">
                    <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/10 via-accent/5 to-transparent text-accent mb-8 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20 transition-all duration-300">
                      <value.icon className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold mb-6 text-slate-900">{value.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{value.description}</p>

                    <div className="absolute top-4 right-4 w-3 h-3 bg-accent rounded-full opacity-60 group-hover:animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 lg:py-28 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(217,119,6,0.1),transparent_50%)]" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-accent" />
                <Users className="w-8 h-8 text-accent" />
                <div className="w-12 h-px bg-gradient-to-r from-accent to-transparent" />
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Đội ngũ của chúng tôi
              </h2>
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Những người đam mê âm nhạc đứng sau thành công của Rill
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {team.map((member, index) => (
                <Card
                  key={member.name}
                  className="group relative overflow-hidden border-0 shadow-2xl hover:shadow-accent/20 transition-all duration-500 animate-fade-in bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardContent className="p-10 text-center relative z-10">
                    <div className="relative mb-8">
                      <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-4 border-accent/30">
                        <Disc3 className="h-16 w-16 text-accent/70 animate-spin-slow" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-accent font-semibold text-lg mb-6">{member.role}</p>
                    <p className="text-slate-300 leading-relaxed text-lg">{member.description}</p>

                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-accent rounded-full animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-accent/10 to-accent/5" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-accent/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-radial from-accent/15 to-transparent rounded-full blur-3xl" />

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-8">
                <div className="w-16 h-px bg-gradient-to-r from-transparent to-accent" />
                <Disc3 className="w-10 h-10 text-accent animate-spin-slow" />
                <div className="w-16 h-px bg-gradient-to-r from-accent to-transparent" />
              </div>

              <h2 className="text-4xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-slate-900 via-accent to-slate-900 bg-clip-text text-transparent leading-tight">
                Hãy cùng chúng tôi khám phá âm nhạc vintage
              </h2>

              <p className="text-xl lg:text-2xl text-slate-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                Liên hệ với Rill để được tư vấn về những album phù hợp với sở thích của bạn
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  variant="accent"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-accent/30 transition-all duration-300"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Liên hệ ngay
                </Button>
                <Button
                  variant="hero"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold"
                >
                  <Disc3 className="w-5 h-5 mr-2" />
                  Khám phá bộ sưu tập
                </Button>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span>Miễn phí tư vấn</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-300" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-300" />
                  <span>Đảm bảo chất lượng</span>
                </div>
                <div className="hidden sm:block w-px h-4 bg-slate-300" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse animation-delay-600" />
                  <span>Giao hàng toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
