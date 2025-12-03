Chào bạn, đây là hai tính năng rất quan trọng để nâng cấp trải nghiệm người dùng cho trang e-commerce của bạn. Tôi sẽ phân tích từng vấn đề, cách các trang khác thực hiện và độ khó triển khai cho dự án "rill" của bạn.

-----

### 1\. Chọn Địa chỉ Tỉnh/Huyện/Xã (Dropdowns)

Đây là một tính năng "phải có" ở thị trường Việt Nam.

**Độ khó triển khai:** **Dễ đến Trung bình**.

  * **Phần dễ:** Thay đổi giao diện React từ `<Input>` sang `<Select>`.
  * **Phần trung bình:** Cần có một nguồn dữ liệu (API) đáng tin cậy cho 3 cấp hành chính này và phải thực hiện các lệnh gọi API liên hoàn (chained requests).

#### Các bước triển khai:

1.  **Nguồn dữ liệu (Data Source):** Bạn không nên tự tạo danh sách này vì nó rất lớn và thay đổi (ví dụ: Quận 9, Thủ Đức, Quận 2 gộp thành TP. Thủ Đức). Cách tốt nhất là dùng API công cộng miễn phí của một bên vận chuyển.

      * **Khuyến nghị:** Sử dụng **API của Giao Hàng Nhanh (GHN)**. Họ cung cấp các endpoint miễn phí để lấy danh sách Tỉnh/Thành, Quận/Huyện, Phường/Xã.
      * *Link (tham khảo):* `https://api.ghn.vn/home/docs/detail?id=60` (Bạn cần kiểm tra tài liệu chính thức của họ).

2.  **Backend (Laravel):**

      * Tạo một Controller mới, ví dụ `app/Http/Controllers/Api/AddressDataController.php`.
      * Tạo 3 route trong `routes/api.php`:
          * `GET /provinces` -\> `AddressDataController@getProvinces`
          * `GET /districts?province_id={id}` -\> `AddressDataController@getDistricts`
          * `GET /wards?district_id={id}` -\> `AddressDataController@getWards`
      * Trong các method này, bạn dùng `Http::get(...)` (HTTP Client của Laravel) để gọi sang API của GHN.
      * **Rất quan trọng:** Bạn phải **cache** (ví dụ `Cache::remember`) kết quả trả về từ GHN. Dữ liệu này gần như không đổi. Cache trong 24 giờ để tránh server của bạn gọi API của GHN liên tục gây chậm hoặc bị chặn.

3.  **Frontend (React):**

      * Trong trang quản lý địa chỉ (`resources/js/pages/addresses/index.tsx`) và có thể cả trang checkout (`resources/js/pages/checkout.tsx`).
      * Thay thế 3 trường input Tỉnh/Huyện/Xã bằng 3 component `<Select>`.
      * Dùng `useEffect` để gọi API (`/api/provinces`) khi component được tải, đổ dữ liệu vào `<Select Tỉnh>`.
      * Khi người dùng chọn một tỉnh (sự kiện `onValueChange`), bạn lấy `province_id` và gọi API (`/api/districts?province_id=...`) để lấy danh sách quận huyện, rồi đổ vào `<Select Huyện>`.
      * Tương tự, khi chọn huyện, bạn gọi API (`/api/wards?district_id=...`) để lấy phường xã.

-----

### 2\. Tính phí Vận chuyển Động (Dynamic Shipping)

**Độ khó triển khai:** **Trung bình đến Khó**.

  * **Phần trung bình:** Logic "Miễn phí vận chuyển cho đơn trên 1 triệu" (`if ($cart_total > 1000000)`) rất đơn giản.
  * **Phần khó:** Logic "tính theo khoảng cách" (nếu bạn hiểu là km) là rất phức tạp và tốn kém.

#### Cách các trang E-commerce thực tế làm:

Họ **hầu như không** tính phí theo km (ví dụ: dùng Google Maps API) vì chi phí API rất cao và không phản ánh đúng chi phí logistics. Thay vào đó, họ dùng 2 cách chính:

1.  **Cách 1 (Chuyên nghiệp - Khó): Tích hợp API Logistics**

      * Họ kết nối trực tiếp với API của các đối tác vận chuyển (GHN, GHTK, Viettel Post...).
      * Khi checkout, họ gửi thông tin (địa chỉ kho, địa chỉ khách, cân nặng gói hàng) cho API của đối tác.
      * API đối tác trả về phí vận chuyển chính xác (ví dụ: 25.000 VNĐ).
      * Họ hiển thị phí này cho người dùng.

2.  **Cách 2 (Đơn giản - Khuyến nghị): Tính phí theo Vùng (Zone-Based Shipping)**

      * Đây là cách "giả lập" khoảng cách mà bạn nên dùng.
      * Bạn tự định nghĩa các vùng dựa trên địa chỉ cửa hàng (ví dụ: ở TPHCM).
      * **Ví dụ:**
          * **Nội thành (Zone 1):** Quận 1, 3, 5, 10, Phú Nhuận -\> Đồng giá 20.000 VNĐ.
          * **Ngoại thành 1 (Zone 2):** Quận 2, 7, 8, Gò Vấp, Tân Bình -\> Đồng giá 30.000 VNĐ.
          * **Ngoại thành 2 (Zone 3):** TP. Thủ Đức (cũ), Hóc Môn, Củ Chi -\> Đồng giá 40.000 VNĐ.
          * **Các tỉnh khác (Zone 4):** -\> Đồng giá 50.000 VNĐ (hoặc theo API của đối tác).

#### Các bước triển khai (Theo Cách 1):

Chào bạn,

**Câu trả lời là: CÓ, bạn không chỉ có thể mà còn RẤT NÊN tận dụng API này.**

Đây chính là "Cách 1: Tích hợp API Logistics" chuyên nghiệp mà tôi đã đề cập. Sử dụng API này sẽ ưu việt hơn hẳn so với cách 2 (tính phí theo Vùng) vì:

1.  **Chính xác tuyệt đối:** Phí bạn báo cho khách hàng là phí thật mà GHN sẽ thu, không bị chênh lệch (lời/lỗ) do ước lượng.
2.  **Linh hoạt:** Dù khách ở quận trung tâm hay huyện đảo xa, API sẽ tự tính đúng, bạn không cần bảo trì "danh sách vùng" (zone) thủ công.
3.  **Chuyên nghiệp:** Trải nghiệm của khách hàng sẽ giống hệt như khi mua hàng trên Shopee/Tiki/Lazada.

**Độ khó triển khai:** **Trung bình.** Khó hơn "Zone-Based" một chút, nhưng hoàn toàn nằm trong khả năng của bạn.

-----

### Phân tích API của GHN và Kế hoạch triển khai

Dựa trên tài liệu bạn gửi, API của GHN (`shipping-order/fee`) là một API `POST`, không phải `GET`, và nó cần các thông tin sau:

  * **Thông tin người gửi (Cửa hàng của bạn):** `from_district_id`, `from_ward_code`. (Bạn cần lấy mã này 1 lần và lưu lại, ví dụ từ địa chỉ kho).
  * **Thông tin người nhận (Khách hàng):** `to_district_id`, `to_ward_code`. (Bạn lấy từ địa chỉ khách hàng chọn).
  * **Thông tin gói hàng:** `weight` (gram), `length` (cm), `width` (cm), `height` (cm).
  * **Thông tin dịch vụ:** `service_id`. (Bạn phải gọi một API khác của GHN để biết khu vực đó hỗ trợ dịch vụ nào, ví dụ: "Giao nhanh", "Giao chuẩn").
  * **Thông tin đơn hàng:** `insurance_value` (tổng giá trị giỏ hàng), `coupon` (nếu có).

-----

### Các bước triển khai chi tiết

Đây là cách bạn tích hợp API này vào `checkout.tsx` một cách mượt mà, kết hợp với logic "Free ship trên 1 triệu".

#### Bước 1: Cấu hình Backend (Chỉ làm 1 lần)

1.  **Lấy thông tin GHN:** Đăng ký tài khoản GHN, tạo cửa hàng/kho. Bạn sẽ lấy được:

      * `Token` (Khóa API).
      * `ShopID` (Mã cửa hàng).
      * Địa chỉ kho của bạn (dùng API Tỉnh/Huyện để tra ra `from_district_id` và `from_ward_code` của kho).

