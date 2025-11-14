<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use Illuminate\Support\Facades\Auth;

class OrderStatusService
{
    /**
     * Generate automatic notes based on status transition.
     */
    public function generateStatusChangeNotes(?string $oldStatus, string $newStatus): string
    {
        $isAdmin = Auth::check() && Auth::user()->isAdmin();

        // Status transition messages
        $transitions = [
            'pending->confirmed' => $isAdmin
                ? 'Đã xác nhận đơn hàng, đang chuẩn bị hàng'
                : 'Đơn hàng đã được xác nhận',
            'pending->cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy bởi quản trị viên'
                : 'Khách hàng yêu cầu hủy đơn hàng',
            'confirmed->shipped' => 'Đơn hàng đã được đóng gói và giao cho đơn vị vận chuyển',
            'confirmed->cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy sau khi xác nhận'
                : 'Khách hàng yêu cầu hủy đơn hàng',
            'shipped->delivered' => 'Đơn hàng đã được giao thành công, khách hàng đã nhận hàng',
        ];

        // Direct status messages (no oldStatus or no matching transition)
        $statusMessages = [
            'pending' => 'Đơn hàng đang chờ xác nhận',
            'confirmed' => 'Đơn hàng đã được xác nhận',
            'shipped' => 'Đơn hàng đang được vận chuyển',
            'delivered' => 'Đơn hàng đã được giao thành công',
            'cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy bởi quản trị viên'
                : 'Đơn hàng đã bị hủy',
        ];

        // Try to find transition message first
        $transitionKey = $oldStatus ? "{$oldStatus}->{$newStatus}" : null;
        if ($transitionKey && isset($transitions[$transitionKey])) {
            return $transitions[$transitionKey];
        }

        // Fallback to direct status message
        return $statusMessages[$newStatus] ?? "Trạng thái đơn hàng đã được cập nhật thành {$newStatus}";
    }

    /**
     * Create status history record for an order.
     */
    public function createStatusHistory(Order $order, string $status, ?string $notes = null): OrderStatusHistory
    {
        return OrderStatusHistory::create([
            'order_id' => $order->id,
            'status' => $status,
            'notes' => $notes ?? $this->generateStatusChangeNotes(null, $status),
            'created_by' => Auth::id(),
        ]);
    }

    /**
     * Update order status and create history record.
     */
    public function updateOrderStatus(Order $order, string $newStatus, ?string $notes = null): Order
    {
        $oldStatusEnum = $order->status;
        $oldStatus = $oldStatusEnum instanceof OrderStatus ? $oldStatusEnum->value : $oldStatusEnum;

        // Set custom notes if provided (will be used by observer)
        if ($notes) {
            $order->status_change_notes = $notes;
        }

        $order->update(['status' => $newStatus]);

        return $order->fresh();
    }
}
