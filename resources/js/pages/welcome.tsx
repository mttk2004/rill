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
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-transparent" />
          </div>

          <div className="relative container mx-auto px-4 py-24 lg:py-32">
            <div className="max-w-2xl hero-fade-in">
              <Badge variant="secondary" className="mb-4">
                🎵 Cửa hàng đĩa than #1 Việt Nam
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Khám phá
                <span className="text-accent block">Thế giới Đĩa Than</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Bộ sưu tập đĩa than chính hãng từ những nghệ sĩ huyền thoại đến các album hiện đại.
                Trải nghiệm âm nhạc thuần túy với chất lượng vượt thời gian.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="accent" size="xl" className="group" asChild>
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Khám phá ngay
                  </Link>
                </Button>
                <Button variant="hero" size="xl" className="group" asChild>
                  <Link href="/products">
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Xem bộ sưu tập
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Sản phẩm nổi bật</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Những album kinh điển được yêu thích nhất bởi cộng đồng sưu tầm đĩa than
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <Card
                  key={product.id}
                  className="product-hover cursor-pointer animate-fade-in border-0 shadow-vinyl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className="w-full h-64 bg-muted rounded-t-lg flex items-center justify-center">
                        <Disc3 className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                      {product.badge && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 left-3 bg-accent text-accent-foreground"
                        >
                          {product.badge}
                        </Badge>
                      )}
                    </div>

                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-muted-foreground mb-3">{product.artist}</p>

                      <div className="flex items-center gap-2 mb-3">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="text-sm font-medium">{product.rating}</span>
                        <span className="text-xs text-muted-foreground">(128 đánh giá)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-accent">{product.price}đ</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              {product.originalPrice}đ
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="hover:bg-accent hover:text-accent-foreground">
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" asChild>
                <Link href="/products">Xem tất cả sản phẩm</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="text-center group animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 lg:py-24 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Đăng ký nhận tin mới nhất
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Cập nhật những album mới, ưu đai đặc biệt và sự kiện thú vị từ Rill
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 rounded-md bg-white text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button variant="accent" size="lg">
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
