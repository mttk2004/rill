<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use App\QueryBuilders\UserQueryBuilder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * User Repository Interface
 *
 * Defines the contract for user data access operations.
 */
interface UserRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Find a user by email.
     *
     * @param string $email
     * @return User|null
     */
    public function findByEmail(string $email): ?User;

    /**
     * Find a user by phone.
     *
     * @param string $phone
     * @return User|null
     */
    public function findByPhone(string $phone): ?User;

    /**
     * Get all customers.
     *
     * @return Collection
     */
    public function getCustomers(): Collection;

    /**
     * Get customers with filters and pagination.
     *
     * @param array $filters
     * @return LengthAwarePaginator
     */
    public function searchCustomers(array $filters): LengthAwarePaginator;

    /**
     * Get active customers.
     *
     * @return Collection
     */
    public function getActiveCustomers(): Collection;

    /**
     * Get inactive customers.
     *
     * @return Collection
     */
    public function getInactiveCustomers(): Collection;

    /**
     * Get verified customers.
     *
     * @return Collection
     */
    public function getVerifiedCustomers(): Collection;

    /**
     * Get unverified customers.
     *
     * @return Collection
     */
    public function getUnverifiedCustomers(): Collection;

    /**
     * Get new customers (registered in last 30 days).
     *
     * @param int $days
     * @return Collection
     */
    public function getNewCustomers(int $days = 30): Collection;

    /**
     * Get customer statistics.
     *
     * @return array
     */
    public function getStats(): array;

    /**
     * Get query builder for complex queries.
     *
     * @return UserQueryBuilder
     */
    public function newQuery(): UserQueryBuilder;
}
