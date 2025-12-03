<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Contracts\BaseRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Base Repository Implementation
 *
 * Abstract class providing common repository functionality.
 * All concrete repositories should extend this class.
 */
abstract class BaseRepository implements BaseRepositoryInterface
{
    /**
     * The model instance.
     *
     * @var Model
     */
    protected Model $model;

    /**
     * BaseRepository constructor.
     *
     * @param Model $model
     */
    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    /**
     * Find a model by its primary key.
     *
     * @param int $id
     * @return Model|null
     */
    public function find(int $id): ?Model
    {
        return $this->model->find($id);
    }

    /**
     * Find a model by its primary key or throw an exception.
     *
     * @param int $id
     * @return Model
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findOrFail(int $id): Model
    {
        return $this->model->findOrFail($id);
    }

    /**
     * Get all models.
     *
     * @param array $columns
     * @return Collection
     */
    public function all(array $columns = ['*']): Collection
    {
        return $this->model->all($columns);
    }

    /**
     * Paginate models.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }

    /**
     * Create a new model.
     *
     * @param array $data
     * @return Model
     */
    public function create(array $data): Model
    {
        return $this->model->create($data);
    }

    /**
     * Update a model.
     *
     * @param int $id
     * @param array $data
     * @return bool
     */
    public function update(int $id, array $data): bool
    {
        $model = $this->findOrFail($id);
        return $model->update($data);
    }

    /**
     * Delete a model.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $model = $this->findOrFail($id);
        return $model->delete();
    }

    /**
     * Find models by a specific column value.
     *
     * @param string $column
     * @param mixed $value
     * @return Collection
     */
    public function findBy(string $column, mixed $value): Collection
    {
        return $this->model->where($column, $value)->get();
    }

    /**
     * Find first model by a specific column value.
     *
     * @param string $column
     * @param mixed $value
     * @return Model|null
     */
    public function findOneBy(string $column, mixed $value): ?Model
    {
        return $this->model->where($column, $value)->first();
    }

    /**
     * Count all models.
     *
     * @return int
     */
    public function count(): int
    {
        return $this->model->count();
    }

    /**
     * Get a new query builder instance.
     *
     * @return \Illuminate\Database\Eloquent\Builder
     */
    protected function query()
    {
        return $this->model->newQuery();
    }

    /**
     * Get the model instance.
     *
     * @return Model
     */
    protected function getModel(): Model
    {
        return $this->model;
    }
}
