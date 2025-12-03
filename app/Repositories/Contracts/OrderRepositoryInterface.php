<?php

namespace App\Repositories\Contracts;

use App\Models\Order;
use App\QueryBuilders\OrderQueryBuilder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Order Repository Interface
 *
 * Defines the contract for order data access operations.
 */
interface OrderRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find an order by order number.
     *
     * @param string $orderNumber
     * @return Order|null
     */
    public function findByOrderNumber(string $orderNumber): ?Order;

    /**
     * Get orders for a specific user.
     *
     * @param int $userId
     * @param string|null $status
     * @return Collection
     */
    public function getUserOrders(int $userId, ?string $status = null): Collection;

    /**
     * Get orders with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchOrders(array $filters): LengthAwarePaginator;

    /**
     * Get recent orders.
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecentOrders(int $limit = 10): Collection;

    /**
     * Get orders by status.
     *
     * @param string $status
     * @return Collection
     */
    public function getByStatus(string $status): Collection;

    /**
     * Get orders by payment status.
     *
     * @param string $paymentStatus
     * @return Collection
     */
    public function getByPaymentStatus(string $paymentStatus): Collection;

    /**
     * Get pending orders.
     *
     * @return Collection
     */
    public function getPendingOrders(): Collection;

    /**
     * Get orders that need shipping.
     *
     * @return Collection
     */
    public function getOrdersNeedingShipping(): Collection;

    /**
     * Update order status.
     *
     * @param int $orderId
     * @param string $status
     * @return bool
     */
    public function updateStatus(int $orderId, string $status): bool;

    /**
     * Update payment status.
     *
     * @param int $orderId
     * @param string $paymentStatus
     * @return bool
     */
    public function updatePaymentStatus(int $orderId, string $paymentStatus): bool;

    /**
     * Get order statistics.
     *
     * @param \Carbon\Carbon|null $startDate
     * @param \Carbon\Carbon|null $endDate
     * @return array
     */
    public function getStats(?\Carbon\Carbon $startDate = null, ?\Carbon\Carbon $endDate = null): array;

    /**
     * Get total revenue.
     *
     * @param \Carbon\Carbon|null $startDate
     * @param \Carbon\Carbon|null $endDate
     * @return float
     */
    public function getTotalRevenue(?\Carbon\Carbon $startDate = null, ?\Carbon\Carbon $endDate = null): float;

    /**
     * Get query builder for complex queries.
     *
     * @return OrderQueryBuilder
     */
    public function newQuery(): OrderQueryBuilder;
}
