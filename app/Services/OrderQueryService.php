<?php

namespace App\Services;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;

/**
 * Order Query Service
 *
 * Handles all order query operations: filtering, stats, searches
 * Separated from lifecycle and payment operations
 */
class OrderQueryService
{
    public function __construct(
        protected OrderRepositoryInterface $orderRepository,
    ) {}

    /**
     * Get user's orders with optional filters.
     *
     * @param int $userId
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getUserOrders(int $userId, array $filters = [])
    {
        $query = $this->orderRepository->newQuery()
            ->forUser($userId)
            ->withRelations(['items.product', 'payment']);

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        return $query->newest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Get order by ID with relationships.
     *
     * @param int $orderId
     * @return Order|null
     */
    public function getOrderById(int $orderId): ?Order
    {
        return $this->orderRepository->newQuery()
            ->withRelations(['items.product', 'payment', 'user', 'statusHistories'])
            ->getQuery()
            ->find($orderId);
    }

    /**
     * Get admin orders with filters.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getAdminOrders(array $filters)
    {
        $query = $this->orderRepository->newQuery();

        // Apply filters
        if (!empty($filters['search'])) {
            $query->search($filters['search']);
        }

        if (!empty($filters['status'])) {
            $query->status($filters['status']);
        }

        if (!empty($filters['payment_method'])) {
            $query->paymentMethod($filters['payment_method']);
        }

        if (!empty($filters['date_from'])) {
            $query->getQuery()->where('placed_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->getQuery()->where('placed_at', '<=', $filters['date_to']);
        }

        $perPage = $filters['per_page'] ?? 15;

        // Apply sorting
        $sortBy = $filters['sort_by'] ?? 'placed_at';
        $sortDirection = $filters['sort_direction'] ?? 'desc';

        switch ($sortBy) {
            case 'total_amount':
                $query->getQuery()->orderBy('total_amount', $sortDirection);
                break;
            case 'status':
                $query->getQuery()->orderBy('status', $sortDirection);
                break;
            case 'placed_at':
            default:
                $query->getQuery()->orderBy('placed_at', $sortDirection);
                break;
        }

        // Eager load relationships
        return $query->getQuery()
            ->with(['user', 'payment'])
            ->withCount('items')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Get order statistics for admin dashboard.
     *
     * @return array
     */
    public function getOrderStats(): array
    {
        return \App\Models\Order::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as confirmed,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as shipped,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as delivered,
                SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) as cancelled
            ', [
                \App\Enums\OrderStatus::PENDING->value,
                \App\Enums\OrderStatus::CONFIRMED->value,
                \App\Enums\OrderStatus::SHIPPED->value,
                \App\Enums\OrderStatus::DELIVERED->value,
                \App\Enums\OrderStatus::CANCELLED->value,
            ])
            ->first()
            ->toArray();
    }
}
