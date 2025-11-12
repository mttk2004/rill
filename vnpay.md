Based on the official VNPAY documentation you provided and your existing codebase, đây là kế hoạch chi tiết từng bước để tích hợp VNPAY vào dự án Laravel/Inertia/React của bạn.

Tôi sẽ tập trung vào việc tích hợp luồng thanh toán VNPAY vào `CheckoutController` và `checkout.tsx` của bạn.

-----

## 1\. Cấu hình (Configuration)

Trước tiên, bạn cần lưu trữ các thông tin VNPAY cung cấp (TmnCode, HashSecret) một cách an toàn.

1.  **Cập nhật `.env`:**
    Thêm các biến sau vào tệp `.env` của bạn (sử dụng thông tin VNPAY cung cấp cho môi trường sandbox):

    ```env
    VNPAY_TMNCODE=YOUR_TMNCODE
    VNPAY_HASHSECRET=YOUR_HASHSECRET
    VNPAY_URL="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"
    VNPAY_RETURN_URL="/orders/thank-you"
    VNPAY_IPN_URL="/vnpay/ipn"
    ```

2.  **Tạo tệp Config:**
    Tạo một tệp config mới tại `config/vnpay.php` để dễ dàng truy cập các biến này:

    ```php
    <?php
    return [
        'tmn_code' => env('VNPAY_TMNCODE'),
        'hash_secret' => env('VNPAY_HASHSECRET'),
        'url' => env('VNPAY_URL'),
        'return_url' => env('VNPAY_RETURN_URL'),
        'ipn_url' => env('VNPAY_IPN_URL'),
    ];
    ```

-----

## 2\. Bước 1: Tạo Yêu cầu Thanh toán (Sửa `CheckoutController`)

Hiện tại, `CheckoutController@store` của bạn tạo đơn hàng và chuyển hướng đến trang "thank-you". Chúng ta sẽ sửa đổi nó để tạo đơn hàng *trước*, sau đó tạo URL thanh toán VNPAY và trả về URL đó.

**Đề xuất:** Tạo một `VnpayService` để xử lý logic tạo URL và xác thực hash.

```bash
php artisan make:service VnpayService
```

**Trong `app/Services/VnpayService.php`:**

```php
<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Http\Request;

class VnpayService
{
    protected $tmnCode;
    protected $hashSecret;
    protected $url;
    protected $returnUrl;
    protected $ipnUrl;

    public function __construct()
    {
        $this->tmnCode = config('vnpay.tmn_code');
        $this->hashSecret = config('vnpay.hash_secret');
        $this->url = config('vnpay.url');
        // Tạo URL tuyệt đối cho return và ipn
        $this->returnUrl = route('orders.thank-you'); //
        $this->ipnUrl = route('vnpay.ipn'); // Chúng ta sẽ tạo route này ở Bước 4
    }

    /**
     * Tạo URL thanh toán VNPAY.
     */
    public function createPaymentUrl(Order $order, Request $request): string
    {
        // Các tham số bắt buộc theo tài liệu VNPAY
        $vnp_Params = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->tmnCode,
            'vnp_Amount' => $order->total_amount * 100, // VNPAY yêu cầu * 100
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => $order->id, // Sử dụng ID đơn hàng làm mã tham chiếu
            'vnp_OrderInfo' => "Thanh toan don hang #{$order->id}",
            'vnp_OrderType' => 'other',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => $this->returnUrl,
            'vnp_IpAddr' => $request->ip(),
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];

        // Sắp xếp các tham số theo thứ tự alphabet
        ksort($vnp_Params);

        // Tạo chuỗi query và hash
        $query = http_build_query($vnp_Params);
        $hashData = $query;
        $vnp_SecureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        // Thêm hash vào URL
        $paymentUrl = $this->url . '?' . $query . '&vnp_SecureHash=' . $vnp_SecureHash;

        return $paymentUrl;
    }

    /**
     * Xác thực chữ ký IPN trả về.
     */
    public function isValidSignature(array $data): bool
    {
        $vnp_SecureHash = $data['vnp_SecureHash'];
        unset($data['vnp_SecureHash']);

        // Sắp xếp lại dữ liệu để tạo hash
        ksort($data);
        $hashData = http_build_query($data);

        $secureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        return $secureHash === $vnp_SecureHash;
    }
}
```

