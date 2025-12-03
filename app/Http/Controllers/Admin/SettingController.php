<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Services\SettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function __construct(
        private SettingService $settingService
    ) {}

    /**
     * Display settings management page
     */
    public function index(): Response
    {
        $settings = $this->settingService->getAll();

        return Inertia::render('admin/Settings', [
            'settings' => $settings->groupBy('group')->map(function ($group) {
                return $group->keyBy('key')->map(function ($setting) {
                    return [
                        'key' => $setting->key,
                        'value' => $setting->value,
                        'type' => $setting->type,
                        'label' => $setting->label,
                    ];
                });
            }),
        ]);
    }

    /**
     * Update settings
     */
    public function update(UpdateSettingsRequest $request)
    {
        $validated = $request->validated();

        // Update settings - this automatically clears cache via Observer
        $this->settingService->updateMany($validated['settings']);

        return back()->with('success', 'Cài đặt đã được cập nhật thành công!');
    }
}
