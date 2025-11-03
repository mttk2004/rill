import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link, Head, usePage, useForm } from '@inertiajs/react';
import { useState, MouseEvent, useMemo, useEffect, useRef } from "react";
import { Product, SharedData } from '@/types';
import { useCart } from "@/hooks/use-cart";
import { toast } from 'react-toastify';
import AppLayout from "@/layouts/app-layout";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductInfoHeader } from "@/components/product/product-info-header";
import { ProductPriceCard } from "@/components/product/product-price-card";
import { ProductActions } from "@/components/product/product-actions";
import { ReviewOverview } from "@/components/product/review-overview";
import { ReviewForm } from "@/components/product/review-form";
import { ReviewList } from "@/components/product/review-list";

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
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
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

  const handleAddToCart = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const promise = addToCart(product.id, quantity);

    toast.promise(promise, {
      pending: 'Đang thêm vào giỏ hàng...',
      success: `Đã thêm ${quantity} sản phẩm vào giỏ! 🎉`,
      error: {
        render({ data }: { data: Error | unknown }) {
          const error = data as Error;
          return error?.message || 'Đã xảy ra lỗi khi thêm vào giỏ hàng';
        }
      }
    });
  }; const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const averageRating = product.average_rating || 0;
  const reviewCount = product.reviews_count || 0;

  return (
    <AppLayout>
      <Head title={`${product.name} - Rill`} />
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Trang chủ</Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground">Sản phẩm</Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.name}</span>
          </div>

          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Quay lại danh sách sản phẩm
          </Link>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Image Gallery - Takes 1 column */}
            <div className="lg:col-span-1">
              <ProductImageGallery product={product} />
            </div>

            {/* Product Info - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <ProductInfoHeader product={product} />

              <div className="grid md:grid-cols-2 gap-6">
                <ProductPriceCard product={product} />
                <ProductActions
                  product={product}
                  quantity={quantity}
                  isInCart={isInCart}
                  isWishlisted={isWishlisted}
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleWishlist}
                />
              </div>
            </div>
          </div>

          {/* Description and other details in Tabs */}
          <div className="mt-8" ref={tabsRef}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="justify-start bg-transparent p-0 rounded-none border-b w-full">
                <TabsTrigger
                  value="description"
                  className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Mô tả chi tiết
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Đánh giá ({reviewCount})
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="text-base font-semibold data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:shadow-none rounded-none px-4 py-2"
                >
                  Vận chuyển & Đổi trả
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="py-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p>{product.detailed_description || product.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Sidebar: Review Overview (1/3) */}
                  <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-4 space-y-4">
                      <ReviewOverview
                        averageRating={averageRating}
                        reviewCount={reviewCount}
                        reviews={product.reviews || []}
                        selectedRatingFilter={selectedRatingFilter}
                        onFilterChange={setSelectedRatingFilter}
                      />

                      {/* Review Form - Only show if user can review */}
                      {product.user_can_review && (
                        <ReviewForm
                          userReview={product.user_review}
                          rating={data.rating}
                          comment={data.comment}
                          processing={processing}
                          errors={errors}
                          formRef={reviewFormRef}
                          onRatingChange={(rating) => setData('rating', rating)}
                          onCommentChange={(comment) => setData('comment', comment)}
                          onSubmit={handleSubmitReview}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right Content: Reviews List (2/3) */}
                  <div className="lg:col-span-2">
                    <ReviewList
                      reviews={product.reviews || []}
                      selectedRatingFilter={selectedRatingFilter}
                      onClearFilter={() => setSelectedRatingFilter(null)}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="shipping" className="py-4">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-lg font-bold mb-3">Thông tin Vận chuyển & Đổi trả</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>Miễn phí vận chuyển cho đơn hàng từ 500,000₫.</li>
                    <li>Giao hàng trong 2-5 ngày làm việc.</li>
                    <li>Đổi trả miễn phí trong vòng 7 ngày nếu có lỗi từ nhà sản xuất.</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
