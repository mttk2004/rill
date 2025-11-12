# VNPAY Integration - Production Deployment Guide

## ✅ Tích hợp hoàn tất

Dự án đã tích hợp thành công VNPAY payment gateway với đầy đủ tính năng:
- ✅ Tạo đơn hàng với phương thức thanh toán VNPAY
- ✅ Redirect đến cổng thanh toán VNPAY
- ✅ Xử lý return URL (user-facing)
- ✅ Xử lý IPN callback (server-to-server)
- ✅ Cập nhật trạng thái payment và order tự động
- ✅ Đồng bộ xử lý địa chỉ billing/shipping cho cả COD và VNPAY

## 🔧 Cấu hình hiện tại

### Development (Sandbox)
```env
VNPAY_TMN_CODE=484MK9DQ
VNPAY_HASH_SECRET=7JBKVKPJ7WDCJRRPBWJXS3EAT8XIS1O0
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=http://localhost:8000/orders/thank-you
VNPAY_IPN_URL=http://localhost:8000/vnpay/ipn
```

### Production
Khi deploy lên production, cần thay đổi:

```env
# VNPAY Production credentials (lấy từ merchant dashboard)
VNPAY_TMN_CODE=your_production_tmn_code
VNPAY_HASH_SECRET=your_production_hash_secret
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html

# URLs phải là domain thật, public accessible
VNPAY_RETURN_URL=https://yourdomain.com/orders/thank-you
VNPAY_IPN_URL=https://yourdomain.com/vnpay/ipn
```

## 📋 Checklist trước khi deploy Production

### 1. Cấu hình VNPAY Merchant Dashboard
- [ ] Đăng ký tài khoản VNPAY merchant production
- [ ] Lấy TMN Code và Hash Secret production
- [ ] Config IPN URL trong dashboard: `https://yourdomain.com/vnpay/ipn`
- [ ] Config Return URL: `https://yourdomain.com/orders/thank-you`
- [ ] Whitelist domain của bạn (nếu VNPAY yêu cầu)

### 2. Cập nhật Environment Variables
```bash
# Update .env trên production server
VNPAY_TMN_CODE=production_code
VNPAY_HASH_SECRET=production_secret
VNPAY_URL=https://vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL=https://yourdomain.com/orders/thank-you
VNPAY_IPN_URL=https://yourdomain.com/vnpay/ipn

# Clear cache
php artisan config:clear
php artisan cache:clear
php artisan optimize
```

### 3. Xóa Test Files (Quan trọng!)
Các file chỉ dùng cho development, **PHẢI XÓA** trước khi deploy:

```bash
# Xóa test routes và views
rm routes/test.php
rm -rf resources/views/test/

# Hoặc giữ lại nhưng đảm bảo chỉ load trong local environment
# (Đã config trong bootstrap/app.php - chỉ load khi app()->environment('local'))
```

### 4. Kiểm tra Routes
```bash
# List tất cả routes và kiểm tra
php artisan route:list | grep vnpay

# Expected routes:
# GET|HEAD   vnpay/ipn ........................ vnpay.ipn › VnpayController@handleIpn
# GET|HEAD   orders/thank-you ................ orders.thank-you › OrderController@thankYou
```

### 5. SSL Certificate
- [ ] Domain phải có SSL certificate (HTTPS)
- [ ] VNPAY yêu cầu tất cả URLs phải HTTPS trong production
- [ ] Test SSL với: `curl -I https://yourdomain.com/vnpay/ipn`

### 6. Logs và Monitoring
```bash
# Theo dõi logs trong production
tail -f storage/logs/laravel.log | grep VNPAY

# Expected logs khi có payment:
# - "VNPAY IPN Received"
# - "VNPAY IPN: Payment successful" (hoặc failed)
```

## 🔄 Payment Flow

### 1. User chọn VNPAY và submit checkout
```
Frontend (checkout.tsx)
  → POST /orders (CheckoutController@store)
  → OrderService::createOrderFromCart()
  → VnpayService::createPaymentUrl()
  → Return JSON: { payment_url, order_id }
  → Frontend redirect user to VNPAY
```

### 2. User thanh toán tại VNPAY
```
User nhập thông tin thẻ
  → VNPAY xử lý thanh toán
  → VNPAY gọi 2 endpoints đồng thời:
     a) Return URL (redirect user)
     b) IPN URL (server-to-server)
```

### 3. VNPAY Return URL (User-facing)
```
VNPAY redirect user về:
  → /orders/thank-you?vnp_ResponseCode=00&vnp_TxnRef=...
  → OrderController@thankYou
  → Hiển thị kết quả thanh toán cho user
  → Payment status có thể vẫn "pending" (chờ IPN)
```

### 4. VNPAY IPN Callback (Server-to-server)
```
VNPAY gọi:
  → /vnpay/ipn?vnp_Amount=...&vnp_ResponseCode=00&...
  → VnpayController@handleIpn
  → Validate signature
  → Update payment status → "completed"
  → Update order status → "confirmed"
  → Return JSON: { RspCode: "00", Message: "Confirm Success" }
```

## 🧪 Testing trong Development

### Vấn đề: IPN không hoạt động trên localhost
VNPAY không thể gọi `http://localhost:8000/vnpay/ipn` vì không public accessible.

