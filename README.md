# Rill - Vinyl Records E-commerce Platform

Rill là một nền tảng thương mại điện tử chuyên về đĩa than vinyl, được xây dựng với Laravel 12, React 19, Inertia.js và TypeScript.

## 🎵 Tính năng chính

- **Quản lý sản phẩm**: CRUD đĩa than với thông tin chi tiết (nghệ sĩ, thể loại, năm phát hành, tracklist)
- **Giỏ hàng**: Hỗ trợ cả khách hàng đã đăng nhập và guest users với session-based cart
- **Đơn hàng**: Quản lý đơn hàng với nhiều trạng thái và email thông báo
- **Thanh toán**: Tích hợp VNPay và thanh toán khi nhận hàng (COD)
- **Vận chuyển**: Tích hợp Giao Hàng Nhanh (GHN) API
- **Mã giảm giá**: Hệ thống voucher với email notification cho khách hàng
- **Đánh giá**: Khách hàng có thể đánh giá sản phẩm sau khi mua
- **Dashboard Admin**: Thống kê doanh thu, đơn hàng, sản phẩm bán chạy
- **Email notifications**: Welcome email, order status updates, voucher notifications
- **Queue system**: Xử lý email hàng loạt với rate limiting

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 12
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Queue**: Database queue driver
- **Mail**: Resend (với rate limiting và retry logic)
- **Authentication**: Laravel Breeze với Inertia.js
- **Architecture**: Repository pattern, Service layer, Query Builder pattern

### Frontend
- **Framework**: React 19
- **Router**: Inertia.js 2.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Headless UI, Lucide Icons
- **Build Tool**: Vite

## 📋 Yêu cầu hệ thống

- PHP >= 8.2
- Node.js >= 18.x
- Composer
- NPM hoặc Yarn
- SQLite extension cho PHP (hoặc PostgreSQL)

## 🚀 Hướng dẫn cài đặt

### 1. Clone repository

```bash
git clone https://github.com/mttk2004/rill.git
cd rill
```

### 2. Cài đặt dependencies

```bash
# Backend dependencies
composer install

# Frontend dependencies
npm install
```

### 3. Cấu hình môi trường

```bash
# Copy file .env.example
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 4. Cấu hình database

Mở file `.env` và cấu hình database:

```env
DB_CONNECTION=sqlite
# DB_DATABASE=/absolute/path/to/database.sqlite

# Hoặc sử dụng PostgreSQL
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=rill
# DB_USERNAME=postgres
# DB_PASSWORD=password
```

Nếu dùng SQLite, tạo file database:

```bash
touch database/database.sqlite
```

### 5. Cấu hình mail service (Resend)

```env
MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"
RESEND_KEY=your_resend_api_key
```

### 6. Cấu hình Giao Hàng Nhanh (GHN)

```env
GHN_API_TOKEN=your_ghn_token
GHN_SHOP_ID=your_shop_id
GHN_API_BASE_URL=https://dev-online-gateway.ghn.vn/shiip/public-api
```

### 7. Cấu hình VNPay

```env
VNPAY_TMN_CODE=your_tmn_code
VNPAY_HASH_SECRET=your_hash_secret
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNPAY_RETURN_URL="${APP_URL}/checkout/vnpay/return"
```

### 8. Chạy migration và seeder

```bash
# Chạy migration
php artisan migrate

# Seed database với dữ liệu mẫu
php artisan db:seed

# Hoặc chạy cả hai cùng lúc
php artisan migrate:fresh --seed
```

**Dữ liệu mẫu sau khi seed:**
- Admin account: `admin@rill.test` / `password`
- Customer accounts: `user1@rill.test` đến `user10@rill.test` / `password`
- ~50 sản phẩm đĩa than
- ~15 đơn hàng mẫu
- Đánh giá sản phẩm
- Vouchers

### 9. Build frontend assets

```bash
# Development mode với hot reload
npm run dev

# Production build
npm run build
```

### 10. Chạy queue worker (cho email notifications)

Mở terminal mới và chạy:

```bash
php artisan queue:work --tries=3 --timeout=60
```

Hoặc với supervisor (production):

```bash
php artisan queue:listen
```

### 11. Khởi động development server

```bash
php artisan serve
```

Truy cập ứng dụng tại: `http://localhost:8000`

