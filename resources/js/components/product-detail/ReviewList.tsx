
import React, { useState } from 'react';
import { User, Edit2, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import Button from '../Button';
import { formatRelativeTime } from '../../utils/date';
import ImageLightbox from '../ImageLightbox';
import StarRating from '../StarRating';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  currentUserId?: number;
  userCanReview?: boolean;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: number) => void;
  onWriteReview?: () => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUserId, userCanReview, onEditReview, onDeleteReview, onWriteReview }) => {
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleImageClick = (images: string[], index: number) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const userHasReviewed = currentUserId ? reviews.some(r => r.user?.id === currentUserId) : false;
  const canWriteReview = userCanReview && !userHasReviewed;

  return (
    <div className="border-t border-gray-100 pt-16 mb-20 animate-fade-in-up">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-serif font-bold text-gray-900">Đánh giá khách hàng</h2>
        {reviews.length > 0 && (
          <div className="relative group">
            <Button
              variant={canWriteReview ? "outline" : "outline"}
              onClick={canWriteReview ? onWriteReview : undefined}
              disabled={!canWriteReview}
              className={!canWriteReview ? "cursor-not-allowed opacity-50" : ""}
            >
              {userHasReviewed ? "Bạn đã đánh giá" : "Viết đánh giá"}
            </Button>
            {!userCanReview && !userHasReviewed && (
              <div className="absolute right-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                <p>Bạn cần mua và nhận sản phẩm này trước khi có thể đánh giá</p>
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-50 rounded-xl p-6 border border-gray-100/50 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                    {review.user?.avatar_url ? (
                      <img src={review.user.avatar_url} alt={review.user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={20} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{review.user?.name || 'Ẩn danh'}</h4>
                    <div className="mt-0.5">
                      <StarRating rating={review.rating} size={12} showRating={false} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(review.updated_at || review.created_at)}
                  </span>
                  {review.updated_at && review.updated_at !== review.created_at && (
                    <span className="text-[10px] text-gray-400 italic">(đã chỉnh sửa)</span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.comment}
              </p>
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleImageClick(review.images!, idx)}
                      className="w-full h-20 rounded-lg border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <img
                        src={img}
                        alt={`Review image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
              {currentUserId && review.user?.id === currentUserId && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  {onEditReview && (
                    <button
                      onClick={() => onEditReview(review)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Edit2 size={14} /> Chỉnh sửa
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteReview?.(review.id)}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 size={14} /> Xóa
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
          <p className="text-gray-500 mb-4">Chưa có đánh giá nào cho sản phẩm này.</p>
          {userCanReview ? (
            <Button variant="outline" onClick={onWriteReview}>Viết đánh giá đầu tiên</Button>
          ) : currentUserId ? (
            <p className="text-sm text-gray-400">Mua và nhận sản phẩm để có thể đánh giá</p>
          ) : (
            <p className="text-sm text-gray-400">Đăng nhập và mua sản phẩm để đánh giá</p>
          )}
        </div>
      )}

      {/* Image Lightbox */}
      <ImageLightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
};

export default ReviewList;
