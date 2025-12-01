
import React from 'react';
import { User, Star, Edit2, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import Button from '../Button';
import { formatRelativeTime } from '../../utils/date';

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  currentUserId?: number;
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentUserId, onEditReview, onDeleteReview }) => {

  return (
    <div className="border-t border-gray-100 pt-16 mb-20 animate-fade-in-up">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-8">Đánh giá khách hàng</h2>

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
                    <div className="flex text-yellow-400 text-xs mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? "currentColor" : "none"}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{formatRelativeTime(review.created_at)}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {review.comment}
              </p>
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {review.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Review image ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-lg border border-gray-200"
                    />
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
          <Button variant="outline">Viết đánh giá đầu tiên</Button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
