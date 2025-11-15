<?php

namespace App\Http\Resources;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Get human-readable description for order status.
     */
    private function getStatusDescription(string $status): string
    {
        return match($status) {
            'pending' => 'Đơn hàng đã được đặt',
            'confirmed' => 'Đơn hàng đã được xác nhận',
            'shipped' => 'Đơn hàng đã được giao cho đơn vị vận chuyển',
            'delivered' => 'Đơn hàng đã được giao thành công',
            'cancelled' => 'Đơn hàng đã bị hủy',
            default => 'Cập nhật trạng thái',
        };
    }

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
                    $this->shipping_address['province'] ?? ''
                ])),
                'notes' => $this->notes,
            ] : null,
            'timeline' => $this->whenLoaded('statusHistories', function() {
                return $this->statusHistories->map(function($history) {
                    return [
                        'status' => $history->status,
                        'date' => $history->created_at,
                        'description' => $this->getStatusDescription($history->status),
                        'notes' => $history->notes,
                        'created_by' => $history->createdBy?->name,
                    ];
                })->toArray();
            }, []),
        ];
    }
}
