import { Head, Link } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { ArrowRight, Disc, Package, CheckCircle } from 'lucide-react';
import type { Product, Artist, Collection } from '@/types';

interface HomeProps {
  featuredProducts: Product[];
  collections: Collection[];
  artists: Artist[];
  settings: {
    returnPolicyDays: string;
    returnPolicyCondition: string;
  };
}

export default function Home({ featuredProducts = [], collections = [], artists = [], settings }: HomeProps) {
  // Fallback to empty arrays if data not provided

  return (
    <AppLayout>
      <Head title="Trang chủ - Rill" />
      <div className="flex flex-col min-h-screen">
        {/* Hero Section - Keep CSS animation for immediate impact on load */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 opacity-40 animate-fade-in">
            <img
              src="https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=2074&auto=format&fit=crop"
              alt="Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent"></div>
          </div>
          <div className="relative z-10 text-center max-w-4xl px-6">
            <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-[0.2em] mb-8 border border-white/20 animate-fade-in-down uppercase" style={{ animationDelay: '0.2s' }}>
              Premium Vinyl Collection
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-8 leading-tight animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Âm Nhạc <br /> <span className="italic text-accent font-light">Nguyên Bản</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '0.6s' }}>
              Khám phá những giai điệu bất hủ qua chất âm Analog chân thực nhất. <br className="hidden md:block" />Từ Jazz cổ điển đến Rock hiện đại.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              <Link href="/products">
                <Button variant="accent" className="h-12 px-8 text-base">
                  Mua Ngay <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline-white" className="h-12 px-8 text-base">
                  Tìm Hiểu Thêm
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Collections */}
        {collections && collections.length > 0 && (
          <section className="py-24 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <Reveal>
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Bộ Sưu Tập</h2>
                  <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
                  <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                    Được tuyển chọn kỹ lưỡng bởi các chuyên gia âm thanh, mang đến trải nghiệm nghe nhạc tuyệt vời nhất cho không gian của bạn.
                  </p>
                </div>
              </Reveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {collections.slice(0, 2).map((col, idx) => (
                  <Reveal key={col.id} delay={idx * 0.2} direction={idx % 2 === 0 ? 'left' : 'right'}>
                    <Link href={`/products?collection=${col.slug}`} className="block h-full">
                      <div className="relative group overflow-hidden rounded-2xl h-[400px] cursor-pointer">
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors z-10 duration-500"></div>
                        <img
                          src={col.image_url || `https://images.unsplash.com/photo-${idx === 0 ? '1489641493513-ba6daaa61833' : '1500462918059-b1a0cb512f1d'}?q=80&w=1000&auto=format&fit=crop`}
                          alt={col.name}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-accent text-sm font-bold tracking-widest mb-2 uppercase">{col.type === 'featured' ? 'Best Sellers' : 'Editors Choice'}</p>
                          <div className="flex justify-between items-end">
                            <h3 className="text-3xl font-serif font-bold text-white group-hover:text-accent transition-colors">{col.name}</h3>
                            <span className="h-10 w-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white group-hover:bg-accent group-hover:text-white transition-all">
                              <ArrowRight size={20} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Products */}
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                  <span className="text-accent font-bold tracking-wider text-xs uppercase mb-2 block">Trending Now</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">Đĩa Than Bán Chạy Nhất</h2>
                </div>
                <Link href="/products" className="hidden md:flex items-center text-sm font-bold text-primary hover:text-accent transition-colors border-b border-primary hover:border-accent pb-0.5">
                  Xem tất cả <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
              {featuredProducts.map((product, idx) => (
                <Reveal key={product.id} delay={idx * 0.1} direction="up">
                  <ProductCard
                    product={product}
                    artist={artists ? artists.find(a => a.id === product.artist_id) : undefined}
                  />
                </Reveal>
              ))}
            </div>

            <div className="mt-16 text-center md:hidden">
              <Link href="/products">
                <Button variant="outline">Xem tất cả sản phẩm</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-primary text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <Reveal>
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Tại Sao Chọn Rill Store?</h2>
                <p className="text-gray-300 text-lg font-light">
                  Chúng tôi không chỉ bán đĩa than, chúng tôi cung cấp trải nghiệm âm nhạc hoàn hảo với tiêu chuẩn dịch vụ cao cấp nhất.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Reveal delay={0.1} className="h-full">
                <div className="h-full p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent">
                    <Disc size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Chính Hãng 100%</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Tất cả sản phẩm đều được nhập khẩu chính ngạch từ các hãng đĩa danh tiếng thế giới. Cam kết hoàn tiền gấp đôi nếu phát hiện hàng giả.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.2} className="h-full">
                <div className="h-full p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent">
                    <Package size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Đóng Gói Chuyên Nghiệp</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sử dụng hộp carton 5 lớp chuyên dụng cho Vinyl, bọc chống sốc 3 lớp, đảm bảo đĩa đến tay bạn trong tình trạng hoàn hảo nhất.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.3} className="h-full">
                <div className="h-full p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
                  <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Bảo Hành 1 Đổi 1</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Chính sách đổi trả trong vòng {settings.returnPolicyDays} ngày nếu có {settings.returnPolicyCondition}. Hỗ trợ kỹ thuật trọn đời.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Khách Hàng Nói Gì Về Chúng Tôi</h2>
                <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
                <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
                  Hàng nghìn khách hàng đã tin tưởng và hài lòng với chất lượng sản phẩm cùng dịch vụ của Rill Store.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Reveal delay={0.1}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Chất lượng đĩa than tuyệt vời, đóng gói cẩn thận. Đặc biệt là bộ sưu tập Jazz của shop rất đa dạng và chính hãng. Sẽ tiếp tục ủng hộ!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      M
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Minh Tuấn</p>
                      <p className="text-sm text-gray-500">Đã mua 12 đĩa</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Giao hàng nhanh chóng, nhân viên tư vấn nhiệt tình. Đĩa đến tay trong tình trạng hoàn hảo. Âm thanh analog thật sự khác biệt!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-lg">
                      H
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Hương Trà</p>
                      <p className="text-sm text-gray-500">Khách hàng thân thiết</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-1 text-yellow-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 italic">
                    "Mình rất hài lòng với các album giới hạn. Giá cả hợp lý, chính sách đổi trả rõ ràng. Rill Store là địa chỉ tin cậy cho người yêu vinyl!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      Q
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Quốc Anh</p>
                      <p className="text-sm text-gray-500">Vinyl collector</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
