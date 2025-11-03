import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface ProductReview {
  id: string;
  user: {
    name: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}

interface ReviewListProps {
  reviews: ProductReview[];
  selectedRatingFilter: number | null;
  onClearFilter: () => void;
}

export function ReviewList({ reviews, selectedRatingFilter, onClearFilter }: ReviewListProps) {
  const filteredReviews = selectedRatingFilter
    ? reviews.filter((review) => review.rating === selectedRatingFilter)
    : reviews;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
          <Star className="h-8 w-8 text-gray-400" />
        </div>
        <h4 className="font-medium mb-1">Chưa có đánh giá</h4>
        <p className="text-sm text-muted-foreground">
          Hãy là người đầu tiên đánh giá sản phẩm này!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">
          Tất cả đánh giá
          {selectedRatingFilter && ` (${selectedRatingFilter} sao)`}
        </h3>
        {selectedRatingFilter && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilter}
            className="text-amber-600 hover:text-amber-700"
          >
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-sm">{review.user.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {review.created_at}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < review.rating
                            ? 'fill-amber-500 text-amber-500'
                            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                          }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <Star className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-muted-foreground">
            Chưa có đánh giá {selectedRatingFilter} sao
          </p>
        </div>
      )}
    </div>
  );
}
