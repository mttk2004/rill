<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Nhóm Banner
            [
                'key' => 'banner_enabled',
                'value' => '1', // Bật mặc định
                'type' => 'boolean',
                'group' => 'banner',
                'label' => 'Bật/Tắt Banner đầu trang'
            ],
            [
                'key' => 'banner_content',
                'value' => 'Chào mừng bạn đến với Rill - Cửa hàng đĩa than chuyên nghiệp!',
                'type' => 'text',
                'group' => 'banner',
                'label' => 'Nội dung Banner'
            ],
            [
                'key' => 'banner_type',
                'value' => 'info', // 'info', 'success', 'warning'
                'type' => 'text',
                'group' => 'banner',
                'label' => 'Kiểu Banner (info/success/warning)'
            ],

            // Nhóm Vận chuyển (Shipping)
            [
                'key' => 'shipping_free_threshold',
                'value' => '1000000',
                'type' => 'number',
                'group' => 'shipping',
                'label' => 'Mức giá tối thiểu để Free Ship (VNĐ)'
            ],
            [
                'key' => 'shipping_estimate_min_days',
                'value' => '2',
                'type' => 'number',
                'group' => 'shipping',
                'label' => 'Thời gian giao hàng tối thiểu (ngày)'
            ],
            [
                'key' => 'shipping_estimate_max_days',
                'value' => '5',
                'type' => 'number',
                'group' => 'shipping',
                'label' => 'Thời gian giao hàng tối đa (ngày)'
            ],

            // Nhóm Chính sách (Policy)
            [
                'key' => 'return_policy_days',
                'value' => '7',
                'type' => 'number',
                'group' => 'policy',
                'label' => 'Thời gian đổi trả (ngày)'
            ],
            [
                'key' => 'return_policy_condition',
                'value' => 'lỗi nhà sản xuất (cong vênh, xước đĩa)',
                'type' => 'text',
                'group' => 'policy',
                'label' => 'Điều kiện đổi trả'
            ],
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}
