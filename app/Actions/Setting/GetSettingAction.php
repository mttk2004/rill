<?php

namespace App\Actions\Setting;

use App\DataObjects\Setting\SettingData;
use App\Repositories\Contracts\SettingRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\Cache;

/**
 * Action to get a setting value with caching
 */
class GetSettingAction
{
    private const CACHE_KEY = 'app_settings';

    public function __construct(
        private SettingRepositoryInterface $settingRepository,
    ) {}

    /**
     * Get setting by key with caching
     */
    public function execute(string $key, mixed $default = null): ServiceResult
    {
        try {
            // Get from cache or database
            $settings = Cache::rememberForever(self::CACHE_KEY, function () {
                return $this->settingRepository->getAll();
            });

            $setting = $settings->get($key);

            if (!$setting) {
                return ServiceResult::success([
                    'value' => $default,
                    'exists' => false,
                ], 'Setting not found, using default value');
            }

            $settingData = SettingData::fromModel($setting);

            return ServiceResult::success([
                'value' => $settingData->getCastedValue(),
                'exists' => true,
                'type' => $settingData->type,
                'group' => $settingData->group,
            ]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error retrieving setting: ' . $e->getMessage(),
                ['key' => $key],
            );
        }
    }

    /**
     * Get settings by group
     */
    public function executeByGroup(string $group): ServiceResult
    {
        try {
            $settings = $this->settingRepository->getByGroup($group);

            $data = $settings->map(function ($setting) {
                $settingData = SettingData::fromModel($setting);
                return [
                    'key' => $settingData->key,
                    'value' => $settingData->getCastedValue(),
                    'type' => $settingData->type,
                    'label' => $settingData->label,
                ];
            })->toArray();

            return ServiceResult::success(['settings' => $data]);

        } catch (\Exception $e) {
            return ServiceResult::error(
                'Error retrieving settings by group: ' . $e->getMessage(),
                ['group' => $group],
            );
        }
    }
}
