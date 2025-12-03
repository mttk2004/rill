<?php

namespace App\QueryBuilders;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

/**
 * Order Query Builder
 *
 * Encapsulates complex order queries with joins and aggregations.
 */
class OrderQueryBuilder
{
    protected Builder $query;

    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    /**
     * Search by order number, customer info.
     *
     * @param string|null $search
     * @return self
     */
    public function search(?string $search): self
    {
        if (empty($search)) {
            return $this;
        }

        $this->query->where(function ($q) use ($search) {
            $q->where('order_number', 'LIKE', "%{$search}%")
                ->orWhereHas('user', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'LIKE', "%{$search}%")
                        ->orWhere('email', 'LIKE', "%{$search}%")
                        ->orWhere('phone', 'LIKE', "%{$search}%");
                })
                ->orWhereJsonContains('shipping_address->name', $search)
                ->orWhereJsonContains('shipping_address->phone', $search);
        });

        return $this;
    }

    /**
     * Filter by order status.
     *
     * @param string|null $status
     * @return self
     */
    public function status(?string $status): self
    {
        if ($status) {
            $this->query->where('status', $status);
        }

        return $this;
    }

    /**
     * Filter by payment status.
     *
     * @param string|null $paymentStatus
     * @return self
     */
    public function paymentStatus(?string $paymentStatus): self
    {
        if ($paymentStatus) {
            $this->query->whereHas('payment', function ($q) use ($paymentStatus) {
                $q->where('payment_status', $paymentStatus);
            });
        }

        return $this;
    }

    /**
     * Filter by payment method.
     *
     * @param string|null $paymentMethod
     * @return self
     */
    public function paymentMethod(?string $paymentMethod): self
    {
        if ($paymentMethod) {
            $this->query->whereHas('payment', function ($q) use ($paymentMethod) {
                $q->where('payment_method', $paymentMethod);
            });
        }

        return $this;
    }

    /**
     * Filter by user ID.
     *
     * @param int|null $userId
     * @return self
     */
    public function forUser(?int $userId): self
    {
        if ($userId) {
            $this->query->where('user_id', $userId);
        }

        return $this;
    }

    /**
     * Filter by date range.
     *
     * @param Carbon|null $from
     * @param Carbon|null $to
     * @return self
     */
    public function dateRange(?Carbon $from, ?Carbon $to): self
    {
        if ($from) {
            $this->query->where('created_at', '>=', $from);
        }

        if ($to) {
            $this->query->where('created_at', '<=', $to);
        }

        return $this;
    }

    /**
     * Filter orders from today.
     *
     * @return self
     */
    public function today(): self
    {
        return $this->dateRange(Carbon::today(), Carbon::today()->endOfDay());
    }

    /**
     * Filter orders from this week.
     *
     * @return self
     */
    public function thisWeek(): self
    {
        return $this->dateRange(Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek());
    }

    /**
     * Filter orders from this month.
     *
     * @return self
     */
    public function thisMonth(): self
    {
        return $this->dateRange(Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth());
    }

    /**
     * Filter pending orders.
     *
     * @return self
     */
    public function pending(): self
    {
        return $this->status('pending');
    }

    /**
     * Filter confirmed orders.
     *
     * @return self
     */
    public function confirmed(): self
    {
        return $this->status('confirmed');
    }

    /**
     * Filter shipped orders.
     *
     * @return self
     */
    public function shipped(): self
    {
        return $this->status('shipped');
    }

    /**
     * Filter delivered orders.
     *
     * @return self
     */
    public function delivered(): self
    {
        return $this->status('delivered');
    }

    /**
     * Filter cancelled orders.
     *
     * @return self
     */
    public function cancelled(): self
    {
        return $this->status('cancelled');
    }

    /**
     * Exclude cancelled orders.
     *
     * @return self
     */
    public function excludeCancelled(): self
    {
        $this->query->where('status', '!=', 'cancelled');

        return $this;
    }

    /**
     * Filter orders needing shipping.
     *
     * @return self
     */
    public function needsShipping(): self
    {
        $this->query->whereIn('status', ['confirmed']);

        return $this;
    }

    /**
     * With total amount greater than.
     *
     * @param float $amount
     * @return self
     */
    public function minAmount(float $amount): self
    {
        $this->query->where('total_amount', '>=', $amount);

        return $this;
    }

    /**
     * With total amount less than.
     *
     * @param float $amount
     * @return self
     */
    public function maxAmount(float $amount): self
    {
        $this->query->where('total_amount', '<=', $amount);

        return $this;
    }

    /**
     * Sort by newest first.
     *
     * @return self
     */
    public function newest(): self
    {
        $this->query->orderBy('created_at', 'desc');

        return $this;
    }

    /**
     * Sort by oldest first.
     *
     * @return self
     */
    public function oldest(): self
    {
        $this->query->orderBy('created_at', 'asc');

        return $this;
    }

    /**
     * Sort by total amount.
     *
     * @param string $direction
     * @return self
     */
    public function sortByAmount(string $direction = 'desc'): self
    {
        $this->query->orderBy('total_amount', $direction);

        return $this;
    }

    /**
     * With relationships.
     *
     * @param array|string $relations
     * @return self
     */
    public function withRelations(array|string $relations): self
    {
        $this->query->with($relations);

        return $this;
    }

    /**
     * Include soft deleted orders.
     *
     * @return self
     */
    public function withTrashed(): self
    {
        $this->query->withTrashed();

        return $this;
    }

    /**
     * Get the underlying query builder.
     *
     * @return Builder
     */
    public function getQuery(): Builder
    {
        return $this->query;
    }

    /**
     * Execute and get results.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function get()
    {
        return $this->query->get();
    }

    /**
     * Execute and paginate results.
     *
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function paginate(int $perPage = 15)
    {
        return $this->query->paginate($perPage);
    }

    /**
     * Get first result.
     *
     * @return \App\Models\Order|null
     */
    public function first()
    {
        return $this->query->first();
    }

    /**
     * Count results.
     *
     * @return int
     */
    public function count(): int
    {
        return $this->query->count();
    }

    /**
     * Sum total amounts.
     *
     * @return float
     */
    public function sumTotalAmount(): float
    {
        return (float) $this->query->sum('total_amount');
    }

    /**
     * Calculate average order value.
     *
     * @return float
     */
    public function averageOrderValue(): float
    {
        return (float) $this->query->avg('total_amount');
    }
}
