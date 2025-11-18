# Email Testing Guide for Rill

## ✅ Setup Complete!

Chức năng email đã được triển khai thành công với các tính năng sau:

### 📧 Emails Implemented

1. **Welcome Email** - Gửi khi user đăng ký mới
   - Template đẹp với gradient và icons
   - Giới thiệu các tính năng của Rill
   - Call-to-action đến trang sản phẩm

2. **Order Status Updated Email** - Gửi khi trạng thái đơn hàng thay đổi
   - Hiển thị thông tin đơn hàng chi tiết
   - Badge trạng thái có màu sắc
   - Danh sách sản phẩm trong đơn
   - Thông báo phù hợp với từng trạng thái

## 🚀 How to Test

### Option 1: Automatic Testing (Recommended)

1. **Khởi động queue worker:**
   ```bash
   php artisan queue:work
   ```

2. **Mở test dashboard:**
   ```
   http://localhost:8000/test/email
   ```

3. **Click vào các nút test:**
   - "Send Welcome Email" - Test welcome email
   - "Send Order Status Email" - Test order notification

4. **Kiểm tra:**
   - Terminal sẽ hiển thị "Processing: App\Mail\WelcomeEmail"
   - Email sẽ được gửi đến địa chỉ email của user/order
   - Kiểm tra hộp thư đến của bạn!

### Option 2: Test via Registration

1. **Khởi động queue worker:**
   ```bash
   php artisan queue:work
   ```

2. **Đăng ký tài khoản mới:**
   - Vào trang đăng ký: http://localhost:8000/register
   - Điền thông tin và submit
   - Welcome email sẽ tự động được gửi!

### Option 3: Test via Order

1. **Khởi động queue worker:**
   ```bash
   php artisan queue:work
   ```

2. **Tạo đơn hàng mới:**
   - Thêm sản phẩm vào giỏ
   - Checkout và thanh toán
   - Khi trạng thái đơn hàng thay đổi (confirmed/shipped/delivered), email tự động gửi

## 📋 Queue Configuration

Hiện tại đang dùng `database` driver cho queue (đơn giản nhất cho development):

```env
QUEUE_CONNECTION=database
```

### Important Commands:

```bash
# Xử lý tất cả jobs trong queue
php artisan queue:work

# Xử lý một job rồi dừng (tốt cho debugging)
php artisan queue:work --once

# Xem danh sách jobs đang chờ
php artisan queue:monitor

# Xóa tất cả failed jobs
php artisan queue:flush
```

## 🔍 Troubleshooting

### Email không gửi được?

1. **Kiểm tra .env:**
   ```env
   MAIL_MAILER=resend
   RESEND_API_KEY=re_xxxxx
   MAIL_FROM_ADDRESS="your-verified-email@domain.com"
   ```

2. **Kiểm tra queue worker có đang chạy không:**
   - Xem terminal có hiển thị "Processing: ..." không?
   - Nếu không, chạy lại `php artisan queue:work`

3. **Kiểm tra bảng `jobs`:**
   ```bash
   php artisan tinker
   >>> DB::table('jobs')->count()
   ```
   - Nếu > 0: Có jobs đang chờ, queue worker chưa xử lý
   - Nếu = 0: Không có jobs, có thể đã được xử lý hoặc chưa tạo

4. **Kiểm tra Resend Dashboard:**
   - Login vào https://resend.com/emails
   - Xem logs để biết email có được gửi đi không

### Queue worker bị treo?

```bash
# Dừng worker
Ctrl + C

# Khởi động lại
php artisan queue:restart
php artisan queue:work
```

## 📝 Files Created

### Mail Classes
- `app/Mail/WelcomeEmail.php`
- `app/Mail/OrderStatusUpdated.php`

### Email Templates
- `resources/views/emails/welcome.blade.php`
- `resources/views/emails/order-status-updated.blade.php`

### Listeners
- `app/Listeners/SendWelcomeEmail.php`

### Providers
- `app/Providers/EventServiceProvider.php` (registered events)

### Test Routes
- `/test/email` - Email testing dashboard
- `/test/email/welcome` - Test welcome email
- `/test/email/order-status` - Test order status email

## 🎯 Next Steps

1. **Production Deployment:** Khi deploy lên Railway, cần:
   - Tạo `startup.sh` script để chạy queue worker
   - Cấu hình Start Command trên Railway
   - Xem chi tiết trong `email.md`

2. **Additional Emails:** Có thể thêm các email khác:
   - Password reset
   - Order invoice
   - Promotional emails
   - Low stock alerts (cho admin)

3. **Email Templates:** Có thể tùy chỉnh design trong:
   - `resources/views/emails/welcome.blade.php`
   - `resources/views/emails/order-status-updated.blade.php`

## 🎉 Happy Testing!

Email system đã sẵn sàng! Chỉ cần chạy `php artisan queue:work` và test thôi!