## 👤 Tài khoản test

Sau khi seed database:

**Admin:**
- Email: `admin@rill.test`
- Password: `password`
- Dashboard: `/admin/dashboard`

**Customer:**
- Email: `user1@rill.test` đến `user10@rill.test`
- Password: `password`

## 📁 Cấu trúc thư mục chính

```
rill/
├── app/
│   ├── Actions/           # Business logic actions
│   ├── DataObjects/       # DTOs for type safety
│   ├── Events/            # Laravel events
│   ├── Listeners/         # Event listeners
│   ├── Mail/              # Mailable classes
│   ├── Models/            # Eloquent models
│   ├── Repositories/      # Repository pattern
│   ├── Services/          # Service layer
│   └── QueryBuilders/     # Custom query builders
├── database/
│   ├── migrations/        # Database migrations
│   └── seeders/           # Database seeders
├── resources/
│   ├── js/
│   │   ├── components/    # React components
│   │   ├── pages/         # Inertia pages
│   │   ├── context/       # React context (ToastContext)
│   │   └── utils/         # Utility functions
│   └── views/
│       └── emails/        # Blade email templates
├── routes/
│   ├── web.php           # Web routes
│   ├── api.php           # API routes
│   └── auth.php          # Authentication routes
└── tests/                # PHPUnit tests
```

## 🔧 Scripts phổ biến

```bash
# Development
npm run dev              # Start Vite dev server with HMR
php artisan serve        # Start Laravel dev server
php artisan queue:work   # Process queue jobs

# Database
php artisan migrate      # Run migrations
php artisan db:seed      # Run seeders
php artisan migrate:fresh --seed  # Reset and reseed

# Testing
php artisan test         # Run all tests
php artisan test --filter=TestName  # Run specific test

# Production
npm run build           # Build for production
php artisan optimize    # Cache config, routes, views
php artisan queue:restart  # Restart queue workers
```

## 📧 Email Configuration

Ứng dụng sử dụng queue system để gửi email. Email templates bao gồm:

- **Welcome Email**: Gửi khi user đăng ký tài khoản mới
- **Order Status Updates**: Gửi khi trạng thái đơn hàng thay đổi
- **Voucher Notifications**: Gửi khi admin tạo voucher mới (bulk email với rate limiting)

### Rate Limiting cho Voucher Notifications

- Batch size: 50 users/batch
- Delay giữa batches: 0.5 giây
- Random delay mỗi email: 1-5 giây
- Retry logic: 3 attempts với exponential backoff (10s, 30s, 60s)

## 🔒 Security Features

- CSRF protection
- SQL injection protection (Eloquent ORM)
- XSS protection (React/Inertia escaping)
- Password hashing (bcrypt)
- Email verification
- Rate limiting on API routes
- Secure payment integration (VNPay)

## 🐛 Troubleshooting

### Queue jobs không chạy
```bash
# Kiểm tra queue connection trong .env
QUEUE_CONNECTION=database

# Chạy lại migration cho jobs table
php artisan queue:table
php artisan migrate

# Restart queue worker
php artisan queue:restart
php artisan queue:work
```

### Frontend không hot reload
```bash
# Xóa cache và rebuild
npm run dev -- --force
```

### Email không gửi được
```bash
# Kiểm tra queue jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Check logs
tail -f storage/logs/laravel.log
```

### Database connection error
```bash
# SQLite: Đảm bảo file database tồn tại
touch database/database.sqlite

# Set permissions
chmod 664 database/database.sqlite
chmod 775 database/

# Clear cache
php artisan config:clear
php artisan cache:clear
```

## 📝 API Documentation

API endpoints cho frontend (Inertia.js):

- `GET /` - Homepage
- `GET /products` - Product listing
- `GET /products/{id}` - Product details
- `POST /cart/add` - Add to cart (guest & authenticated)
- `GET /checkout` - Checkout page
- `POST /checkout/process` - Process order
- `GET /admin/dashboard` - Admin dashboard (auth required)

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## 📄 License

This project is open-sourced software licensed under the MIT license.

## 👨‍💻 Author

**Kiet Mai**
- GitHub: [@mttk2004](https://github.com/mttk2004)

## 🙏 Acknowledgments

- Laravel Framework
- React & Inertia.js teams
- Tailwind CSS
- All open source contributors
