<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    /**
     * Cache key for all settings
     */
    private const CACHE_KEY = 'app_settings';

    /**
     * Cache duration (forever until manual clear)
     */
    private const CACHE_TTL = null;

    /**
     * Get all settings (cached)
     *
     * @return Collection
     */
    public function getAll(): Collection
    {
        return Cache::rememberForever(self::CACHE_KEY, function () {
            return Setting::all()->keyBy('key');
        });
    }

    /**
     * Get a single setting value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        $settings = $this->getAll();
        $setting = $settings->get($key);

        if (!$setting) {
            return $default;
        }

        // Cast based on type
        return $this->castValue($setting->value, $setting->type);
    }

    /**
     * Get settings by group
     *
     * @param string $group
     * @return Collection
     */
    public function getByGroup(string $group): Collection
    {
        return $this->getAll()->where('group', $group);
    }

    /**
     * Update a single setting
     *
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public function set(string $key, $value): bool
    {
        $updated = Setting::where('key', $key)->update(['value' => $value]);

        if ($updated) {
            $this->clearCache();
        }

        return $updated > 0;
    }

    /**
     * Update multiple settings at once
     *
     * @param array $data Key-value pairs
     * @return void
     */
    public function updateMany(array $data): void
    {
        foreach ($data as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }

        $this->clearCache();
    }

    /**
     * Clear settings cache
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Cast value based on type
     *
     * @param mixed $value
     * @param string $type
     * @return mixed
     */
    private function castValue($value, string $type)
    {
        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'number' => is_numeric($value) ? (int) $value : $value,
            'json' => is_string($value) ? json_decode($value, true) : $value,
            default => $value,
        };
    }
}
