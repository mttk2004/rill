import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Heart, ShoppingCart, Star, Disc3, ArrowLeft } from "lucide-react";
import { Link, Head, usePage, useForm } from '@inertiajs/react';
import { useState, MouseEvent, useMemo, useEffect, useRef } from "react";
import { Product, SharedData } from '@/types';
import { useCart } from "@/hooks/use-cart";
import { toast } from 'sonner';
import AppLayout from "@/layouts/app-layout";

interface ProductReview {
  id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductDetailProps {
  product: Product & {
    reviews?: ProductReview[];
    average_rating?: number;
    reviews_count?: number;
    user_can_review?: boolean;
    user_review?: ProductReview | null;
  };
  openReviewTab?: boolean;
}

export default function ProductDetail({ product, openReviewTab = false }: ProductDetailProps) {
  const { cart } = usePage<SharedData>().props;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState(openReviewTab ? "reviews" : "description");
  const reviewFormRef = useRef<HTMLTextAreaElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const isInCart = useMemo(() => cart.items.some(item => item.product.id === product.id), [cart.items, product.id]);

  const { data, setData, post, processing, errors, reset } = useForm({
    rating: product.user_review?.rating || 5,
    comment: product.user_review?.comment || '',
  });

  useEffect(() => {
    if (openReviewTab) {
      setActiveTab("reviews");
      // Scroll to tabs and focus on review form
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          reviewFormRef.current?.focus();
        }, 500);
      }, 100);
    }
  }, [openReviewTab]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/products/${product.slug}/reviews`, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Đánh giá của bạn đã được gửi!');
        if (!product.user_review) {
          reset();
        }
      },
      onError: () => {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
      },
    });
  };

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

  const averageRating = product.average_rating || 0;
  const reviewCount = product.reviews_count || 0;

  return (
    <AppLayout>
      <Head title={`${product.name} - Rill`} />
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
                      <Star key={i} className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{averageRating.toFixed(1)} ({reviewCount} đánh giá)</span>
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
          <div className="mt-12" ref={tabsRef}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="justify-start bg-transparent p-0 rounded-none">
                <TabsTrigger value="description" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">Mô tả chi tiết</TabsTrigger>
                <TabsTrigger value="reviews" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">
                  Đánh giá ({reviewCount})
                </TabsTrigger>
                <TabsTrigger value="shipping" className="text-lg font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none">Vận chuyển & Đổi trả</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-6">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{product.detailed_description || product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-6 space-y-8">
                {/* Review Form - Only show if user can review */}
                {product.user_can_review && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-2xl font-bold mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
                      <Star className="h-6 w-6 fill-amber-500 text-amber-500" />
                      {product.user_review ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}
                    </h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-amber-900 dark:text-amber-100">Đánh giá của bạn</label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setData('rating', star)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-8 w-8 ${star <= data.rating ? 'fill-amber-500 text-amber-500' : 'text-amber-300 dark:text-amber-700'}`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-sm font-medium text-amber-900 dark:text-amber-100">
                            {data.rating}/5 sao
                          </span>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="comment" className="block text-sm font-semibold mb-2 text-amber-900 dark:text-amber-100">
                          Nhận xét của bạn <span className="text-red-500">*</span>
                        </label>
                        <Textarea
                          id="comment"
                          ref={reviewFormRef}
                          value={data.comment}
                          onChange={(e) => setData('comment', e.target.value)}
                          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này (tối thiểu 50 ký tự)..."
                          className="min-h-[120px] resize-none border-amber-200 dark:border-amber-800 focus:border-amber-500 focus:ring-amber-500"
                          required
                          minLength={50}
                          maxLength={1000}
                        />
                        <div className="flex justify-between items-center mt-1">
                          <div>
                            {errors.comment && (
                              <p className="text-red-500 text-sm">{errors.comment}</p>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {data.comment.length}/1000 ký tự {data.comment.length < 50 && `(còn ${50 - data.comment.length} ký tự)`}
                          </p>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={processing}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
                      >
                        {processing ? 'Đang gửi...' : (product.user_review ? 'Cập nhật đánh giá' : 'Gửi đánh giá')}
                      </Button>
                    </form>
                  </div>
                )}

                {/* Reviews Summary */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Đánh giá của khách hàng</h3>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < Math.floor(averageRating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <span className="text-2xl font-bold text-amber-600">{averageRating.toFixed(1)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{reviewCount} đánh giá</p>
                    </div>
                  </div>

                  {/* Reviews List */}
                  {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {product.reviews.map((review) => (
                        <div key={review.id} className="border-b pb-6 last:border-b-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-semibold text-lg">{review.user.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">Chưa có đánh giá nào cho sản phẩm này.</p>
                  )}
                </div>
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
    </AppLayout>
  );
}
