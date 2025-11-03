import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { RefObject } from "react";

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
}

interface ReviewFormProps {
  userReview: ProductReview | null | undefined;
  rating: number;
  comment: string;
  processing: boolean;
  errors: { comment?: string };
  formRef: RefObject<HTMLTextAreaElement | null>;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewForm({
  userReview,
  rating,
  comment,
  processing,
  errors,
  formRef,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: ReviewFormProps) {
  const getRatingLabel = (rating: number) => {
    const labels = {
      5: 'Tuyệt vời',
      4: 'Hài lòng',
      3: 'Bình thường',
      2: 'Không hài lòng',
      1: 'Tệ',
    };
    return labels[rating as keyof typeof labels] || '';
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4 text-amber-900 dark:text-amber-100 flex items-center gap-2">
        <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
        {userReview ? 'Cập nhật đánh giá của bạn' : 'Viết đánh giá'}
      </h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Chất lượng sản phẩm</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(star)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-7 w-7 ${star <= rating
                    ? 'fill-amber-500 text-amber-500'
                    : 'text-gray-300 dark:text-gray-600'
                    }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-medium">
              {getRatingLabel(rating)}
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Nhận xét của bạn <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="comment"
            ref={formRef}
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Hãy chia sẻ những điều bạn thích về sản phẩm này với người mua khác nhé (tối thiểu 50 ký tự)"
            className="min-h-[100px] resize-none"
            required
            minLength={50}
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <div>
              {errors.comment && (
                <p className="text-red-500 text-xs">{errors.comment}</p>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {comment.length}/1000 {comment.length < 50 && `(còn ${50 - comment.length})`}
            </p>
          </div>
        </div>
        <Button
          type="submit"
          disabled={processing || comment.length < 50}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
        >
          {processing ? 'Đang gửi...' : userReview ? 'Cập nhật đánh giá' : 'Gửi đánh giá'}
        </Button>
      </form>
    </div>
  );
}
