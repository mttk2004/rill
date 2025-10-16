<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->order_number,
            'date' => $this->placed_at,
            'status' => $this->status,
            'total' => (float) $this->total_amount,
            'delivered_date' => $this->when($this->status === 'delivered', $this->updated_at),
            'payment_method' => $this->whenLoaded('payment', fn() => $this->payment->payment_method, 'N/A'),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'shipping_address' => $this->shipping_address ? [
                'name' => $this->shipping_address['full_name'],
                'phone' => $this->shipping_address['phone'],
                'address' => "{$this->shipping_address['address_line_1']}, {$this->shipping_address['ward']}, {$this->shipping_address['district']}, {$this->shipping_address['city']}",
                'notes' => $this->notes,
            ] : null,
            'timeline' => [
                // This is a simplified timeline. A real app would use order_status_histories
                ['status' => 'pending', 'date' => $this->placed_at, 'description' => 'Đơn hàng đã được đặt'],
                $this->when($this->status !== 'pending', [
                    'status' => 'confirmed', 'date' => $this->created_at->addMinutes(10), 'description' => 'Đơn hàng đã được xác nhận'
                ]),
                $this->when(in_array($this->status, ['shipped', 'delivered']), [
                    'status' => 'shipped', 'date' => $this->updated_at->subHours(2), 'description' => 'Đơn hàng đã được giao cho đơn vị vận chuyển'
                ]),
                 $this->when($this->status === 'delivered', [
                    'status' => 'delivered', 'date' => $this->updated_at, 'description' => 'Đơn hàng đã được giao thành công'
                ]),
                  $this->when($this->status === 'cancelled', [
                    'status' => 'cancelled', 'date' => $this->updated_at, 'description' => 'Đơn hàng đã bị hủy'
                ]),
            ],
        ];
    }
}