**Cập nhật `app/Http/Controllers/CheckoutController.php`:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order; // Đảm bảo bạn đã use
use App\Services\OrderService; // Giả sử bạn có service này để tạo đơn hàng
use App\Services\VnpayService; // Thêm VnpayService
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    // ... (các phương thức khác)

    /**
     * Store a newly created resource in storage.
     * Sửa đổi để trả về JSON chứa URL thanh toán.
     */
    public function store(Request $request, OrderService $orderService, VnpayService $vnpayService)
    {
        // 1. Validate request (Giả sử bạn dùng FormRequest)

        // 2. Tạo đơn hàng với trạng thái 'pending'
        // Bọc trong DB transaction để đảm bảo an toàn
        $order = null;
        try {
            $order = $orderService->createOrder($request->user(), $request->validated());

            if (!$order) {
                return response()->json(['message' => 'Không thể tạo đơn hàng.'], 500);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }

        // 3. Tạo URL thanh toán VNPAY
        $paymentUrl = $vnpayService->createPaymentUrl($order, $request);

        // 4. Trả về URL dưới dạng JSON cho React
        // Quan trọng: Không dùng Inertia::render hoặc redirect() ở đây
        return response()->json([
            'payment_url' => $paymentUrl,
        ]);
    }
}
```

-----

## 3\. Bước 2: Xử lý Chuyển hướng (Frontend `checkout.tsx`)

Bây giờ, trang React của bạn cần phải gọi `CheckoutController@store`, nhận JSON trả về, và chuyển hướng người dùng.

Trong `resources/js/pages/checkout.tsx`:

Bạn cần thay đổi cách `form.post` hoạt động. Thay vì sử dụng `useForm` của Inertia cho việc submit cuối cùng, bạn nên dùng một hàm `async` với `axios` (hoặc `fetch`) để có thể xử lý response JSON.

```tsx
// Trong file resources/js/pages/checkout.tsx

import { useState } from 'react';
import axios from 'axios'; // Đảm bảo bạn đã cài đặt axios
// ... (các import khác)

