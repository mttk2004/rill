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
        $result = $this->reviewService->createOrUpdateReview(
            Auth::user(),
            $product,
            $validated
        );

        if ($result->isError()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
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

        $result = $this->reviewService->deleteReview($review);

        if ($result->isError()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }
}