2.  **Thêm vào `.env`:**

    ```env
    GHN_SHOP_ID=your_shop_id
    GHN_SHOP_DISTRICT_ID=your_shop_district_id
    GHN_SHOP_WARD_CODE=your_shop_ward_code
    ```

    (Tạo thêm file `config/ghn.php` để gọi `env()` cho sạch sẽ).

#### Bước 2: Ước lượng Cân nặng & Kích thước (Thử thách nhỏ)

API của GHN cần cân nặng và kích thước. Bạn cần một hàm để "ước lượng" gói hàng.

  * **Cách đơn giản:** Giả sử 1 đĩa than nặng 500g, kích thước 35x35x3 cm. Nếu khách mua 3 đĩa:
      * `weight` = 3 \* 500 = 1500g
      * `height` = 3 \* 3 = 9cm (xếp chồng lên nhau)
      * `length` = 35cm
      * `width` = 35cm
  * **Cách nâng cao:** Thêm cột `weight` và `dimensions` vào bảng `products`. Khi tính, bạn sẽ lặp qua `CartService` để tính tổng.

*Khởi đầu, hãy dùng cách đơn giản.*

#### Bước 3: Tạo `ShippingService` (Backend)

Tạo một `app/Services/ShippingService.php` mới.

```php
<?php
namespace App\Services;

use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Http;

class ShippingService
{
    protected $token;
    protected $shopId;
    protected $fromDistrictId;
    protected $fromWardCode;

    public function __construct()
    {
        $this->token = config('ghn.token');
        $this->shopId = config('ghn.shop_id');
        $this->fromDistrictId = config('ghn.shop_district_id');
        $this->fromWardCode = config('ghn.shop_ward_code');
    }

    /**
     * Tính phí vận chuyển dựa trên địa chỉ và tổng giỏ hàng.
     */
    public function calculateFee(ShippingAddress $toAddress, int $cartTotalInVND)
    {
        // 1. Logic Free Ship của bạn
        if ($cartTotalInVND >= 1000000) {
            return 0; // Miễn phí vận chuyển
        }

        // 2. Lấy Service ID (Giao hàng chuẩn)
        // Bạn nên cache lệnh gọi này
        $serviceId = $this->getAvailableServiceId($toAddress->district_id);
        if (!$serviceId) {
            // Nếu không tìm thấy dịch vụ, trả về một mức phí cố định
            return 50000; // Hoặc ném ra lỗi
        }

        // 3. Ước lượng gói hàng (VÍ DỤ ĐƠN GIẢN)
        // Bạn cần lấy số lượng item từ CartService
        $itemCo = 1; // TODO: Lấy từ CartService
        $weight = 500 * $itemCo; // 500g/item
        $height = 3 * $itemCo;
        $length = 35;
        $width = 35;

        // 4. Gọi API GHN
        $response = Http::withHeaders([
            'Token' => $this->token,
            'ShopId' => $this->shopId,
        ])->post('https://api.ghn.vn/shiip/public-api/v2/shipping-order/fee', [
            'from_district_id' => $this->fromDistrictId,
            'from_ward_code'   => $this->fromWardCode,
            'to_district_id'   => $toAddress->district_id,
            'to_ward_code'     => $toAddress->ward_code,
            'service_id'       => $serviceId,
            'insurance_value'  => $cartTotalInVND,
            'weight'           => $weight,
            'length'           => $length,
            'width'            => $width,
            'height'           => $height,
        ]);

        if ($response->successful() && $response->json('data.total')) {
            return $response->json('data.total');
        }

        // Nếu API lỗi, trả về phí mặc định
        return 50000;
    }

    /**
     * Lấy ID dịch vụ vận chuyển (ví dụ: giao hàng chuẩn)
     */
    protected function getAvailableServiceId($toDistrictId)
    {
        // API này lấy các gói cước (chuẩn, nhanh,...) mà GHN hỗ trợ
        $response = Http::withHeaders([
            'Token' => $this->token,
        ])->post('https://api.ghn.vn/shiip/public-api/v2/shipping-order/available-services', [
            'shop_id' => $this->shopId,
            'from_district' => $this->fromDistrictId,
            'to_district' => $toDistrictId,
        ]);

        if ($response->successful() && !empty($response->json('data'))) {
            // Logic: Ưu tiên "Giao hàng chuẩn" (service_type_id = 2)
            foreach ($response->json('data') as $service) {
                if ($service['service_type_id'] == 2) {
                    return $service['service_id'];
                }
            }
            // Nếu không có, lấy cái đầu tiên
            return $response->json('data.0.service_id');
        }
        return null;
    }
}
```

