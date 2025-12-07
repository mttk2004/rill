<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductReviewRequest;
use App\Models\Product;
use App\Services\ContentValidationService;
use App\Services\ReviewService;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Constructor with dependency injection.
     *
     * @param ReviewService $reviewService
     * @param ContentValidationService $contentValidator
     */
    public function __construct(
        protected ReviewService $reviewService,
        protected ContentValidationService $contentValidator
    ) {}

    /**
     * Store a new product review.
     */
    public function store(StoreProductReviewRequest $request, Product $product)
    {
        // Form Request automatically handles validation and authorization
        $validated = $request->validated();

        // Validate content for spam/inappropriate words
        if (!$this->contentValidator->isClean($validated['comment'])) {
            return back()->withErrors([
                'comment' => 'Nhận xét chứa nội dung không phù hợp. Vui lòng kiểm tra lại.'
            ]);
        }

        // Delegate to service
        // Check if it's an update (user already has a review)
        $existingReview = $this->reviewService->getUserReview(Auth::id(), $product->id);

        \Log::info('[REVIEW CONTROLLER] Processing review submission', [
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'has_existing_review' => $existingReview !== null,
            'existing_review_id' => $existingReview?->id,
            'validated_data' => $validated,
        ]);

        if ($existingReview) {
            $result = $this->reviewService->updateReview(
                $existingReview->id,
                Auth::id(),
                $product->id,
                $validated
            );
            $successMessage = 'Đánh giá của bạn đã được cập nhật.';
        } else {
            $result = $this->reviewService->createReview(
                Auth::id(),
                $product->id,
                $validated
            );
            $successMessage = 'Đánh giá của bạn đã được gửi.';
        }

        if (!$result->isSuccess()) {
            return back()->withErrors(['review' => $result->message])->with('error', $result->message);
        }

        return back()->with('success', $successMessage);
    }

    /**
     * Delete a product review.
     */
    public function destroy(\App\Models\ProductReview $review)
    {
        // Check if the authenticated user owns this review
        if ($review->user_id !== Auth::id()) {
            return back()->with('error', 'Bạn không có quyền xóa đánh giá này.');
        }

        $result = $this->reviewService->deleteReview($review->id, Auth::id());

        if (!$result->isSuccess()) {
            return back()->with('error', $result->message);
        }

        return back();
    }
}
