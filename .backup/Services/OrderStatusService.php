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
     *
     * Creates context-aware messages for order status changes, with different
     * messaging for admin vs customer actions. Supports direct status assignment
     * or status-to-status transitions.
     *
     * @param string|null $oldStatus Previous order status value (pending, confirmed, etc.)
     * @param string $newStatus New order status value
     * @return string Human-readable status change message in Vietnamese
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
     *
     * Records order status changes in history table for audit trail and timeline display.
     * If notes not provided, generates automatic notes based on status.
     *
     * @param Order $order The order to create history for
     * @param string $status The status value to record
     * @param string|null $notes Optional custom notes. Auto-generated if null
     * @return OrderStatusHistory The created history record
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
     *
     * Main method for changing order status. Handles Enum conversion, sets custom notes
     * if provided, updates the order, and triggers observers to create history record.
     *
     * @param Order $order The order to update
     * @param string $newStatus The new status value
     * @param string|null $notes Optional custom notes for this status change
     * @return Order Fresh order instance with updated status
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
