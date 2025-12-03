<?php

namespace App\QueryBuilders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

/**
 * User Query Builder
 *
 * Fluent query builder for User model with convenient filtering methods.
 */
class UserQueryBuilder
{
    protected Builder $query;

    public function __construct()
    {
        $this->query = User::query();
    }

    /**
     * Get the underlying Eloquent builder.
     *
     * @return Builder
     */
    public function getQuery(): Builder
    {
        return $this->query;
    }

    /**
     * Search users by name, email, or phone.
     *
     * @param string $search
     * @return self
     */
    public function search(string $search): self
    {
        $this->query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('phone', 'like', "%{$search}%");
        });

        return $this;
    }

    /**
     * Filter by verified users.
     *
     * @param bool $verified
     * @return self
     */
    public function verified(bool $verified = true): self
    {
        if ($verified) {
            $this->query->whereNotNull('email_verified_at');
        } else {
            $this->query->whereNull('email_verified_at');
        }

        return $this;
    }

    /**
     * Filter by users registered after a specific date.
     *
     * @param Carbon $date
     * @return self
     */
    public function registeredAfter(Carbon $date): self
    {
        $this->query->where('created_at', '>=', $date);

        return $this;
    }

    /**
     * Filter by users registered before a specific date.
     *
     * @param Carbon $date
     * @return self
     */
    public function registeredBefore(Carbon $date): self
    {
        $this->query->where('created_at', '<=', $date);

        return $this;
    }

    /**
     * Filter by date range.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @return self
     */
    public function dateRange(Carbon $from, Carbon $to): self
    {
        $this->query->whereBetween('created_at', [$from, $to]);

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
     * Sort by name.
     *
     * @param string $direction
     * @return self
     */
    public function sortByName(string $direction = 'asc'): self
    {
        $this->query->orderBy('name', $direction);

        return $this;
    }

    /**
     * Load relationships eagerly.
     *
     * @param array $relations
     * @return self
     */
    public function withRelations(array $relations): self
    {
        $this->query->with($relations);

        return $this;
    }

    /**
     * Execute query and get results.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function get()
    {
        return $this->query->get();
    }

    /**
     * Get paginated results.
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
     * @return User|null
     */
    public function first(): ?User
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
}