#### Bước 4: Tạo Route và Controller (Backend)

1.  **Tạo Route:** Trong `routes/api.php`:

    ```php
    use App\Http\Controllers\Api\ShippingController;
    Route::post('/shipping-fee', [ShippingController::class, 'calculate'])->middleware('auth:sanctum');
    ```

2.  **Tạo Controller:** `php artisan make:controller Api/ShippingController`

    ```php
    <?php
    namespace App\Http\Controllers\Api;

    use App\Http\Controllers\Controller;
    use App\Models\ShippingAddress;
    use App\Services\CartService;
    use App\Services\ShippingService;
    use Illuminate\Http\Request;

    class ShippingController extends Controller
    {
        public function calculate(
            Request $request,
            ShippingService $shippingService,
            CartService $cartService
        ) {
            $request->validate(['address_id' => 'required|exists:shipping_addresses,id']);

            $address = ShippingAddress::find($request->input('address_id'));
            $cartTotal = $cartService->getCartData($request->user())['summary']['total'];

            // TODO: Bạn cần đảm bảo địa chỉ này thuộc về user đang đăng nhập
            // $this->authorize('view', $address);

            $fee = $shippingService->calculateFee($address, $cartTotal);

            return response()->json(['shipping_fee' => $fee]);
        }
    }
    ```

#### Bước 5: Cập nhật Frontend (React)

Trong `resources/js/pages/checkout.tsx`:

```tsx
// ... (imports)
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Checkout(props) {
    // ... (các state hiện có của bạn)
    const [selectedAddressId, setSelectedAddressId] = useState(props.defaultAddress?.id || null);
    const [shippingFee, setShippingFee] = useState(null); // null để biết đang load
    const [isCalculatingFee, setIsCalculatingFee] = useState(false);

    // Lấy tổng giỏ hàng (từ props hoặc context)
    const cartTotal = props.cart.summary.total;

    useEffect(() => {
        if (selectedAddressId) {
            setIsCalculatingFee(true);
            setShippingFee(null); // Reset khi đổi địa chỉ

            axios.post(route('api.shipping.calculate'), { address_id: selectedAddressId })
                .then(response => {
                    setShippingFee(response.data.shipping_fee);
                })
                .catch(error => {
                    console.error('Lỗi tính phí ship:', error);
                    setShippingFee(50000); // Phí dự phòng
                })
                .finally(() => {
                    setIsCalculatingFee(false);
                });
        }
    }, [selectedAddressId, cartTotal]); // Tính lại khi đổi địa chỉ HOẶC tổng giỏ hàng thay đổi

    // ... (trong JSX)

    // Chỗ chọn địa chỉ
    <RadioGroup
        value={selectedAddressId}
        onValueChange={(id) => setSelectedAddressId(id)}
    >
        {/* ... (lặp qua các địa chỉ) */}
    </RadioGroup>

    // Chỗ hiển thị phí ship
    <div>
        <span>Phí vận chuyển</span>
        {isCalculatingFee && <span className="animate-pulse">Đang tính...</span>}
        {!isCalculatingFee && shippingFee !== null && (
            <span>{shippingFee === 0 ? 'Miễn phí' : formatCurrency(shippingFee)}</span>
        )}
    </div>

    // Chỗ hiển thị TỔNG CỘNG (phải cộng cả phí ship)
    <div>
        <span>Tổng cộng</span>
        <span>
            {formatCurrency(cartTotal + (shippingFee || 0))}
        </span>
    </div>
}
```

**Kết luận:** Triển khai theo cách này là **khó hơn một chút** (vì phải xử lý ước lượng cân nặng và gọi 2 API của GHN), nhưng đây là cách làm **đúng đắn và bền vững** nhất cho một trang e-commerce thực thụ.
