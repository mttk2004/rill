# Hướng dẫn Test Tích hợp VNPAY

## ✅ Các Bước Đã Hoàn Thành

### 1. Cập nhật Database Schema
- ✅ Thêm `'vnpay'` vào enum `payment_method` trong bảng `payments`
- ✅ Chạy migration thành công

### 2. Backend Implementation
- ✅ Tạo `VnpayService` với các methods:
  - `createPaymentUrl()`: Tạo URL thanh toán VNPAY
  - `isValidSignature()`: Validate chữ ký từ VNPAY
  - `getResponseMessage()`: Lấy thông báo lỗi theo response code

- ✅ Cập nhật `OrderService`:
  - Nhận `payment_method` từ request
  - Tạo Payment record với đúng payment method

- ✅ Cập nhật `CheckoutController`:
  - Xử lý 2 luồng: COD (redirect) và VNPAY (return JSON)
  - Inject `VnpayService`

- ✅ Tạo `VnpayController`:
  - `handleIpn()`: Xử lý IPN callback từ VNPAY
  - Validate signature, amount, order status
  - Cập nhật payment và order status

- ✅ Cập nhật `OrderController`:
  - `thankYou()`: Xử lý params từ VNPAY return URL
  - Pass vnpayResponse data cho frontend

- ✅ Thêm routes:
  - `/vnpay/ipn` (GET) - Endpoint cho VNPAY IPN

### 3. Frontend Implementation
- ✅ Cập nhật `checkout.tsx`:
  - Kích hoạt VNPAY option
  - Xử lý submit với fetch API cho VNPAY
  - Redirect đến payment URL

- ✅ Cập nhật `thank-you.tsx`:
  - Hiển thị trạng thái thanh toán từ VNPAY
  - Alert cho thông tin giao dịch
  - UI khác biệt cho success/failed

## 🧪 Hướng dẫn Test

### Bước 1: Khởi động Server
```bash
php artisan serve
npm run dev
```

### Bước 2: Đăng nhập
- Truy cập http://localhost:8000
- Đăng nhập với tài khoản customer:
  - Email: customer@rill.vn
  - Password: password

### Bước 3: Thêm sản phẩm vào giỏ hàng
- Vào trang Products
- Thêm một số sản phẩm vào giỏ

### Bước 4: Checkout với VNPAY
- Vào trang Cart và nhấn "Thanh toán"
- Chọn địa chỉ giao hàng
- **Chọn "Thanh toán qua VNPAY"** (giờ đã được kích hoạt)
- Nhấn "Hoàn tất đơn hàng"

### Bước 5: Test trên VNPAY Sandbox
Sau khi redirect đến VNPAY, sử dụng thông tin test:

**Thẻ ATM (Ngân hàng NCB)**
- Số thẻ: `9704198526191432198`
- Tên chủ thẻ: `NGUYEN VAN A`
- Ngày phát hành: `07/15`
- Mật khẩu OTP: `123456`

**Để test các trường hợp:**
1. **Thanh toán thành công**: Nhập đúng thông tin trên
2. **Thanh toán thất bại**: Nhập sai OTP hoặc hủy giao dịch

### Bước 6: Kiểm tra kết quả
- Sau khi thanh toán, VNPAY sẽ redirect về `/orders/{order_id}/thank-you`
- Kiểm tra:
  - ✅ Hiển thị đúng trạng thái (thành công/thất bại)
  - ✅ Hiển thị thông báo từ VNPAY
  - ✅ Hiển thị mã giao dịch (nếu thành công)

### Bước 7: Kiểm tra Database
```bash
php artisan tinker
```

```php
// Kiểm tra order vừa tạo
$order = Order::latest()->first();
$order->status; // Nên là 'processing' nếu thanh toán thành công

// Kiểm tra payment
$payment = $order->payment;
$payment->payment_method; // 'vnpay'
$payment->payment_status; // 'completed' hoặc 'failed'
$payment->transaction_id; // Mã giao dịch từ VNPAY
$payment->gateway_response; // Toàn bộ response từ VNPAY
```

### Bước 8: Kiểm tra Logs
```bash
tail -f storage/logs/laravel.log
```

Tìm các log entries:
- `VNPAY IPN Received:`
- `VNPAY IPN: Payment successful.`
- `VNPAY IPN: Payment failed.`

## 🔧 Troubleshooting

### Nếu không redirect đến VNPAY
1. Kiểm tra file `.env` có đúng thông tin VNPAY không
2. Check console log trong browser
3. Kiểm tra network tab để xem response từ `/orders`

### Nếu IPN không hoạt động
1. Trong sandbox, IPN có thể không được gọi tự động
2. Có thể cần expose local server với ngrok:
   ```bash
   ngrok http 8000
   ```
   Sau đó cập nhật `VNPAY_IPN_URL` trong `.env` với URL ngrok

### Nếu signature không hợp lệ
1. Kiểm tra `VNPAY_HASHSECRET` trong `.env`
2. Đảm bảo không có space thừa trong hash secret

## 📝 Lưu ý quan trọng

### Production Checklist
- [ ] Thay đổi `VNPAY_URL` từ sandbox sang production URL
- [ ] Cập nhật `VNPAY_TMNCODE` và `VNPAY_HASHSECRET` với thông tin production
- [ ] Đảm bảo `VNPAY_IPN_URL` là URL public có thể truy cập từ internet
- [ ] Cấu hình HTTPS cho production
- [ ] Test kỹ IPN endpoint trong production environment
- [ ] Thêm monitoring cho IPN failures
- [ ] Backup dữ liệu trước khi deploy

### Bảo mật
- ✅ Hash secret được lưu trong `.env` (không commit vào git)
- ✅ IPN endpoint validate signature trước khi xử lý
- ✅ IPN endpoint không yêu cầu authentication (VNPAY server gọi)
- ✅ Kiểm tra amount match với order
- ✅ Prevent double processing với status check

## 🎯 Các Tính năng Đã Implement

1. ✅ Tạo payment URL với đầy đủ tham số theo spec VNPAY
2. ✅ Validate chữ ký HMAC-SHA512
3. ✅ Xử lý IPN callback từ VNPAY
4. ✅ Cập nhật trạng thái order và payment
5. ✅ Hiển thị thông báo lỗi theo response code
6. ✅ UI phân biệt success/failed
7. ✅ Lưu trữ gateway response để audit
8. ✅ Prevent double processing
9. ✅ Support cả COD và VNPAY trong cùng một flow

## 📚 Tài liệu tham khảo

- [VNPAY Documentation](https://sandbox.vnpayment.vn/apis/docs/index.html)
- File `vnpay.md` trong project (kế hoạch chi tiết)
- `.env.example` (cần cập nhật với VNPAY variables)
