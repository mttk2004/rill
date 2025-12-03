<?php

namespace App\Observers;

use App\Models\Setting;
use App\Services\SettingService;

class SettingObserver
{
    public function __construct(
        private SettingService $settingService
    ) {}

    /**
     * Handle the Setting "created" event.
     */
    public function created(Setting $setting): void
    {
        $this->settingService->clearCache();
    }

    /**
     * Handle the Setting "updated" event.
     */
    public function updated(Setting $setting): void
    {
        $this->settingService->clearCache();
    }

    /**
     * Handle the Setting "deleted" event.
     */
    public function deleted(Setting $setting): void
    {
        $this->settingService->clearCache();
    }

    /**
     * Handle the Setting "restored" event.
     */
    public function restored(Setting $setting): void
    {
        $this->settingService->clearCache();
    }
}
