import { Head, Link, useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Button from '../components/Button';
import { useShop } from '../context/ShopContext';
import { usePlayer } from '../context/PlayerContext';
import { useToast } from '../context/ToastContext';
import { Star, Truck, ShieldCheck, Play, Pause, Music, Loader2, Check } from 'lucide-react';
import { flyToCart } from '../utils/cartAnimation';
import type { Product, Artist } from '@/types';
import type { Review } from '@/types';
import AppLayout from '@/layouts/app-layout';
import AlertDialog from '../components/AlertDialog';

// Imported Sub-components
import QuantitySelector from '../components/product-detail/QuantitySelector';
import ReviewList from '../components/product-detail/ReviewList';
import RelatedProducts from '../components/product-detail/RelatedProducts';

interface ProductDetailProps {
  product: Product;
  reviews: Review[];
  relatedProducts: Product[];
  averageRating: number;
  auth?: { user?: { id: number; name: string; email: string; avatar_url?: string } };
}

function ProductDetailContent({
  product,
  reviews = [],
  relatedProducts = [],
  averageRating = 5,
  auth
}: ProductDetailProps) {
  const { addToCart } = useShop();
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { showToast } = useToast();
  const [qty, setQty] = useState(1);
  const [btnState, setBtnState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [deleteReviewId, setDeleteReviewId] = useState<number | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const reviewForm = useForm<{
    rating: number;
    comment: string;
    images?: File[];
    existing_images?: string[];
  }>({
    rating: 5,
    comment: '',
    images: [],
    existing_images: [],
  });

  const isCurrentTrack = currentTrack?.id === product.id;
  const isThisPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    playTrack(product);
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (btnState !== 'idle') return;

    // 1. Capture Rect IMMEDIATELY before state change
    const btnRect = e.currentTarget.getBoundingClientRect();

    // Calculate center based on the wide button before it morphs
    const startRect = {
      left: btnRect.left + btnRect.width / 2 - 20,
      top: btnRect.top + btnRect.height / 2 - 20,
      width: 40,
      height: 40,
      bottom: 0, right: 0, x: 0, y: 0, toJSON: () => { }
    } as DOMRect;

    // 2. Loading
    setBtnState('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      // 3. Fly animation (Safe execution)
      try {
        flyToCart(product.image || null, startRect);
      } catch (animError) {
        console.error("Animation failed", animError);
      }

      // 4. Add to cart (Guaranteed execution)
      addToCart(product, qty);

      // 5. Success State
      setBtnState('success');

      // 6. Reset
      setTimeout(() => {
        setBtnState('idle');
      }, 2000);

    } catch (error) {
      console.error("Cart error", error);
      setBtnState('idle');
    }
  };

  const increaseQty = () => {
    if (qty < product.stock_quantity) {
      setQty(qty + 1);
    }
  };

  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price));

  return (
    <>
      <Head title={`${product.name} - Rill`} />
      <div className="bg-white min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500 mb-8 animate-fade-in">
            <Link href="/" className="hover:text-primary">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-primary">Cửa hàng</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20">
            {/* Image Gallery */}
            <div className="space-y-4 animate-zoom-in">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group shadow-sm">
                <img
                  src={product.image_url || ''}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isThisPlaying ? 'animate-[spin_6s_linear_infinite]' : ''}`}
                />

                {product.preview_url && (
                  <button
                    onClick={handlePlayClick}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]"
                  >
                    <div className="h-20 w-20 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                      {isThisPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                    </div>
                  </button>
                )}

                {isThisPlaying && (
                  <div className="absolute top-4 right-4 z-20 bg-accent text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce">
                    <Music size={12} /> ĐANG PHÁT
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col animate-slide-in-right">
              <div className="mb-2">
                {product.artists && product.artists.length > 0 && (
                  <div className="text-sm font-medium text-accent tracking-wide uppercase">
                    {product.artists.map((a: Artist, idx: number) => (
                      <span key={a.id}>
                        <Link href={`/products?artist=${encodeURIComponent(a.name)}`} className="hover:underline">
                          {a.name}
                        </Link>
                        {idx < product.artists.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < Math.round(averageRating) ? "currentColor" : "none"}
                      className={i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">({reviews.length} đánh giá)</span>
              </div>

              <p className="text-3xl font-bold text-primary mb-8">{formattedPrice}</p>

              <div className="prose prose-sm text-gray-600 mb-8 leading-relaxed">
                <p>{product.detailed_description || product.description}</p>
              </div>

              <div className="border-t border-b border-gray-100 py-6 mb-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Định dạng</span>
                  <span className="font-medium text-gray-900">Vinyl, LP, Album</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Thể loại</span>
                  <Link href={`/products?genre=${encodeURIComponent(product.genre)}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                    {product.genre}
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Hãng phát hành</span>
                  <Link href={`/products?label=${encodeURIComponent(product.label)}`} className="font-medium text-gray-900 hover:text-primary transition-colors">
                    {product.label}
                  </Link>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="mb-8">
                <QuantitySelector
                  quantity={qty}
                  stock={product.stock_quantity}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  className="mb-6"
                />

                <div className="flex gap-4">
                  {/* Morphing Add To Cart Button */}
                  <div className="flex-1 min-w-[140px] h-[48px] flex justify-center">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock_quantity === 0 || btnState !== 'idle'}
                      className={`
                        h-[48px] flex items-center justify-center font-bold tracking-wide transition-all duration-300 shadow-lg
                        ${btnState === 'idle'
                          ? 'w-full rounded-lg bg-primary text-white hover:brightness-110 hover:-translate-y-0.5'
                          : 'w-[48px] rounded-full'
                        }
                        ${btnState === 'success' ? 'bg-green-600 text-white' : ''}
                        ${btnState === 'loading' ? 'bg-primary text-white' : ''}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {btnState === 'loading' && <Loader2 size={24} className="animate-spin" />}
                      {btnState === 'success' && <Check size={24} className="animate-in zoom-in duration-200" />}
                      {btnState === 'idle' && (
                        <span>{product.stock_quantity > 0 ? "Thêm vào giỏ" : "Hết hàng"}</span>
                      )}
                    </button>
                  </div>

                  {product.preview_url && (
                    <Button
                      variant="outline"
                      onClick={handlePlayClick}
                      className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 h-[48px] ${isThisPlaying ? 'border-accent text-accent bg-accent/5' : ''}`}
                    >
                      {isThisPlaying ? (
                        <>
                          <div className="flex items-center gap-1 h-4">
                            <span className="block h-2 w-0.5 bg-accent animate-[music-bar_0.6s_ease-in-out_infinite]"></span>
                            <span className="block h-3 w-0.5 bg-accent animate-[music-bar_0.6s_ease-in-out_0.2s_infinite]"></span>
                            <span className="block h-1.5 w-0.5 bg-accent animate-[music-bar_0.6s_ease-in-out_0.4s_infinite]"></span>
                          </div>
                          Đang phát
                        </>
                      ) : (
                        <>
                          <Play size={18} /> Nghe thử
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Truck size={18} />
                  <span>Miễn phí vận chuyển đơn từ 3tr</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>Cam kết chính hãng</span>
                </div>
              </div>
            </div>
          </div>

          {/* Refactored Review List */}
          <ReviewList
            reviews={reviews}
            averageRating={averageRating}
            currentUserId={auth?.user?.id}
            userCanReview={product.user_can_review}
            onEditReview={(review) => {
              setEditingReview(review);
              const existingImgs = review.images || [];
              setExistingImages(existingImgs);
              reviewForm.setData({
                rating: review.rating,
                comment: review.comment,
                images: [],
                existing_images: existingImgs,
              });
              setSelectedImages([]);
              setImagePreviews([]);
            }}
            onDeleteReview={(reviewId) => setDeleteReviewId(reviewId)}
            onWriteReview={() => {
              setEditingReview({ id: 0, rating: 5, comment: '', user_id: 0, product_id: 0, created_at: '' } as Review);
              reviewForm.reset();
              setSelectedImages([]);
              setImagePreviews([]);
              setExistingImages([]);
            }}
          />

          {/* Refactored Related Products */}
          <RelatedProducts products={relatedProducts} artists={[]} />

        </div>
      </div>

      {/* Review Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chỉnh sửa đánh giá</h3>
            <p className="text-sm text-gray-600 mb-6">{product.name}</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              reviewForm.post(`/products/${product.slug}/reviews`, {
                preserveScroll: true,
                forceFormData: true,
                onSuccess: () => {
                  showToast('Đã cập nhật đánh giá', 'success');
                  setEditingReview(null);
                  setSelectedImages([]);
                  setImagePreviews([]);
                  setExistingImages([]);
                  reviewForm.reset();
                },
                onError: (errors) => {
                  if (errors.comment) {
                    showToast(errors.comment, 'error');
                  } else {
                    showToast('Cập nhật thất bại', 'error');
                  }
                },
              });
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá của bạn</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => reviewForm.setData('rating', star)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={32}
                        className={`${star <= reviewForm.data.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nhận xét (tối thiểu 10 ký tự)</label>
                <textarea
                  value={reviewForm.data.comment}
                  onChange={(e) => reviewForm.setData('comment', e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  required
                  minLength={10}
                />
                {reviewForm.data.comment.length > 0 && reviewForm.data.comment.length < 10 && (
                  <p className="text-xs text-red-600 mt-1">
                    Nhận xét phải có ít nhất 10 ký tự (còn {10 - reviewForm.data.comment.length} ký tự)
                  </p>
                )}
                {reviewForm.errors.comment && (
                  <p className="text-xs text-red-600 mt-1">{reviewForm.errors.comment}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hình ảnh (tùy chọn, tối đa 5 ảnh, mỗi ảnh ≤ 512KB)
                </label>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Ảnh hiện tại:</p>
                    <div className="grid grid-cols-5 gap-2">
                      {existingImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={img}
                            alt={`Existing ${idx + 1}`}
                            className="w-full h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newExisting = existingImages.filter((_, i) => i !== idx);
                              setExistingImages(newExisting);
                              reviewForm.setData('existing_images', newExisting);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New image previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mb-3">
                    {imagePreviews.map((preview, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = selectedImages.filter((_, i) => i !== idx);
                            const newPreviews = imagePreviews.filter((_, i) => i !== idx);
                            setSelectedImages(newImages);
                            setImagePreviews(newPreviews);
                            reviewForm.setData('images', newImages);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(selectedImages.length + existingImages.length) < 5 && (
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const totalImages = selectedImages.length + existingImages.length + files.length;
                      if (totalImages > 5) {
                        showToast('Tổng số ảnh không được vượt quá 5', 'error');
                        return;
                      }
                      const invalidFiles = files.filter(f => f.size > 512 * 1024);
                      if (invalidFiles.length > 0) {
                        showToast('Mỗi ảnh không được vượt quá 512KB', 'error');
                        return;
                      }
                      const newImages = [...selectedImages, ...files];
                      setSelectedImages(newImages);
                      reviewForm.setData('images', newImages);
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreviews(prev => [...prev, reader.result as string]);
                        };
                        reader.readAsDataURL(file);
                      });
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    setEditingReview(null);
                    setSelectedImages([]);
                    setImagePreviews([]);
                    setExistingImages([]);
                    reviewForm.reset();
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={reviewForm.processing || reviewForm.data.comment.length < 10}
                >
                  {reviewForm.processing ? 'Đang cập nhật...' : 'Cập nhật đánh giá'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteReviewId !== null}
        onClose={() => setDeleteReviewId(null)}
        onConfirm={() => {
          if (deleteReviewId) {
            router.delete(`/reviews/${deleteReviewId}`, {
              preserveScroll: true,
              preserveState: false,
              onSuccess: () => {
                showToast('Đã xóa đánh giá', 'success');
                setDeleteReviewId(null);
              },
              onError: () => showToast('Không thể xóa đánh giá', 'error'),
            });
          }
        }}
        title="Xóa đánh giá"
        description="Bạn có chắc muốn xóa đánh giá này không? Hành động này không thể hoàn tác."
        type="danger"
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </>
  );
}

export default function ProductDetail(props: ProductDetailProps) {
  return (
    <AppLayout>
      <ProductDetailContent {...props} />
    </AppLayout>
  );
}
