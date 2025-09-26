import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, ShoppingBag, Truck, Award, Users, Disc3 } from "lucide-react";
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
  const { auth } = usePage<SharedData>().props;

  const featuredProducts = [
    {
      id: 1,
      name: "Abbey Road - The Beatles",
      artist: "The Beatles",
      price: "1.250.000",
      originalPrice: "1.500.000",
      rating: 4.9,
      image: "/placeholder-vinyl.jpg",
      badge: "Bán chạy"
    },
    {
      id: 2,
      name: "Dark Side of the Moon",
      artist: "Pink Floyd",
      price: "980.000",
      rating: 4.8,
      image: "/placeholder-vinyl.jpg",
      badge: "Mới về"
    },
    {
      id: 3,
      name: "Thriller - Michael Jackson",
      artist: "Michael Jackson",
      price: "1.100.000",
      rating: 4.9,
      image: "/placeholder-vinyl.jpg",
      badge: "Giảm giá"
    }
  ];

  const features = [
    {
      icon: Award,
      title: "Chất lượng đảm bảo",
      description: "100% đĩa than chính hãng, kiểm tra kỹ thuật trước khi giao"
    },
    {
      icon: Truck,
      title: "Miễn phí vận chuyển",
      description: "Giao hàng miễn phí toàn quốc cho đơn hàng từ 500.000đ"
    },
    {
      icon: Users,
      title: "Cộng đồng yêu nhạc",
      description: "Tham gia cộng đồng những người sưu tầm đĩa than"
    }
  ];

  return (
    <>
      <Head title="Rill - Cửa hàng Đĩa Than Online" />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90">
          {/* Vintage Pattern Overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 border border-accent/20 rounded-full"></div>
              <div className="absolute top-20 right-20 w-24 h-24 border border-accent/20 rounded-full"></div>
              <div className="absolute bottom-20 left-20 w-20 h-20 border border-accent/20 rounded-full"></div>
            </div>
          </div>

          <div className="relative container mx-auto px-4 py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="hero-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                  <Disc3 className="h-4 w-4" />
                  <span className="text-sm font-medium">Cửa hàng đĩa than #1 Việt Nam</span>
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Khám phá
                  <span className="text-accent block relative">
                    Thế giới Đĩa Than
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-accent/30 rounded-full"></div>
                  </span>
                </h1>
                
                <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
                  Bộ sưu tập đĩa than chính hãng từ những nghệ sĩ huyền thoại đến các album hiện đại.
                  Trải nghiệm âm nhạc thuần túy với chất lượng vượt thời gian.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="xl" className="group bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                    <Link href="/products">
                      <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Khám phá ngay
                    </Link>
                  </Button>
                  <Button variant="outline" size="xl" className="group border-white/30 text-white hover:bg-white/10" asChild>
                    <Link href="/about">
                      <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Về chúng tôi
                    </Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">1,000+</div>
                    <div className="text-sm text-white/70">Albums</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">5,000+</div>
                    <div className="text-sm text-white/70">Khách hàng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">4.9</div>
                    <div className="text-sm text-white/70">Đánh giá</div>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative lg:justify-self-end">
                <div className="relative w-full max-w-md mx-auto">
                  {/* Vinyl Record Animation */}
                  <div className="relative w-80 h-80 mx-auto">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-accent/40 animate-spin-slow"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                        <Disc3 className="h-6 w-6 text-accent" />
                      </div>
                    </div>
                    {/* Needle */}
                    <div className="absolute top-0 right-12 w-1 h-32 bg-accent/60 rounded-full origin-bottom transform rotate-12"></div>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-8 -left-8 w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center animate-bounce">
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center animate-pulse">
                    <Award className="h-6 w-6 text-accent" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background"></div>
          
          <div className="relative container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
                <Disc3 className="h-4 w-4" />
                <span className="text-sm font-medium">Bộ sưu tập đặc biệt</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-accent">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Những album kinh điển được yêu thích nhất bởi cộng đồng sưu tầm đĩa than
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="group cursor-pointer animate-fade-in border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-background to-accent/5"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <div className="w-full h-64 bg-gradient-to-br from-muted to-muted/50 rounded-t-lg flex items-center justify-center relative overflow-hidden">
                        {/* Vinyl Record Effect */}
                        <div className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Disc3 className="h-20 w-20 text-muted-foreground/30 group-hover:text-accent/50 transition-colors duration-300 group-hover:animate-spin-slow" />
                      </div>
                      {product.badge && (
                        <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground shadow-lg">
                          {product.badge}
                        </Badge>
                      )}
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button size="sm" className="bg-white text-accent hover:bg-white/90">
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-accent transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-muted-foreground">{product.artist}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">(128 đánh giá)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-accent">{product.price}đ</span>
                            {product.originalPrice && (
                              <span className="text-sm text-muted-foreground line-through">
                                {product.originalPrice}đ
                              </span>
                            )}
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-green-600 font-medium">
                              Tiết kiệm {((parseInt(product.originalPrice.replace(/\./g, '')) - parseInt(product.price.replace(/\./g, ''))) / 1000).toLocaleString()}K
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground">
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" className="bg-accent/10 text-accent border-2 border-accent/20 hover:bg-accent hover:text-accent-foreground" asChild>
                <Link href="/products">
                  <Disc3 className="mr-2 h-5 w-5" />
                  Xem toàn bộ bộ sưu tập
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gradient-to-br from-accent/5 via-background to-accent/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-accent mb-4">Tại sao chọn Rill?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cam kết mang đến trải nghiệm mua sắm đĩa than tốt nhất với dịch vụ chuyên nghiệp
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={feature.title}
                  className="group text-center border-2 border-accent/10 hover:border-accent/30 bg-gradient-to-br from-background to-accent/5 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 text-accent mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                      <feature.icon className="h-10 w-10 group-hover:scale-110 transition-transform duration-300" />
                      {/* Decorative ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300"></div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-accent">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    
                    {/* Decorative element */}
                    <div className="mt-4 w-12 h-1 bg-gradient-to-r from-accent/30 to-accent/60 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Features */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🎵', title: '1000+ Albums', desc: 'Bộ sưu tập đa dạng' },
                { icon: '⭐', title: '4.9/5 Sao', desc: 'Đánh giá từ khách hàng' },
                { icon: '🚚', title: 'Giao hàng 24h', desc: 'Trong nội thành' },
                { icon: '💎', title: 'Chính hãng 100%', desc: 'Đảm bảo chất lượng' }
              ].map((item) => (
                <div key={item.title} className="text-center p-4 rounded-lg bg-white/50 hover:bg-accent/5 transition-colors">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="font-semibold text-accent">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
          {/* Background Vinyl Records */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-40 h-40 border-2 border-accent rounded-full"></div>
            <div className="absolute top-40 right-32 w-32 h-32 border border-accent/50 rounded-full"></div>
            <div className="absolute bottom-20 left-1/3 w-24 h-24 border border-accent/30 rounded-full"></div>
          </div>
          
          <div className="relative container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6">
                <Disc3 className="h-4 w-4" />
                <span className="text-sm font-medium">Tham gia cộng đồng Rill</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Đăng ký nhận tin mới nhất
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                Cập nhật những album mới, ưu đãi đặc biệt và sự kiện thú vị từ cộng đồng vinyl lovers Rill
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 rounded-lg bg-white/90 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent border-0"
                  />
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg">
                    <Star className="mr-2 h-4 w-4" />
                    Đăng ký ngay
                  </Button>
                </div>
                
                <p className="text-white/70 text-sm mt-4">
                  🎵 Tham gia cùng hơn 5,000+ vinyl collectors khác
                </p>
              </div>

              {/* Social Proof */}
              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">5,000+</div>
                  <div className="text-sm text-white/70">Thành viên cộng đồng</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">Weekly</div>
                  <div className="text-sm text-white/70">Album mới cập nhật</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">Exclusive</div>
                  <div className="text-sm text-white/70">Ưu đãi đặc biệt</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
