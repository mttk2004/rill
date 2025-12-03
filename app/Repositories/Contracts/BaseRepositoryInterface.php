<?php

namespace App\Repositories\Contracts;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Base Repository Interface
 *
 * Defines the contract for all repository implementations.
 * Provides standard CRUD operations and common query methods.
 */
interface BaseRepositoryInterface
{
    /**
     * Find a model by its primary key.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model;

    /**
     * Find a model by its primary key or throw an exception.
     *
     * @param int $id
     * @return Model
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id): Model;

    /**
     * Get all models.
     *
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection;

    /**
     * Paginate models.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator;

    /**
     * Create a new model.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model;

    /**
     * Update a model.
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete a model.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool;

    /**
     * Find models by a specific column value.
     *
     * @param string $column
     * @param mixed $value
     * @return Collection
     */
    public function findBy(string $column, mixed $value): Collection;

    /**
     * Find first model by a specific column value.
     *
     * @param string $column
     * @param mixed $value
     * @return Model|null
     */
    public function findOneBy(string $column, mixed $value): ?Model;

    /**
     * Count all models.
     *
     * @return int
     */
    public function count(): int;
}