### Giải pháp 1: IPN Simulator (Đã implement)
```bash
# Truy cập simulator
http://localhost:8000/test/vnpay/ipn

# Paste VNPAY return URL vào form
# Click "Simulate IPN Callback"
# Kiểm tra database
```

### Giải pháp 2: ngrok (Alternative)
```bash
# Install ngrok
# Run ngrok
ngrok http 8000

# Update .env với ngrok URL
VNPAY_IPN_URL=https://abc123.ngrok.io/vnpay/ipn

# VNPAY sẽ có thể gọi IPN qua ngrok tunnel
```

## 📊 Database Schema

### Orders Table
```sql
- status: enum('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')
  - COD: pending → confirmed (manual by admin)
  - VNPAY: pending → confirmed (automatic via IPN)

- shipping_address: JSON (full address data)
- billing_address: JSON (same as shipping_address)
```

### Payments Table
```sql
- payment_method: enum('cod', 'vnpay')
- payment_status: enum('pending', 'completed', 'failed', 'refunded')
- transaction_id: VNPAY transaction number (vnp_TransactionNo)
- gateway_response: JSON (full VNPAY response)
- processed_at: timestamp (when IPN processed)
```

## 🐛 Troubleshooting

### Payment status vẫn "pending" sau khi thanh toán
**Nguyên nhân:** IPN chưa được gọi hoặc bị lỗi

**Kiểm tra:**
```bash
# 1. Check logs
tail -f storage/logs/laravel.log | grep "VNPAY IPN"

# 2. Check IPN URL có public accessible không
curl -I https://yourdomain.com/vnpay/ipn

# 3. Check VNPAY merchant dashboard xem có IPN logs không

# 4. Trong development: dùng IPN simulator
```

### Order status không đổi sang "confirmed"
**Nguyên nhân:** Lỗi trong VnpayController@handleIpn

**Kiểm tra:**
```bash
# Check enum values trong migration
'status', ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

# VnpayController phải dùng đúng giá trị:
- Success: 'confirmed' (không phải 'processing')
- Failed: 'cancelled' (không phải 'failed')
```

### CSRF token mismatch khi checkout với VNPAY
**Giải pháp:** Đã thêm CSRF token vào meta tag
```html
<!-- resources/views/app.blade.php -->
<meta name="csrf-token" content="{{ csrf_token() }}">
```

```typescript
// resources/js/pages/checkout.tsx
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
headers: {
  'X-CSRF-TOKEN': csrfToken || '',
}
```

### 404 error khi VNPAY redirect về
**Nguyên nhân:** Route `/orders/thank-you` nằm trong auth middleware

**Giải pháp:** Đã move route ra ngoài auth middleware group
```php
// routes/web.php
// VNPAY return URL - PHẢI nằm ngoài auth middleware
Route::get('/orders/thank-you', [OrderController::class, 'thankYou'])
    ->name('orders.thank-you');
```

## 📝 Code References

### Key Files
```
app/
├── Http/Controllers/
│   ├── CheckoutController.php    # Handle checkout, create order
│   ├── VnpayController.php       # Handle IPN callback
│   └── OrderController.php       # Thank you page
├── Services/
│   ├── OrderService.php          # Create order logic
│   └── VnpayService.php          # VNPAY API integration
└── Http/Requests/
    └── StoreOrderRequest.php     # Validation rules

resources/js/pages/
├── checkout.tsx                  # Checkout UI
└── orders/thank-you.tsx          # Thank you page

routes/
├── web.php                       # Main routes
└── test.php                      # Test routes (development only)

config/
└── vnpay.php                     # VNPAY configuration
```

### Important Methods
```php
// Create payment URL
VnpayService::createPaymentUrl(Order $order, Request $request): string

// Validate VNPAY signature
VnpayService::isValidSignature(array $data): bool

// Get response message in Vietnamese
VnpayService::getResponseMessage(string $responseCode): string

// Handle IPN callback
VnpayController::handleIpn(Request $request, VnpayService $vnpayService)

// Create order from cart
OrderService::createOrderFromCart(User $user, array $data): Order
```

## 🎯 Success Metrics

Một payment flow thành công sẽ có:

1. **Order created** với status = "pending"
2. **Payment created** với:
   - payment_method = "vnpay"
   - payment_status = "pending"
3. **User redirected** đến VNPAY payment page
4. **User completes payment** tại VNPAY
5. **User redirected back** với vnp_ResponseCode=00
6. **Thank you page shows** success message
7. **IPN callback received** và processed
8. **Payment updated** với:
   - payment_status = "completed"
   - transaction_id = vnp_TransactionNo
   - gateway_response = full JSON
   - processed_at = timestamp
9. **Order updated** với status = "confirmed"

## 📞 Support

### VNPAY Support
- Website: https://vnpay.vn
- Hotline: 1900 55 55 77
- Email: support@vnpay.vn
- Merchant Dashboard: https://merchant.vnpay.vn

### Development Team
- Check logs: `storage/logs/laravel.log`
- Check database: `payments` và `orders` tables
- Run IPN simulator: `http://localhost:8000/test/vnpay/ipn` (dev only)

---

**Last Updated:** November 12, 2025
**Version:** 1.0
**Status:** ✅ Production Ready
