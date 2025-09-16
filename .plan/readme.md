# Rill - Cửa hàng Đĩa Than Online

## Tổng quan
Rill là một ứng dụng web thương mại điện tử chuyên bán đĩa than (vinyl records). Dự án được phát triển trong vòng 2 tháng với mục tiêu tạo ra một nền tảng mua sắm trực tuyến cho người yêu nhạc và sưu tầm đĩa than.

## Công nghệ sử dụng
- **Backend**: Laravel 12
- **Frontend**: Inertia.js 2.1 với React 19 + TypeScript
- **Cơ sở dữ liệu**: MySQL/MariaDB
- **UI Framework**: Tailwind CSS + Radix UI
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Authentication**: Laravel Sanctum

## Đối tượng người dùng
1. **Admin**: Quản lý toàn bộ hệ thống
2. **Khách hàng**: Người dùng đã đăng ký
3. **Khách**: Người dùng chưa đăng ký (có thể xem sản phẩm)

## Tính năng chính
- 🛒 Giỏ hàng và thanh toán COD
- 📍 Quản lý địa chỉ giao hàng
- 🎫 Hệ thống voucher giảm giá (fixed amount)
- 📧 Thông báo email tự động
- ⭐ Đánh giá sản phẩm
- 💰 Thanh toán COD (Cash on Delivery)
- 👥 Quản lý khách hàng
- 📊 Dashboard và thống kê admin

## Cấu trúc dự án
```
rill/
├── app/                 # Laravel application
├── resources/js/        # React components
├── resources/css/       # Stylesheets
├── database/           # Migrations & seeders
├── routes/             # API & web routes
├── public/             # Static assets
└── .plan/              # Project planning documents
```

## Quy mô
- **Số lượng bảng**: 14 bảng cơ sở dữ liệu (đơn giản hóa cho MVP)
- **Thời gian phát triển**: 2 tháng (8 tuần)
- **Loại hình**: Web application đáp ứng (responsive)
- **Mục tiêu**: MVP (Minimum Viable Product) cho thương mại điện tử

## Mục tiêu kinh doanh
1. Tạo trải nghiệm mua sắm trực tuyến tuyệt vời cho người yêu nhạc và sưu tầm đĩa than.
2. Quản lý hiệu quả kho đĩa than và đơn hàng.
3. Cung cấp thông tin chi tiết về album, nghệ sĩ, và hãng đĩa.
4. Xây dựng cộng đồng người yêu nhạc qua hệ thống review và rating.

## Liên hệ & Hỗ trợ
- **Developer**: Team Rill
- **Project Timeline**: 2 tháng (8 tuần)
- **Documentation**: Xem các file trong thư mục `.plan/`
- **MVP Focus**: Thanh toán COD, hệ thống đơn giản, tập trung vào core features
