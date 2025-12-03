<?php

namespace App\DataObjects\Order;

use App\DataObjects\BaseData;
use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Carbon\Carbon;

/**
 * Order Filter Data Transfer Object
 *
 * Encapsulates filter parameters for order queries.
 */
readonly class OrderFilterData extends BaseData
{
    public function __construct(
        public ?string $search = null,
        public ?OrderStatus $status = null,
        public ?PaymentStatus $paymentStatus = null,
        public ?PaymentMethod $paymentMethod = null,
        public ?Carbon $dateFrom = null,
        public ?Carbon $dateTo = null,
        public ?int $userId = null,
        public string $sortBy = 'created_at',
        public string $sortDirection = 'desc',
        public int $perPage = 15,
    ) {}

    /**
     * Check if any filter is applied.
     *
     * @return bool
     */
    public function hasFilters(): bool
    {
        return $this->search !== null
            || $this->status !== null
            || $this->paymentStatus !== null
            || $this->paymentMethod !== null
            || $this->dateFrom !== null
            || $this->dateTo !== null
            || $this->userId !== null;
    }

    /**
     * Get active filters count.
     *
     * @return int
     */
    public function getActiveFiltersCount(): int
    {
        $count = 0;

        if ($this->search) $count++;
        if ($this->status) $count++;
        if ($this->paymentStatus) $count++;
        if ($this->paymentMethod) $count++;
        if ($this->dateFrom || $this->dateTo) $count++;
        if ($this->userId) $count++;

        return $count;
    }

    /**
     * Create from request query parameters.
     *
     * @param array $params
     * @return static
     */
    public static function fromQueryParams(array $params): static
    {
        return new static(
            search: $params['search'] ?? null,
            status: isset($params['status']) ? OrderStatus::from($params['status']) : null,
            paymentStatus: isset($params['payment_status']) ? PaymentStatus::from($params['payment_status']) : null,
            paymentMethod: isset($params['payment_method']) ? PaymentMethod::from($params['payment_method']) : null,
            dateFrom: isset($params['date_from']) ? Carbon::parse($params['date_from']) : null,
            dateTo: isset($params['date_to']) ? Carbon::parse($params['date_to']) : null,
            userId: $params['user_id'] ?? null,
            sortBy: $params['sort_by'] ?? 'created_at',
            sortDirection: $params['sort_direction'] ?? 'desc',
            perPage: $params['per_page'] ?? 15,
        );
    }
}
