<?php

namespace App\Repositories\Eloquent;

use App\Models\Order;
use App\Repositories\Contracts\OrderRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Order Repository Implementation
 *
 * Handles all order data access operations.
 */
class OrderRepository extends BaseRepository implements OrderRepositoryInterface
{
    /**
     * OrderRepository constructor.
     *
     * @param Order $model
     */
    public function __construct(Order $model)
    {
        parent::__construct($model);
    }

    /**
     * Find an order by order number.
     *
     * @param string $orderNumber
     * @return Order|null
     */
    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return $this->model
            ->with(['items.product', 'user', 'statusHistories'])
            ->where('order_number', $orderNumber)
            ->first();
    }

    /**
     * Get orders for a specific user.
     *
     * @param int $userId
     * @param string|null $status
     * @return Collection
     */
    public function getUserOrders(int $userId, ?string $status = null): Collection
    {
        $query = $this->model
            ->where('user_id', $userId)
            ->with(['items.product', 'statusHistories'])
            ->withCount('items');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get orders with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchOrders(array $filters): LengthAwarePaginator
    {
        $query = $this->model->query()->withTrashed();

        // Search by order number, customer name, email, or phone
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'LIKE', "%{$search}%")
                    ->orWhere('customer_name', 'LIKE', "%{$search}%")
                    ->orWhere('customer_email', 'LIKE', "%{$search}%")
                    ->orWhere('customer_phone', 'LIKE', "%{$search}%");
            });
        }

        // Filter by status
        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        // Filter by payment status
        if (!empty($filters['payment_status'])) {
            $query->where('payment_status', $filters['payment_status']);
        }

        // Filter by payment method
        if (!empty($filters['payment_method'])) {
            $query->where('payment_method', $filters['payment_method']);
        }

        // Filter by date range
        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }
        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'oldest' => $query->orderBy('created_at', 'asc'),
            'amount-desc' => $query->orderBy('total_amount', 'desc'),
            'amount-asc' => $query->orderBy('total_amount', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        // Load relationships
        $query->with(['user', 'items.product'])
            ->withCount('items');

        return $query->paginate($filters['per_page'] ?? 20);
    }

    /**
     * Get recent orders.
     *
     * @param int $limit
     * @return Collection
     */
    public function getRecentOrders(int $limit = 10): Collection
    {
        return $this->model
            ->with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get orders by status.
     *
     * @param string $status
     * @return Collection
     */
    public function getByStatus(string $status): Collection
    {
        return $this->model
            ->where('status', $status)
            ->with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get orders by payment status.
     *
     * @param string $paymentStatus
     * @return Collection
     */
    public function getByPaymentStatus(string $paymentStatus): Collection
    {
        return $this->model
            ->where('payment_status', $paymentStatus)
            ->with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get pending orders.
     *
     * @return Collection
     */
    public function getPendingOrders(): Collection
    {
        return $this->getByStatus('pending');
    }

    /**
     * Get orders that need shipping.
     *
     * @return Collection
     */
    public function getOrdersNeedingShipping(): Collection
    {
        return $this->model
            ->whereIn('status', ['confirmed', 'processing'])
            ->where('payment_status', 'paid')
            ->with(['user', 'items'])
            ->orderBy('created_at', 'asc')
            ->get();
    }

    /**
     * Update order status.
     *
     * @param int $orderId
     * @param string $status
     * @return bool
     */
    public function updateStatus(int $orderId, string $status): bool
    {
        return $this->model
            ->where('id', $orderId)
            ->update(['status' => $status]);
    }

    /**
     * Update payment status.
     *
     * @param int $orderId
     * @param string $paymentStatus
     * @return bool
     */
    public function updatePaymentStatus(int $orderId, string $paymentStatus): bool
    {
        return $this->model
            ->where('id', $orderId)
            ->update(['payment_status' => $paymentStatus]);
    }

    /**
     * Get order statistics.
     *
     * @param \Carbon\Carbon|null $startDate
     * @param \Carbon\Carbon|null $endDate
     * @return array
     */
    public function getStats(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = DB::table('orders')->whereNull('deleted_at');

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        $stats = $query->selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = "confirmed" THEN 1 ELSE 0 END) as confirmed,
            SUM(CASE WHEN status = "processing" THEN 1 ELSE 0 END) as processing,
            SUM(CASE WHEN status = "shipping" THEN 1 ELSE 0 END) as shipping,
            SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered,
            SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelled,
            SUM(CASE WHEN payment_status = "paid" THEN 1 ELSE 0 END) as paid,
            SUM(CASE WHEN payment_status = "pending" THEN 1 ELSE 0 END) as payment_pending,
            SUM(CASE WHEN payment_status = "failed" THEN 1 ELSE 0 END) as payment_failed,
            COALESCE(SUM(CASE WHEN status != "cancelled" THEN total_amount ELSE 0 END), 0) as total_revenue
        ')->first();

        return [
            'total' => $stats->total,
            'pending' => $stats->pending,
            'confirmed' => $stats->confirmed,
            'processing' => $stats->processing,
            'shipping' => $stats->shipping,
            'delivered' => $stats->delivered,
            'cancelled' => $stats->cancelled,
            'paid' => $stats->paid,
            'payment_pending' => $stats->payment_pending,
            'payment_failed' => $stats->payment_failed,
            'total_revenue' => $stats->total_revenue,
        ];
    }

    /**
     * Get total revenue.
     *
     * @param \Carbon\Carbon|null $startDate
     * @param \Carbon\Carbon|null $endDate
     * @return float
     */
    public function getTotalRevenue(?Carbon $startDate = null, ?Carbon $endDate = null): float
    {
        $query = $this->model
            ->whereNotIn('status', ['cancelled'])
            ->whereNull('deleted_at');

        if ($startDate) {
            $query->where('created_at', '>=', $startDate);
        }
        if ($endDate) {
            $query->where('created_at', '<=', $endDate);
        }

        return (float) $query->sum('total_amount');
    }
}
