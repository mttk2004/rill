<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * User Repository Implementation
 *
 * Handles all user data access operations.
 */
class UserRepository extends BaseRepository implements UserRepositoryInterface
{
    /**
     * UserRepository constructor.
     *
     * @param User $model
     */
    public function __construct(User $model)
    {
        parent::__construct($model);
    }

    /**
     * Find a user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    /**
     * Find a user by phone.
     *
     * @param string $phone
     * @return User|null
     */
    public function findByPhone(string $phone): ?User
    {
        return $this->model->where('phone', $phone)->first();
    }

    /**
     * Get all customers.
     *
     * @return Collection
     */
    public function getCustomers(): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->get();
    }

    /**
     * Get customers with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchCustomers(array $filters): LengthAwarePaginator
    {
        $query = $this->model->where('role', 'customer');

        // Search by name, email, or phone
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('email', 'LIKE', "%{$search}%")
                    ->orWhere('phone', 'LIKE', "%{$search}%");
            });
        }

        // Filter by status
        if (isset($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Filter by verification status
        if (isset($filters['verified'])) {
            if ($filters['verified'] === 'verified') {
                $query->whereNotNull('email_verified_at');
            } elseif ($filters['verified'] === 'unverified') {
                $query->whereNull('email_verified_at');
            }
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'name-asc' => $query->orderBy('name', 'asc'),
            'name-desc' => $query->orderBy('name', 'desc'),
            'orders-desc' => $query->withCount('orders')->orderBy('orders_count', 'desc'),
            'oldest' => $query->orderBy('created_at', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        // Load relationships
        $query->withCount('orders');

        return $query->paginate($filters['per_page'] ?? 20);
    }

    /**
     * Get active customers.
     *
     * @return Collection
     */
    public function getActiveCustomers(): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->where('is_active', true)
            ->get();
    }

    /**
     * Get inactive customers.
     *
     * @return Collection
     */
    public function getInactiveCustomers(): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->where('is_active', false)
            ->get();
    }

    /**
     * Get verified customers.
     *
     * @return Collection
     */
    public function getVerifiedCustomers(): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->whereNotNull('email_verified_at')
            ->get();
    }

    /**
     * Get unverified customers.
     *
     * @return Collection
     */
    public function getUnverifiedCustomers(): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->whereNull('email_verified_at')
            ->get();
    }

    /**
     * Get new customers (registered in last 30 days).
     *
     * @param int $days
     * @return Collection
     */
    public function getNewCustomers(int $days = 30): Collection
    {
        return $this->model
            ->where('role', 'customer')
            ->where('created_at', '>=', now()->subDays($days))
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get customer statistics.
     *
     * @return array
     */
    public function getStats(): array
    {
        $stats = DB::table('users')
            ->where('role', 'customer')
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
                SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) as verified,
                SUM(CASE WHEN email_verified_at IS NULL THEN 1 ELSE 0 END) as unverified,
                SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) as new_this_month
            ', [now()->subMonth()])
            ->first();

        return [
            'total' => $stats->total,
            'active' => $stats->active,
            'inactive' => $stats->inactive,
            'verified' => $stats->verified,
            'unverified' => $stats->unverified,
            'new_this_month' => $stats->new_this_month,
        ];
    }

    /**
     * Get query builder for complex queries.
     *
     * @return \App\QueryBuilders\UserQueryBuilder
     */
    public function newQuery(): \App\QueryBuilders\UserQueryBuilder
    {
        return new \App\QueryBuilders\UserQueryBuilder();
    }
}
