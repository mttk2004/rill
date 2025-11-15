# Hướng dẫn Test Tính năng Chọn Địa chỉ bằng Dropdown

## Các bước đã triển khai

### 1. Backend
- ✅ Tạo `GHNService` để gọi API GHN với caching 24 giờ
- ✅ Tạo `AddressDataController` với 3 endpoints:
  - `GET /api/provinces` - Lấy danh sách tỉnh/thành phố
  - `GET /api/districts?province_id={id}` - Lấy danh sách quận/huyện
  - `GET /api/wards?district_id={id}` - Lấy danh sách phường/xã
- ✅ Thêm GHN token vào `config/services.php`
- ✅ Cập nhật validation cho `StoreShippingAddressRequest` và `UpdateShippingAddressRequest`
- ✅ Thêm `province_id` và `district_id` vào fillable của `ShippingAddress` model
- ✅ Tạo migration để thêm cột `province_id` và `district_id`

### 2. Frontend
- ✅ Thay thế Input thành Select component cho City, District, Ward
- ✅ Implement chained API calls (Province -> District -> Ward)
- ✅ Thêm loading states cho mỗi dropdown
- ✅ Cập nhật form schema để bao gồm `province_id` và `district_id`
- ✅ Lưu cả name (để hiển thị) và ID (để tính phí ship sau này)

## Cách test

### 1. Chạy migration
```bash
php artisan migrate
```

### 2. Khởi động server
```bash
# Terminal 1 - Laravel
php artisan serve

# Terminal 2 - Vite
npm run dev
```

### 3. Test các API endpoints

#### Test API Provinces
```bash
curl http://localhost:8000/api/provinces
```
Kết quả mong đợi: JSON với danh sách tỉnh/thành phố

#### Test API Districts (ví dụ với Hồ Chí Minh - ProvinceID: 202)
```bash
curl "http://localhost:8000/api/districts?province_id=202"
```

#### Test API Wards (ví dụ với Quận 1 - DistrictID: 1442)
```bash
curl "http://localhost:8000/api/wards?district_id=1442"
```

### 4. Test trên UI

1. Đăng nhập vào hệ thống
2. Vào trang "Địa chỉ của tôi" (`/addresses`)
3. Click "Thêm địa chỉ mới"
4. Kiểm tra các bước:
   - **Tỉnh/Thành phố**: Dropdown sẽ tự động load khi mở modal
   - **Quận/Huyện**: Chỉ được enable sau khi chọn tỉnh
   - **Phường/Xã**: Chỉ được enable sau khi chọn quận/huyện
5. Chọn lần lượt:
   - Tỉnh/Thành phố (ví dụ: Hồ Chí Minh)
   - Quận/Huyện (ví dụ: Quận 1)
   - Phường/Xã (ví dụ: Phường Bến Nghé)
6. Điền thông tin khác và lưu
7. Kiểm tra database:
   ```sql
   SELECT id, city, province_id, district, district_id, ward
   FROM shipping_addresses
   ORDER BY created_at DESC
   LIMIT 1;
   ```

## Kiểm tra Console Logs

### Browser Console
- Mở DevTools (F12)
- Tab "Network": Xem các API calls tới `/api/provinces`, `/api/districts`, `/api/wards`
- Tab "Console": Xem có lỗi nào không

### Laravel Logs
```bash
tail -f storage/logs/laravel.log
```
Xem có lỗi khi gọi GHN API không

## Các vấn đề có thể gặp

### 1. API GHN không trả về dữ liệu
- Kiểm tra token trong `.env`: `GHN_API_TOKEN`
- Kiểm tra kết nối internet
- Xem logs: `storage/logs/laravel.log`

### 2. Dropdown không load
- Kiểm tra browser console có lỗi không
- Kiểm tra API response trong tab Network
- Đảm bảo đã chạy `npm run dev`

### 3. Không lưu được địa chỉ
- Kiểm tra validation errors trong response
- Đảm bảo đã chạy migration
- Xem Laravel logs

## Lợi ích của cách triển khai này

1. **Caching**: Dữ liệu tỉnh/quận/phường được cache 24h, giảm số lần gọi API GHN
2. **UX tốt**: Chained dropdowns với loading states
3. **Dữ liệu đáng tin cậy**: Sử dụng dữ liệu chính thức từ GHN
4. **Sẵn sàng cho tính năng tiếp theo**: Đã lưu `province_id` và `district_id` để tính phí vận chuyển

## Tính năng tiếp theo

Sau khi test thành công tính năng này, bạn có thể triển khai:
- **Tính phí vận chuyển động** (Zone-based hoặc GHN API)
- **Validation địa chỉ** với GHN API
- **Auto-fill mã bưu điện** dựa trên địa chỉ đã chọn
