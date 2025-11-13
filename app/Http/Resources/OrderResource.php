<?php

namespace App\Http\Resources;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
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
            'id' => $this->order_number, // Frontend expects order_number as id
            'order_id' => $this->id, // Actual database ID
            'order_number' => $this->order_number,
            'date' => $this->placed_at,
            'status' => $this->status->value,
            'subtotal' => (float) $this->subtotal,
            'discount_amount' => (float) $this->discount_amount,
            'total' => (float) $this->total_amount,
            'currency' => $this->currency ?? 'VND',
            'delivered_date' => $this->when($this->status === OrderStatus::DELIVERED, $this->updated_at),
            'payment_method' => $this->whenLoaded('payment', function() {
                $method = $this->payment?->payment_method;
                if (!$method) return 'N/A';
                return match($method) {
                    PaymentMethod::COD => 'Thanh toán khi nhận hàng',
                    PaymentMethod::VNPAY => 'VNPAY',
                    default => $method->value,
                };
            }, 'N/A'),
            'payment_status' => $this->whenLoaded('payment', function() {
                return $this->payment?->payment_status?->value ?? null;
            }),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'shipping_address' => $this->shipping_address ? [
                'name' => $this->shipping_address['full_name'] ?? 'N/A',
                'phone' => $this->shipping_address['phone'] ?? 'N/A',
                'address' => implode(', ', array_filter([
                    $this->shipping_address['address_line_1'] ?? '',
                    $this->shipping_address['ward'] ?? '',
                    $this->shipping_address['district'] ?? '',
                    $this->shipping_address['city'] ?? ''
                ])),
                'notes' => $this->notes,
            ] : null,
            'timeline' => [
                // This is a simplified timeline. A real app would use order_status_histories
                ['status' => OrderStatus::PENDING->value, 'date' => $this->placed_at, 'description' => 'Đơn hàng đã được đặt'],
                $this->when($this->status !== OrderStatus::PENDING, [
                    'status' => OrderStatus::CONFIRMED->value, 'date' => $this->updated_at, 'description' => 'Đơn hàng đã được xác nhận'
                ]),
                $this->when(in_array($this->status, [OrderStatus::SHIPPED, OrderStatus::DELIVERED]), [
                    'status' => OrderStatus::SHIPPED->value, 'date' => $this->updated_at, 'description' => 'Đơn hàng đã được giao cho đơn vị vận chuyển'
                ]),
                 $this->when($this->status === OrderStatus::DELIVERED, [
                    'status' => OrderStatus::DELIVERED->value, 'date' => $this->updated_at, 'description' => 'Đơn hàng đã được giao thành công'
                ]),
                  $this->when($this->status === OrderStatus::CANCELLED, [
                    'status' => OrderStatus::CANCELLED->value, 'date' => $this->updated_at, 'description' => 'Đơn hàng đã bị hủy'
                ]),
            ],
        ];
    }
}
