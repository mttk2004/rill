Chào bạn, ý tưởng này **rất tuyệt vời và chuyên nghiệp**.

Đây là bước chuyển mình cần thiết để biến Rill từ một dự án "Hardcoded" (Code cứng) thành một hệ thống **Dynamic CMS** (Hệ thống quản trị nội dung động) thực thụ. Việc tách biệt dữ liệu cấu hình ra khỏi Source Code giúp Admin vận hành linh hoạt mà không cần Dev phải deploy lại code mỗi khi muốn thay đổi câu thông báo khuyến mãi.

Mô hình lưu trữ `Settings` (Key-Value) là tiêu chuẩn trong các framework lớn (như WordPress `wp_options` hay Magento `core_config_data`).

Dưới đây là lộ trình triển khai chi tiết theo kiến trúc hiện tại của Rill:

-----

### Bước 1: Thiết kế Database (Migration)

Chúng ta cần một bảng đơn giản để lưu cặp khóa - giá trị.

Tạo migration: `php artisan make:migration create_settings_table`

```php
// database/migrations/xxxx_xx_xx_create_settings_table.php
public function up(): void
{
    Schema::create('settings', function (Blueprint $table) {
        $table->id();
        $table->string('key')->unique(); // Ví dụ: 'site_banner_content'
        $table->text('value')->nullable(); // Ví dụ: 'Chào mừng 20/11...'
        $table->string('type')->default('text'); // 'text', 'boolean', 'number', 'json'
        $table->string('group')->default('general'); // 'banner', 'shipping', 'policy' để dễ quản lý
        $table->string('label')->nullable(); // Tên hiển thị cho Admin dễ hiểu
        $table->timestamps();
    });
}
```

### Bước 2: Tạo Model và Seeder (Chuyển dữ liệu cứng vào DB)

1.  **Model:** `php artisan make:model Setting`

    ```php
    // app/Models/Setting.php
    class Setting extends Model {
        protected $fillable = ['key', 'value', 'type', 'group', 'label'];
    }
    ```

2.  **Seeder:** `php artisan make:seeder SettingSeeder`
    Đây là nơi bạn định nghĩa các thông số hiện tại của Rill.

    ```php
    // database/seeders/SettingSeeder.php
    public function run(): void
    {
        $settings = [
            // Nhóm Banner
            [
                'key' => 'banner_enabled',
                'value' => '0', // Tắt mặc định
                'type' => 'boolean',
                'group' => 'banner',
                'label' => 'Bật/Tắt Banner đầu trang'
            ],
            [
                'key' => 'banner_content',
                'value' => 'Giảm giá 10% cho toàn bộ đĩa than nhạc Jazz!',
                'type' => 'text',
                'group' => 'banner',
                'label' => 'Nội dung Banner'
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
                'key' => 'shipping_estimate_days',
                'value' => '5',
                'type' => 'number',
                'group' => 'shipping',
                'label' => 'Thời gian giao hàng dự kiến (ngày)'
            ],
            // Nhóm Chính sách (Policy)
            [
                'key' => 'return_policy_days',
                'value' => '30',
                'type' => 'number',
                'group' => 'policy',
                'label' => 'Thời gian đổi trả (ngày)'
            ],
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
    ```

### Bước 3: Tạo `SettingService` (Backend Logic & Caching)

Vì các thông số này được gọi ở **mọi trang** (Header/Footer), nên việc **Cache** là bắt buộc để không làm chậm web.

`php artisan make:service SettingService`

```php
// app/Services/SettingService.php
namespace App\Services;

use App\Models\Setting;
use Illuminate\Support\Facades\Cache;

class SettingService
{
    // Lấy toàn bộ settings (đã cache)
    public function getAll()
    {
        return Cache::rememberForever('app_settings', function () {
            return Setting::all()->keyBy('key');
        });
    }

    // Lấy 1 giá trị cụ thể
    public function get($key, $default = null)
    {
        $settings = $this->getAll();
        $setting = $settings->get($key);

        if (!$setting) return $default;

        // Cast kiểu dữ liệu
        if ($setting->type === 'boolean') return (bool) $setting->value;
        if ($setting->type === 'number') return (int) $setting->value;

        return $setting->value;
    }

    // Cập nhật settings (Xóa cache khi update)
    public function update(array $data)
    {
        foreach ($data as $key => $value) {
            Setting::where('key', $key)->update(['value' => $value]);
        }
        Cache::forget('app_settings'); // Quan trọng: Xóa cache cũ
    }
}
```

