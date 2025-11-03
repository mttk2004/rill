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

interface ReviewOverviewProps {
  averageRating: number;
  reviewCount: number;
  reviews: ProductReview[];
  selectedRatingFilter: number | null;
  onFilterChange: (rating: number | null) => void;
}

export function ReviewOverview({
  averageRating,
  reviewCount,
  reviews,
  selectedRatingFilter,
  onFilterChange,
}: ReviewOverviewProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Overall Rating */}
        <div className="text-center border-r border-amber-200 dark:border-amber-800 pr-6">
          <div className="text-5xl font-bold text-amber-600 mb-2">
            {averageRating.toFixed(1)}
            <span className="text-2xl text-muted-foreground">/5</span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${i < Math.floor(averageRating)
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-gray-300'
                  }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{reviewCount}</span> đánh giá
          </p>
        </div>

        {/* Right: Rating Distribution */}
        <div className="col-span-2 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = reviews.filter((r) => r.rating === rating).length;
            const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
            const isActive = selectedRatingFilter === rating;

            return (
              <button
                key={rating}
                onClick={() => onFilterChange(isActive ? null : rating)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                    ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-500'
                    : 'hover:bg-amber-50 dark:hover:bg-amber-950/10'
                  }`}
              >
                <div className="flex items-center gap-1 min-w-[80px]">
                  <span className="text-sm font-medium">{rating}</span>
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                </div>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground min-w-[40px] text-right">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
