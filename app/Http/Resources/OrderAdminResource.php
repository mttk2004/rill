<?php

namespace App\Http\Resources;

use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderAdminResource extends JsonResource
{
    /**
     * Transform the resource into an array for admin panel.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'subtotal' => $this->subtotal,
            'shipping_fee' => $this->shipping_fee,
            'discount_amount' => $this->discount_amount,
            'total_amount' => $this->total_amount,
            'placed_at' => $this->placed_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,

            // Customer information
            'customer' => $this->when($this->relationLoaded('user'), function () {
                return $this->user ? [
                    'id' => $this->user->id,
                    'name' => $this->user->name,
                    'email' => $this->user->email,
                    'phone' => $this->user->phone ?? null,
                ] : null;
            }),

            // Shipping address (JSON column)
            'shipping_address' => $this->when(!empty($this->shipping_address), function () {
                $address = $this->shipping_address;
                return [
                    'id' => $address['id'] ?? 0,
                    'full_name' => $address['full_name'] ?? '',
                    'phone' => $address['phone'] ?? '',
                    'address_line_1' => $address['address_line_1'] ?? '',
                    'address_line_2' => $address['address_line_2'] ?? null,
                    'ward' => $address['ward'] ?? '',
                    'district' => $address['district'] ?? '',
                    'province' => $address['province'] ?? '',
                ];
            }),

            // Payment information
            'payment' => $this->when($this->relationLoaded('payment'), function () {
                return $this->payment ? [
                    'id' => $this->payment->id,
                    'payment_method' => $this->payment->payment_method,
                    'payment_status' => $this->payment->payment_status,
                    'amount' => $this->payment->amount,
                    'transaction_id' => $this->payment->transaction_id,
                    'processed_at' => $this->payment->processed_at,
                ] : null;
            }),

            // Payment status for quick access
            'payment_status' => $this->when($this->relationLoaded('payment'), function () {
                return $this->payment
                    ? $this->payment->payment_status->value
                    : PaymentStatus::PENDING->value;
            }),

            // Order items
            'order_items' => $this->when($this->relationLoaded('items'), function () {
                return $this->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'product_sku' => $item->product_sku,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'product' => $this->when($item->relationLoaded('product'), function () use ($item) {
                            return $item->product ? [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'slug' => $item->product->slug,
                                'sku' => $item->product->sku,
                                'image_url' => $item->product->image_url,
                                'artists' => $this->when($item->product->relationLoaded('artists'), function () use ($item) {
                                    return $item->product->artists->map(function ($artist) {
                                        return [
                                            'id' => $artist->id,
                                            'name' => $artist->name,
                                            'slug' => $artist->slug,
                                        ];
                                    });
                                }),
                            ] : null;
                        }),
                    ];
                });
            }),

            // Items count
            'items_count' => $this->when(isset($this->items_count), $this->items_count),
            'order_items_count' => $this->when(isset($this->items_count), $this->items_count),

            // Status histories
            'status_histories' => $this->when($this->relationLoaded('statusHistories'), function () {
                return $this->statusHistories->map(function ($history) {
                    return [
                        'id' => $history->id,
                        'status' => $history->status,
                        'notes' => $history->notes,
                        'created_at' => $history->created_at,
                        'created_by' => $this->when($history->relationLoaded('createdBy'), function () use ($history) {
                            return $history->createdBy ? [
                                'id' => $history->createdBy->id,
                                'name' => $history->createdBy->name,
                            ] : null;
                        }),
                    ];
                });
            }),
        ];
    }
}
