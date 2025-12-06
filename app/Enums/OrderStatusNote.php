<?php

namespace App\Enums;

enum OrderStatusNote: string
{
    case PENDING = 'Đơn hàng đã được tạo, chờ xác nhận';
    case CONFIRMED = 'Đơn hàng đã được xác nhận, đang chuẩn bị hàng';
    case SHIPPED = 'Đơn hàng đang trên đường giao đến khách hàng';
    case DELIVERED = 'Đơn hàng đã được giao thành công';
    case CANCELLED = 'Đơn hàng đã bị hủy';

    /**
     * Get note for a specific status
     */
    public static function forStatus(OrderStatus $status): string
    {
        return match ($status) {
            OrderStatus::PENDING => self::PENDING->value,
            OrderStatus::CONFIRMED => self::CONFIRMED->value,
            OrderStatus::SHIPPED => self::SHIPPED->value,
            OrderStatus::DELIVERED => self::DELIVERED->value,
            OrderStatus::CANCELLED => self::CANCELLED->value,
        };
    }
}
