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
            'artist_name' => $this->product->artists->first()->name ?? 'N/A', // Simplified for MVP
            'price' => $this->total_price,
            'image_url' => $this->whenLoaded('product', $this->product->image),
            'quantity' => $this->quantity,
            'sku' => $this->product_sku,
        ];
    }
}
