import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCard } from "@/components/product-card";
import { Play, Star, ShoppingBag, Truck, Award, Users, Disc3 } from "lucide-react";
import { type Product, type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode, MouseEvent, useMemo } from "react";
import { useToastRouter } from '@/hooks/use-toast-router';

interface WelcomeProps {
  featuredProducts: Product[];
}

const Welcome = ({ featuredProducts }: WelcomeProps) => {
  const { cart } = usePage<SharedData>().props;
  const { post } = useToastRouter();

  const cartItemProductIds = useMemo(() => new Set(cart.items.map(item => item.product.id)), [cart.items]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>, productId: string) => {
    e.preventDefault();
    e.stopPropagation();

    post('/cart/add', { product_id: productId, quantity: 1 }, {
      pending: 'Đang thêm vào giỏ hàng...',
      success: 'Đã thêm sản phẩm vào giỏ hàng! 🎉',
      error: 'Đã xảy ra lỗi khi thêm vào giỏ hàng',
    }, { preserveScroll: true });
  };

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
      {/* Hero Section with Enhanced Effects */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/90 min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          {/* Background Image */}
          <div className="absolute inset-0 will-change-transform" style={{ transform: 'translateZ(0)' }}>
            <img
              src="/hero-vinyl.jpg"
              alt="Vinyl Records"
              className="w-full h-full object-cover scale-110 transition-transform duration-1000 ease-out"
            />
          </div>
          {/* Enhanced Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/40" />
          {/* Animated Decorative Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 border border-accent/30 rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-20 w-24 h-24 border border-accent/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-20 w-20 h-20 border border-accent/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/25 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center">
            <div className="hero-fade-in">
              {/* Glassmorphism Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-accent mb-8 shadow-lg hover:bg-white/15 transition-all duration-300">
                <Disc3 className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-semibold">Cửa hàng đĩa than #1 Việt Nam</span>
              </div>

              {/* Enhanced Typography with Gradient */}
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold text-white mb-8 leading-tight">
                Khám phá
                <span className="block mt-2 bg-gradient-to-r from-accent via-amber-400 to-accent bg-clip-text text-transparent relative">
                  Thế giới Đĩa Than
                  <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full"></div>
                </span>
              </h1>

              <p className="text-xl lg:text-2xl text-white/95 mb-10 leading-relaxed max-w-3xl mx-auto font-light">
                Bộ sưu tập đĩa than chính hãng từ những nghệ sĩ huyền thoại đến các album hiện đại.
                Trải nghiệm âm nhạc thuần túy với chất lượng vượt thời gian.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center">
                <Button size="xl" className="group relative overflow-hidden bg-accent hover:bg-accent text-accent-foreground shadow-2xl shadow-accent/50 hover:shadow-accent/70 transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/products">
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                    <ShoppingBag className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Khám phá ngay
                  </Link>
                </Button>
                <Button variant="outline" size="xl" className="group border-2 border-white/60 text-white hover:bg-white hover:text-slate-900 backdrop-blur-xl bg-white/5 hover:border-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                  <Link href="/about">
                    <Play className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Về chúng tôi
                  </Link>
                </Button>
              </div>

              {/* Glassmorphism Stats Cards */}
              <div className="grid grid-cols-3 gap-6 mt-16">
                {[
                  { value: '1,000+', label: 'Albums', delay: '0ms' },
                  { value: '5,000+', label: 'Khách hàng', delay: '100ms' },
                  { value: '4.9', label: 'Đánh giá', delay: '200ms' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="group relative p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-accent/50"
                    style={{ animationDelay: stat.delay }}
                  >
                    <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-accent to-amber-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                    <div className="text-sm lg:text-base text-white/80 mt-1 font-medium">{stat.label}</div>
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </section>

      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 lg:py-32 relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-accent/5 to-background">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>

          <div className="relative container mx-auto px-4">
            <div className="text-center mb-16">
              {/* Enhanced Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent/10 backdrop-blur-sm text-accent mb-6 border border-accent/20 hover:bg-accent/15 transition-all duration-300">
                <Disc3 className="h-4 w-4 animate-spin" style={{ animationDuration: '3s' }} />
                <span className="text-sm font-semibold">Bộ sưu tập đặc biệt</span>
              </div>

              {/* Enhanced Title */}
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 bg-gradient-to-r from-accent via-amber-500 to-accent bg-clip-text text-transparent">
                Sản phẩm nổi bật
              </h2>
              <p className="text-muted-foreground text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                Những album kinh điển được yêu thích nhất bởi cộng đồng sưu tầm đĩa than
              </p>
            </div>

            {/* Enhanced Product Grid with 3D Hover Effects */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group perspective-1000"
                  style={{
                    animation: 'fadeInUp 0.6s ease-out forwards',
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0
                  }}
                >
                  <div className="transform-gpu transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                    <ProductCard
                      product={product}
                      index={index}
                      showActions={true}
                      onAddToCart={handleAddToCart}
                      isInCart={cartItemProductIds.has(product.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Button */}
            <div className="text-center mt-16">
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-accent/10 to-amber-500/10 text-accent border-2 border-accent/30 hover:border-accent hover:bg-accent hover:text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link href="/products">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>
                  <Disc3 className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  Xem toàn bộ bộ sưu tập
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

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
                    <div className="absolute inset-0 rounded-full border-2 border-accent/20 group-hover:border-accent/40 transition-colors duration-300"></div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-accent">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                  <div className="mt-4 w-12 h-1 bg-gradient-to-r from-accent/30 to-accent/60 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>

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

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary via-primary/95 to-primary/90 relative overflow-hidden">
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
    </>
  );
}

Welcome.layout = (page: ReactNode) => <AppLayout children={page} />

export default Welcome;