export default function Checkout({ /* ...props */ }) {
  // ... (các state và hook khác của bạn)
  const [isProcessing, setIsProcessing] = useState(false);

  // ... (logic form của bạn, ví dụ useForm của react-hook-form)

  // Hàm này sẽ được gọi khi người dùng nhấn nút "Thanh toán"
  const handleSubmitOrder = async (formData: YourFormDataType) => {
    setIsProcessing(true);

    try {
      // Gọi đến CheckoutController@store
      const response = await axios.post(route('orders.store'), formData);

      // Kiểm tra nếu response có payment_url
      if (response.data && response.data.payment_url) {
        // **Đây là mấu chốt: Chuyển hướng trình duyệt đến cổng VNPAY**
        window.location.href = response.data.payment_url;
      } else {
        // Xử lý lỗi nếu không nhận được URL
        toast.error('Không thể tạo link thanh toán. Vui lòng thử lại.');
        setIsProcessing(false);
      }

    } catch (error) {
      // Xử lý lỗi (ví dụ: validation failed 422, server error 500)
      console.error('Lỗi khi đặt hàng:', error);
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  };

  // ... (phần JSX của bạn)
  // Trong <form> của bạn, hãy gọi onSubmit={handleSubmit(handleSubmitOrder)}
  // (Nếu bạn dùng react-hook-form)
  // Hoặc <button onClick={handleSubmitOrder} disabled={isProcessing}>
  //   {isProcessing ? 'Đang xử lý...' : 'Thanh toán qua VNPAY'}
  // </button>

  // ...
}
```

-----

## 4\. Bước 3: Xử lý VNPAY Redirect (Client-Side)

Khi VNPAY thanh toán xong, nó sẽ chuyển hướng người dùng về `vnp_ReturnUrl` mà chúng ta đã cấu hình là `route('orders.thank-you')`.

Route này đã tồn tại trong `routes/web.php` và trỏ đến `OrderController@thankYou`.

**Trong `app/Http/Controllers/OrderController.php`:**

```php
<?php
// ...
use Illuminate\Http\Request;

class OrderController extends Controller
{
    // ... (index, show, ...)

    public function thankYou(Request $request)
    {
        // Lấy vnp_ResponseCode từ URL
        $responseCode = $request->query('vnp_ResponseCode');
        $orderId = $request->query('vnp_TxnRef');

        // **QUAN TRỌNG:**
        // KHÔNG cập nhật trạng thái đơn hàng ở đây.
        // Trang này chỉ dùng để hiển thị thông báo cho khách hàng.
        // Việc xác nhận thanh toán PHẢI được thực hiện qua IPN (Bước 4).

        return Inertia::render('orders/thank-you', [
            'status' => $responseCode === '00' ? 'success' : 'failed',
            'orderId' => $orderId,
            'message' => $responseCode === '00' ? 'Thanh toán thành công!' : 'Thanh toán thất bại.',
        ]);
    }

    // ... (cancel, downloadInvoice)
}
```

Bạn sẽ cần cập nhật trang `resources/js/pages/orders/thank-you.tsx` để hiển thị các `props` (status, orderId, message) này.

-----

## 5\. Bước 4: Xử lý IPN (Server-to-Server) - Quan trọng nhất\!

Đây là luồng "ngầm" mà VNPAY gửi đến máy chủ của bạn để *xác nhận* thanh toán. Đây là nơi duy nhất bạn nên cập nhật trạng thái đơn hàng.

1.  **Thêm Route:**
    Thêm route này vào `routes/web.php` (bên ngoài các nhóm middleware `auth`):

    ```php
    use App\Http\Controllers\VnpayController; // Thêm use

    // ... (các route khác)

    // VNPAY IPN Handler
    Route::get('/vnpay/ipn', [VnpayController::class, 'handleIpn'])->name('vnpay.ipn');
    ```

2.  **Tạo `VnpayController`:**

    ```bash
    php artisan make:controller VnpayController
    ```

3.  **Trong `app/Http/Controllers/VnpayController.php`:**

    ```php
    <?php

    namespace App\Http\Controllers;

    use App\Models\Order;
    use App\Models\Payment; //
    use App\Services\VnpayService;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Log;

    class VnpayController extends Controller
    {
        public function handleIpn(Request $request, VnpayService $vnpayService)
        {
            $data = $request->all();
            Log::info('VNPAY IPN Received:', $data);

            // 1. Xác thực chữ ký
            if (!$vnpayService->isValidSignature($data)) {
                Log::warning('VNPAY IPN: Invalid Signature.', $data);
                return response()->json(['RspCode' => '97', 'Message' => 'Invalid Signature']);
            }

            // 2. Tìm đơn hàng
            $order = Order::find($data['vnp_TxnRef']); //
            if (!$order) {
                Log::error('VNPAY IPN: Order not found.', $data);
                return response()->json(['RspCode' => '01', 'Message' => 'Order not found']);
            }

            // 3. Kiểm tra trạng thái đơn hàng (để tránh xử lý 2 lần)
            if ($order->status !== 'pending') {
                Log::info('VNPAY IPN: Order already processed.', $data);
                return response()->json(['RspCode' => '02', 'Message' => 'Order already processed']);
            }

            // 4. Kiểm tra mã giao dịch (vnp_ResponseCode)
            if ($data['vnp_ResponseCode'] === '00') {
                // Thanh toán thành công
                $order->status = 'processing'; // Hoặc 'paid', 'completed' tùy vào logic của bạn

                // Tạo bản ghi thanh toán
                Payment::create([ //
                    'order_id' => $order->id,
                    'amount' => $data['vnp_Amount'] / 100,
                    'payment_method' => 'vnpay',
                    'status' => 'completed',
                    'transaction_id' => $data['vnp_TransactionNo'], // Mã giao dịch của VNPAY
                ]);

            } else {
                // Thanh toán thất bại
                $order->status = 'failed';
            }

            $order->save();

            // 5. Phản hồi cho VNPAY
            // Đây là yêu cầu bắt buộc của VNPAY để họ biết đã nhận được IPN
            return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
        }
    }
    ```
