<?php

namespace App\Actions\Setting;

use App\DataObjects\Setting\SettingData;
use App\Repositories\Contracts\SettingRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Cache;

/**
 * Action to update setting value
 */
class UpdateSettingAction
{
    private const CACHE_KEY = 'app_settings';

    public function __construct(
        private SettingRepositoryInterface $settingRepository,
    ) {}

    /**
     * Update a single setting
     */
    public function execute(string $key, mixed $value): ServiceResult
    {
        try {
            $updated = $this->settingRepository->updateByKey($key, $value);

            if ($updated) {
                Cache::forget(self::CACHE_KEY);

                return ServiceResult::success([
                    'key' => $key,
                    'value' => $value,
                ], 'Setting updated successfully');
            }

            return ServiceResult::error(
                'Setting not found or update failed',
                ['key' => $key],
            );

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error updating setting: ' . $e->getMessage(),
                ['key' => $key],
            );
        }
    }

    /**
     * Update multiple settings at once
     */
    public function executeMany(array $data): ServiceResult
    {
        try {
            $this->settingRepository->updateMany($data);
            Cache::forget(self::CACHE_KEY);

            return ServiceResult::success([
                'updated_count' => count($data),
                'keys' => array_keys($data),
            ], 'Settings updated successfully');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error updating settings: ' . $e->getMessage(),
            );
        }
    }

    /**
     * Create or update a setting (upsert)
     */
    public function executeUpsert(SettingData $data): ServiceResult
    {
        // Validate setting data
        $validationErrors = $data->validate();
        if (!empty($validationErrors)) {
            return ServiceResult::error(
                'Invalid setting data',
                ['validation_errors' => $validationErrors],
            );
        }

        try {
            $setting = $this->settingRepository->upsert(
                key: $data->key,
                value: $data->value,
                type: $data->type,
                group: $data->group,
            );

            Cache::forget(self::CACHE_KEY);

            return ServiceResult::success([
                'setting' => SettingData::fromModel($setting),
            ], 'Setting saved successfully');

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error saving setting: ' . $e->getMessage(),
                ['key' => $data->key],
            );
        }
    }
}
