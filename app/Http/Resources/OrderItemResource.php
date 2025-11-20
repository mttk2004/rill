<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->product_name,
            'artist_name' => $this->whenLoaded('product', fn() => $this->product->artists->first()->name ?? 'N/A', 'N/A'),
            'price' => (float) $this->total_price, // Ensure it's a number for frontend
            'unit_price' => (float) $this->unit_price,
            'image_url' => $this->whenLoaded('product', fn() => $this->product->image_url, null),
            'quantity' => (int) $this->quantity,
            'sku' => $this->product_sku,
            'slug' => $this->whenLoaded('product', fn() => $this->product->slug, null),
            'user_review' => $this->whenLoaded('product', function() use ($request) {
                $review = $this->product->reviews()
                    ->where('user_id', $request->user()?->id)
                    ->first();

                return $review ? [
                    'id' => $review->id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,
                    'images' => $review->images, // Accessor will convert to full URLs
                ] : null;
            }, null),
        ];
    }
}
