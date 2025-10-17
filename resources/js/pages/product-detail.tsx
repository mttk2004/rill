import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ShoppingCart, Star, Disc3, Calendar, Music, ArrowLeft } from "lucide-react";
import { Link, Head, usePage } from '@inertiajs/react';
import { useState, MouseEvent, useMemo } from "react";
import { Product, SharedData } from '@/types';
import { useCart } from "@/hooks/use-cart";
import { toast } from 'sonner';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { auth, cart } = usePage<SharedData>().props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const isInCart = useMemo(() => cart.items.some(item => item.product.id === product.id), [cart.items, product.id]);

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    toast.promise(addToCart(product.id, quantity), {
      loading: 'Đang thêm vào giỏ hàng...',
      success: `Đã thêm ${quantity} sản phẩm vào giỏ!`,
      error: (err) => err.message || 'Đã xảy ra lỗi.',
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  const mockRating = 4.8;
  const mockReviewCount = 156;

  return (
    <>
      <Head title={`${product.name} - Rill`} />
      <div className="min-h-screen bg-background">
        <Navigation user={auth.user} />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">Trang chủ</Link>
              <span className="text-muted-foreground">/</span>
              <Link href="/products" className="text-muted-foreground hover:text-foreground">Sản phẩm</Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground">{product.name}</span>
            </div>

            <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4" />
              Quay lại danh sách sản phẩm
            </Link>

            <div className="grid md:grid-cols-5 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery */}
              <div className="md:col-span-2 lg:col-span-1 space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg border bg-muted flex items-center justify-center shadow-lg">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Disc3 className="h-24 w-24 mb-4" />
                      <p className="text-sm">Chưa có hình ảnh</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square rounded-md border bg-muted/50 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                      <Disc3 className="h-6 w-6 text-muted-foreground/50" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="md:col-span-3 lg:col-span-1 space-y-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 mb-4">
                    {product.artists?.map((artist, index) => (
                      <span key={artist.id}>
                        <span className="text-xl text-accent hover:underline cursor-pointer">{artist.name}</span>
                        {index < product.artists.length - 1 && (<span className="text-muted-foreground">, </span>)}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-5 w-5 ${i < Math.floor(mockRating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{mockRating} ({mockReviewCount} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline">{product.genre}</Badge>
                    <Badge variant="outline">{product.label}</Badge>
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-4xl font-bold text-accent">{product.price.toLocaleString('vi-VN')}₫</span>
                    {product.compare_price && (
                      <span className="text-xl text-muted-foreground line-through">{product.compare_price.toLocaleString('vi-VN')}₫</span>
                    )}
                  </div>
                  {discountPercentage && (
                    <Badge variant="destructive" className="text-sm mb-4">Giảm {discountPercentage}%</Badge>
                  )}

                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${product.in_stock ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-md font-medium">
                      {product.in_stock ? `Còn ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
                      {product.low_stock && product.in_stock && (<span className="text-amber-600 ml-2">(Sắp hết hàng!)</span>)}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <Button variant="ghost" size="lg" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>-</Button>
                      <span className="px-6 py-2 text-center font-bold text-lg">{quantity}</span>
                      <Button variant="ghost" size="lg" onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))} disabled={quantity >= product.stock_quantity}>+</Button>
                    </div>
                    <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.in_stock || isInCart}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      {isInCart ? 'Đã có trong giỏ' : (product.in_stock ? 'Thêm vào giỏ hàng' : 'Hết hàng')}
                    </Button>
                    <Button variant="outline" size="lg" onClick={handleWishlist}>
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Description and other details in Tabs */}
            <div className="mt-12">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="justify-start bg-transparent p-0 rounded-none">
                  <TabsTrigger value="description" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">Mô tả chi tiết</TabsTrigger>
                  <TabsTrigger value="reviews" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">Đánh giá</TabsTrigger>
                  <TabsTrigger value="shipping" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">Vận chuyển & Đổi trả</TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="py-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{product.detailed_description || product.description}</p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="py-6">
                  <h3 className="text-xl font-bold mb-4">Đánh giá của khách hàng</h3>
                  <p>Chưa có đánh giá nào cho sản phẩm này.</p>
                </TabsContent>
                <TabsContent value="shipping" className="py-6">
                  <h3 className="text-xl font-bold mb-4">Thông tin Vận chuyển & Đổi trả</h3>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Miễn phí vận chuyển cho đơn hàng từ 500,000₫.</li>
                    <li>Giao hàng trong 2-5 ngày làm việc.</li>
                    <li>Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</li>
                  </ul>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
