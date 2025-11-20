import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Camera, X } from "lucide-react";
import { RefObject, useState, useRef } from "react";
import imageCompression from 'browser-image-compression';

interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  images?: string[];
}

interface ReviewFormProps {
  userReview: ProductReview | null | undefined;
  rating: number;
  comment: string;
  images: File[];
  processing: boolean;
  errors: { comment?: string; images?: string };
  formRef: RefObject<HTMLTextAreaElement | null>;
  onRatingChange: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onImagesChange: (images: File[]) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReviewForm({
  userReview,
  rating,
  comment,
  images,
  processing,
  errors,
  formRef,
  onRatingChange,
  onCommentChange,
  onImagesChange,
  onSubmit,
}: ReviewFormProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...images];
    const newPreviews = [...previews];

    for (let i = 0; i < files.length; i++) {
      if (newImages.length >= 5) {
        alert('Bạn chỉ có thể tải lên tối đa 5 ảnh');
        break;
      }

      const file = files[i];

      try {
        // Compress image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
        });

        newImages.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
        // If compression fails, use original file
        newImages.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }
    }

    onImagesChange(newImages);
    setPreviews(newPreviews);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    // Revoke object URL to free memory
    URL.revokeObjectURL(previews[index]);

    onImagesChange(newImages);
    setPreviews(newPreviews);
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

        <div>
          <label className="block text-sm font-medium mb-2">
            Hình ảnh sản phẩm (tùy chọn)
          </label>
          <div className="flex flex-wrap gap-2">
            {/* Upload button */}
            {images.length < 5 && (
              <label className="cursor-pointer border-2 border-dashed border-amber-300 dark:border-amber-700 rounded-lg p-4 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors flex flex-col items-center justify-center w-20 h-20">
                <Camera className="w-6 h-6 text-amber-600 dark:text-amber-400 mb-1" />
                <span className="text-xs text-amber-600 dark:text-amber-400">Thêm ảnh</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={processing}
                />
              </label>
            )}

            {/* Image previews */}
            {previews.map((src, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-amber-200 dark:border-amber-800">
                <img
                  src={src}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                  disabled={processing}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Tối đa 5 ảnh, mỗi ảnh không quá 2MB (JPEG, PNG, WebP)
          </p>
          {errors.images && (
            <p className="text-red-500 text-xs mt-1">{errors.images}</p>
          )}
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
