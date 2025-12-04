<?php

namespace App\Services;

use App\Actions\Setting\GetSettingAction;
use App\Actions\Setting\UpdateSettingAction;
use App\DataObjects\Setting\SettingData;
use App\Repositories\Contracts\SettingRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

/**
 * Refactored settings service with Clean Architecture
 */
class SettingService
{
    private GetSettingAction $getAction;
    private UpdateSettingAction $updateAction;

    public function __construct(
        private SettingRepositoryInterface $settingRepository,
    ) {
        $this->getAction = new GetSettingAction($this->settingRepository);
        $this->updateAction = new UpdateSettingAction($this->settingRepository);
    }

    /**
     * Get a single setting value
     */
    public function get(string $key, mixed $default = null): mixed
    {
        $result = $this->getAction->execute($key, $default);

        if ($result->isSuccess() && is_array($result->data) && array_key_exists('value', $result->data)) {
            return $result->data['value'];
        }

        return $default;
    }

    /**
     * Get a single setting value as ServiceResult
     */
    public function getSetting(string $key, mixed $default = null): ServiceResult
    {
        return $this->getAction->execute($key, $default);
    }

    /**
     * Get settings by group
     */
    public function getByGroup(string $group): ServiceResult
    {
        return $this->getAction->executeByGroup($group);
    }

    /**
     * Get all settings (raw from repository)
     */
    public function getAll(): Collection
    {
        return Cache::rememberForever('app_settings', function () {
            return $this->settingRepository->getAll();
        });
    }

    /**
     * Update a single setting
     */
    public function set(string $key, mixed $value): ServiceResult
    {
        return $this->updateAction->execute($key, $value);
    }

    /**
     * Update multiple settings at once
     */
    public function updateMany(array $data): ServiceResult
    {
        return $this->updateAction->executeMany($data);
    }

    /**
     * Create or update a setting (upsert)
     */
    public function upsert(SettingData $data): ServiceResult
    {
        return $this->updateAction->executeUpsert($data);
    }

    /**
     * Clear settings cache
     */
    public function clearCache(): void
    {
        Cache::forget('app_settings');
    }
}
