<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Store a new product review.
     */
    public function store(Request $request, Product $product)
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Find a delivered order containing this product
        $orderItem = \App\Models\OrderItem::whereHas('order', function ($query) {
                $query->where('user_id', Auth::id())
                      ->where('status', 'delivered');
            })
            ->where('product_id', $product->id)
            ->first();

        if (!$orderItem) {
            return back()->with('error', 'Bạn chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng.');
        }

        // Check if user has already reviewed this product
        $existingReview = ProductReview::where('user_id', Auth::id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingReview) {
            // Update existing review
            $existingReview->update([
                'rating' => $validated['rating'],
                'comment' => $validated['comment'],
                'status' => 'pending', // Reset to pending when updated
            ]);

            return back()->with('success', 'Đánh giá của bạn đã được cập nhật.');
        }

        // Create new review with order_item_id
        ProductReview::create([
            'user_id' => Auth::id(),
            'product_id' => $product->id,
            'order_item_id' => $orderItem->id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Cảm ơn bạn đã đánh giá sản phẩm!');
    }
}
