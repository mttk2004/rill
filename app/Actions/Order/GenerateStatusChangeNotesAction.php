<?php

namespace App\Actions\Order;

use App\Enums\OrderStatus;
use Illuminate\Support\Facades\Auth;

/**
 * Generate automatic notes for order status changes
 */
class GenerateStatusChangeNotesAction
{
    public function execute(?string $oldStatus, string $newStatus): string
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

        // Direct status messages
        $statusMessages = [
            'pending' => 'Đơn hàng đang chờ xác nhận',
            'confirmed' => 'Đơn hàng đã được xác nhận',
            'shipped' => 'Đơn hàng đang được vận chuyển',
            'delivered' => 'Đơn hàng đã được giao thành công',
            'cancelled' => $isAdmin
                ? 'Đơn hàng đã bị hủy bởi quản trị viên'
                : 'Đơn hàng đã bị hủy',
        ];

        // Try transition message first
        $transitionKey = $oldStatus ? "{$oldStatus}->{$newStatus}" : null;
        if ($transitionKey && isset($transitions[$transitionKey])) {
            return $transitions[$transitionKey];
        }

        // Fallback to direct status message
        return $statusMessages[$newStatus] ?? "Trạng thái đơn hàng đã được cập nhật thành {$newStatus}";
    }
}
