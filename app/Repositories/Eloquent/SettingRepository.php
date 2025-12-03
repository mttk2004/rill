<?php

namespace App\Repositories\Eloquent;

use App\Models\Setting;
use App\Repositories\Contracts\SettingRepositoryInterface;
use Illuminate\Support\Collection;

/**
 * Setting Repository Implementation
 */
class SettingRepository extends BaseRepository implements SettingRepositoryInterface
{
    public function __construct(Setting $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all settings
     */
    public function getAll(): Collection
    {
        return $this->model->all()->keyBy('key');
    }

    /**
     * Find setting by key
     */
    public function findByKey(string $key): ?object
    {
        return $this->model->where('key', $key)->first();
    }

    /**
     * Get settings by group
     */
    public function getByGroup(string $group): Collection
    {
        return $this->model->where('group', $group)->get()->keyBy('key');
    }

    /**
     * Update setting value by key
     */
    public function updateByKey(string $key, mixed $value): bool
    {
        return $this->model->where('key', $key)->update(['value' => $value]) > 0;
    }

    /**
     * Update multiple settings
     */
    public function updateMany(array $data): void
    {
        foreach ($data as $key => $value) {
            $this->updateByKey($key, $value);
        }
    }

    /**
     * Create or update a setting
     */
    public function upsert(string $key, mixed $value, string $type = 'text', ?string $group = null): object
    {
        return $this->model->updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'type' => $type,
                'group' => $group,
            ],
        );
    }
}