### Bước 4: Chia sẻ dữ liệu Global cho Frontend (Inertia Middleware)

Để React component (Header, Footer) truy cập được settings mà không cần gọi API mỗi lần, ta dùng `HandleInertiaRequests.php`.

```php
// app/Http/Middleware/HandleInertiaRequests.php
use App\Services\SettingService;

// Inject Service vào Constructor
public function __construct(protected SettingService $settingService) {}

public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        // ... auth, flash, cart ...

        // Chia sẻ Settings toàn cục
        'settings' => function () {
            return [
                'banner' => [
                    'enabled' => $this->settingService->get('banner_enabled', false),
                    'content' => $this->settingService->get('banner_content', ''),
                ],
                'shipping' => [
                    'free_threshold' => $this->settingService->get('shipping_free_threshold', 1000000),
                    'estimate_days' => $this->settingService->get('shipping_estimate_days', 5),
                ],
                'policy' => [
                    'return_days' => $this->settingService->get('return_policy_days', 30),
                ]
            ];
        },
    ]);
}
```

### Bước 5: Frontend - Hiển thị Banner (React)

1.  **Tạo Component Banner:** `resources/js/components/marketing-banner.tsx`

    ```tsx
    import { usePage } from '@inertiajs/react';
    import { X } from 'lucide-react';
    import { useState } from 'react';

    export function MarketingBanner() {
        const { settings } = usePage<any>().props;
        const [isVisible, setIsVisible] = useState(true);

        // Nếu admin tắt hoặc user đã đóng -> không hiện
        if (!settings.banner.enabled || !isVisible) return null;

        return (
            <div className="relative bg-indigo-600 px-4 py-3 text-white">
                <p className="text-center text-sm font-medium">
                    {settings.banner.content}
                </p>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/20"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }
    ```

2.  **Thêm vào `AppLayout`:**

    ```tsx
    // resources/js/layouts/app-layout.tsx
    import { MarketingBanner } from "@/components/marketing-banner";

    export default function AppLayout({ children }) {
        return (
            <div className="...">
                <MarketingBanner /> {/* Đặt ngay trên Header */}
                <Header />
                <main>{children}</main>
                <Footer />
            </div>
        );
    }
    ```

### Bước 6: Thay thế các chuỗi cứng (Shipping, Return)

Ví dụ tại trang `ProductPriceCard`:

```tsx
// Thay vì: <span>Đổi trả miễn phí trong 30 ngày...</span>
// Sử dụng:
const { settings } = usePage<any>().props;

<span>Đổi trả miễn phí trong {settings.policy.return_days} ngày...</span>
```

### Bước 7: Trang Admin quản lý Settings

Bạn cần tạo Controller `Admin\SettingController` và View `resources/js/pages/admin/settings/index.tsx`.

  * Giao diện Admin sẽ là một Form lớn, chia thành các Tabs (Banner, Vận chuyển, Chung).
  * Khi Submit, gửi một mảng key-value lên endpoint `PUT /admin/settings`.
  * Controller gọi `$this->settingService->update($request->all())`.

-----

### Đánh giá tính khả thi và hiệu quả

  * **Độ khó:** Trung bình.
  * **Hiệu quả:** Rất cao.
      * **Marketing:** Bạn có thể chạy chiến dịch khuyến mãi tức thì.
      * **Vận hành:** Khi lạm phát tăng, bạn có thể sửa mức Free Ship từ 1 triệu lên 2 triệu chỉ trong 1 nốt nhạc mà không cần đụng vào code.
      * **Bảo trì:** Code sạch hơn vì không còn "Magic Numbers" rải rác.

Bạn có muốn tôi viết code chi tiết cho phần **Admin Controller và View React** để quản lý các settings này không?
