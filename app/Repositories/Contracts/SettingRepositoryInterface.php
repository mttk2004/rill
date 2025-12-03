<?php

namespace App\Repositories\Contracts;

use Illuminate\Support\Collection;

/**
 * Setting Repository Interface
 */
interface SettingRepositoryInterface
{
    /**
     * Get all settings
     */
    public function getAll(): Collection;

    /**
     * Find setting by key
     */
    public function findByKey(string $key): ?object;

    /**
     * Get settings by group
     */
    public function getByGroup(string $group): Collection;

    /**
     * Update setting value by key
     */
    public function updateByKey(string $key, mixed $value): bool;

    /**
     * Update multiple settings
     */
    public function updateMany(array $data): void;

    /**
     * Create or update a setting
     */
    public function upsert(string $key, mixed $value, string $type = 'text', ?string $group = null): object;
}
