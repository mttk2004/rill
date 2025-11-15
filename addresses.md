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

#### Các bước triển khai (Theo Cách 2 - Zone-Based):

1.  **Backend (Laravel):**

      * Tạo một API endpoint mới: `POST /api/shipping-fee`. Endpoint này nhận vào `address_id` (hoặc Tỉnh/Huyện) và `cart_total`.
      * Tạo `Api/ShippingFeeController.php`.
      * Trong Controller (hoặc tốt hơn là một `ShippingService`), bạn viết logic:

    <!-- end list -->

    ```php
    public function calculate(Request $request)
    {
        // 1. Lấy tổng giỏ hàng (từ CartService)
        $cartTotal = $this->cartService->getTotal($request->user());

        // 2. Điều kiện miễn phí vận chuyển
        if ($cartTotal >= 1000000) {
            return response()->json(['shipping_fee' => 0, 'message' => 'Được miễn phí vận chuyển']);
        }

        // 3. Tính phí theo vùng
        $address = ShippingAddress::find($request->input('address_id'));
        if (!$address) {
            return response()->json(['shipping_fee' => 30000, 'message' => 'Phí vận chuyển tạm tính']); // Phí mặc định
        }

        $fee = 0;
        if ($address->province == 'Thành phố Hồ Chí Minh') {
            $innerCityDistricts = ['Quận 1', 'Quận 3', 'Quận 10']; // Tự định nghĩa
            $outerCityDistricts = ['Quận 12', 'Bình Tân']; // Tự định nghĩa

            if (in_array($address->district, $innerCityDistricts)) {
                $fee = 20000;
            } elseif (in_array($address->district, $outerCityDistricts)) {
                $fee = 35000;
            } else {
                $fee = 40000; // Các quận huyện khác ở TPHCM
            }
        } else {
            $fee = 50000; // Đồng giá các tỉnh khác
        }

        return response()->json(['shipping_fee' => $fee]);
    }
    ```

2.  **Frontend (React):**

      * Tại trang `resources/js/pages/checkout.tsx`.
      * Sử dụng `useState` để lưu phí ship: `const [shippingFee, setShippingFee] = useState(0);`.
      * Sử dụng `useEffect` để gọi API `/api/shipping-fee` mỗi khi:
          * Trang được tải.
          * Người dùng thay đổi địa chỉ giao hàng (`selectedAddress`).
          * Tổng giỏ hàng thay đổi (ví dụ: áp dụng voucher).
      * Cập nhật `shippingFee` trong state và hiển thị ra giao diện "Tổng cộng".

3.  **Lưu vào đơn hàng:**

      * Khi người dùng bấm "Đặt hàng", bạn gửi `shipping_fee` đã tính được lên server.
      * `OrderService` sẽ nhận phí này và lưu vào cột `shipping_fee` trong bảng `orders` (cột này đã có sẵn trong migration của bạn).

**Kết luận:** Cả hai tính năng đều không quá khó. Tính năng địa chỉ (1) chủ yếu tốn thời gian ở frontend để xử lý API liên hoàn. Tính năng phí vận chuyển (2) hoàn toàn khả thi nếu bạn dùng phương pháp "Zone-Based" thay vì "Distance-Based" (km).
