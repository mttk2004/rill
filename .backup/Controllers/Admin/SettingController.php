<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.banner_enabled' => 'required|in:0,1',
            'settings.banner_content' => 'required|string|max:500',
            'settings.banner_type' => 'required|in:info,success,warning',
            'settings.shipping_free_threshold' => 'required|numeric|min:0',
            'settings.shipping_estimate_min_days' => 'required|integer|min:1',
            'settings.shipping_estimate_max_days' => 'required|integer|min:1|gte:settings.shipping_estimate_min_days',
            'settings.return_policy_days' => 'required|integer|min:1',
            'settings.return_policy_condition' => 'required|string|max:200',
        ], [
            'settings.banner_enabled.in' => 'Giá trị bật/tắt banner không hợp lệ.',
            'settings.banner_content.required' => 'Nội dung banner không được để trống.',
            'settings.banner_content.max' => 'Nội dung banner không được vượt quá 500 ký tự.',
            'settings.banner_type.in' => 'Kiểu banner phải là info, success hoặc warning.',
            'settings.shipping_free_threshold.required' => 'Giá trị miễn phí vận chuyển không được để trống.',
            'settings.shipping_free_threshold.numeric' => 'Giá trị miễn phí vận chuyển phải là số.',
            'settings.shipping_estimate_max_days.gte' => 'Thời gian giao hàng tối đa phải lớn hơn hoặc bằng thời gian tối thiểu.',
        ]);

        // Update settings - this automatically clears cache via Observer
        $this->settingService->updateMany($validated['settings']);

        return back()->with('success', 'Cài đặt đã được cập nhật thành công!');
    }
}
