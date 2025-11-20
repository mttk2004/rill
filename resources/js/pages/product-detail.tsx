import { ArrowLeft } from "lucide-react";
import { Link, Head, usePage, useForm } from '@inertiajs/react';
import { useState, MouseEvent, useMemo, useEffect, useRef } from "react";
import { Product, SharedData } from '@/types';
import { useToastRouter } from '@/hooks/use-toast-router';
import AppLayout from "@/layouts/app-layout";
import { ProductImageGallery } from "@/components/product/product-image-gallery";
import { ProductInfoHeader } from "@/components/product/product-info-header";
import { ProductPriceCard } from "@/components/product/product-price-card";
import { ProductActions } from "@/components/product/product-actions";
import { ReviewOverview } from "@/components/product/review-overview";
import { ReviewForm } from "@/components/product/review-form";
import { ReviewList } from "@/components/product/review-list";
import { RelatedProducts } from "@/components/product/related-products";

interface ProductDetailSettings {
  shipping: {
    free_threshold: number;
    estimate_min_days: number;
    estimate_max_days: number;
  };
  policy: {
    return_days: number;
    return_condition: string;
  };
}

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
  relatedProducts?: Product[];
  openReviewTab?: boolean;
}

export default function ProductDetail({ product, relatedProducts = [], openReviewTab = false }: ProductDetailProps) {
  const { cart, settings } = usePage<SharedData & { settings: ProductDetailSettings }>().props;
  const { post: routerPost } = useToastRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);
  const reviewFormRef = useRef<HTMLTextAreaElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const isInCart = useMemo(() => cart.items.some(item => item.product.id === product.id), [cart.items, product.id]);

  const isProductInCart = (productId: string) => {
    return cart.items.some(item => item.product.id === productId);
  };

  const handleAddToCartRelated = (e: MouseEvent<HTMLButtonElement>, productId: string) => {
    e.preventDefault();

    routerPost('/cart/add', { product_id: productId, quantity: 1 }, {
      pending: 'Đang thêm vào giỏ hàng...',
      success: 'Đã thêm sản phẩm vào giỏ! 🎉',
      error: 'Đã xảy ra lỗi khi thêm vào giỏ hàng',
    }, { preserveScroll: true });
  };

  const { data, setData, post, processing, errors, reset } = useForm({
    rating: product.user_review?.rating || 5,
    comment: product.user_review?.comment || '',
    images: [] as File[],
  });

  useEffect(() => {
    if (openReviewTab) {
      // Scroll to reviews section and focus on review form
      setTimeout(() => {
        reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        if (!product.user_review) {
          reset();
        }
      },
    });
  };

  const handleAddToCart = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    routerPost('/cart/add', { product_id: product.id, quantity }, {
      pending: 'Đang thêm vào giỏ hàng...',
      success: `Đã thêm ${quantity} sản phẩm vào giỏ! 🎉`,
      error: 'Đã xảy ra lỗi khi thêm vào giỏ hàng',
    }, { preserveScroll: true });
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
                  onQuantityChange={setQuantity}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </div>

          {/* Shipping Info - Compact Card */}
          <div className="mt-8">
            <div className="bg-muted/30 rounded-lg border p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 3h5v5"></path>
                  <path d="M8 3H3v5"></path>
                  <path d="M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3"></path>
                  <path d="m15 9 6-6"></path>
                  <path d="M21 15v5h-5"></path>
                  <path d="M3 21h5v-5"></path>
                </svg>
                Vận chuyển & Đổi trả
              </h3>
              <div className="grid sm:grid-cols-3 gap-3 text-xs text-muted-foreground">
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span>Miễn phí vận chuyển cho đơn hàng từ {settings.shipping.free_threshold.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                  <span>Giao hàng trong {settings.shipping.estimate_min_days}-{settings.shipping.estimate_max_days} ngày làm việc</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                  <span>Đổi trả miễn phí trong {settings.policy.return_days} ngày nếu {settings.policy.return_condition}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-8" ref={reviewsRef}>
            <h2 className="text-xl font-bold mb-6">Đánh giá sản phẩm ({reviewCount})</h2>
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
                      images={data.images}
                      processing={processing}
                      errors={errors}
                      formRef={reviewFormRef}
                      onRatingChange={(rating) => setData('rating', rating)}
                      onCommentChange={(comment) => setData('comment', comment)}
                      onImagesChange={(images) => setData('images', images)}
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
          </div>

          {/* Related Products Section */}
          <RelatedProducts
            products={relatedProducts}
            onAddToCart={handleAddToCartRelated}
            isInCart={isProductInCart}
          />
        </div>
      </main>
    </AppLayout>
  );
}
