# Cơ sở Dữ liệu - Rill

## Tổng quan
Hệ thống database được thiết kế với **14 bảng** chính, tuân thủ nguyên tắc normalization và đảm bảo hiệu suất cho ứng dụng cửa hàng đĩa than.

---

## Danh sách Bảng

### 1. Bảng Authentication & Users

#### `users` - Người dùng hệ thống
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| name | varchar(255) | Họ và tên | NOT NULL |
| email | varchar(255) | Email đăng nhập | UNIQUE, NOT NULL |
| email_verified_at | timestamp | Thời gian verify email | NULL |
| password | varchar(255) | Mật khẩu đã hash | NOT NULL |
| role | enum('admin','customer') | Vai trò người dùng | DEFAULT 'customer' |
| phone | varchar(10) | Số điện thoại | NULL |
| gender | enum('male','female','other') | Giới tính | NULL |
| date_of_birth | date | Ngày sinh | NULL |
| avatar | varchar(255) | Đường dẫn ảnh đại diện | NULL |
| is_active | boolean | Trạng thái hoạt động | DEFAULT true |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |
| deleted_at | timestamp | Thời gian xóa (soft delete) | NULL |

*Ghi chú: Role enum đơn giản thay thế hệ thống permissions phức tạp.*

---

### 2. Bảng Product Management

#### `artists` - Nghệ sĩ
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| name | varchar(255) | Tên nghệ sĩ | NOT NULL |
| slug | varchar(255) | URL friendly name | UNIQUE, NOT NULL |
| description | text | Tiểu sử nghệ sĩ | NULL |
| image | varchar(255) | Ảnh nghệ sĩ | NULL |
| country | varchar(100) | Quốc gia | NULL |
| is_active | boolean | Trạng thái | DEFAULT true |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |
| deleted_at | timestamp | Thời gian xóa (soft delete) | NULL |

#### `products` - Sản phẩm
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| name | varchar(255) | Tên sản phẩm | NOT NULL |
| slug | varchar(255) | URL friendly name | UNIQUE, NOT NULL |
| description | text | Mô tả ngắn | NOT NULL |
| detailed_description | longtext | Mô tả chi tiết | NULL |
| sku | varchar(100) | Mã sản phẩm | UNIQUE, NOT NULL |
| price | decimal(12,2) | Giá bán | NOT NULL |
| cost_price | decimal(12,2) | Giá gốc | NULL |
| compare_price | decimal(12,2) | Giá so sánh | NULL |
| stock_quantity | int | Số lượng tồn kho | DEFAULT 0 |
| min_stock_level | int | Mức tồn kho tối thiểu | DEFAULT 0 |
| genre | varchar(255) | Thể loại nhạc | NOT NULL |
| label | varchar(255) | Hãng phát hành | NOT NULL |
| image | varchar(255) | Ảnh sản phẩm | NULL |
| is_featured | boolean | Sản phẩm nổi bật | DEFAULT false |
| status | enum('active','inactive','out_of_stock') | Trạng thái | DEFAULT 'active' |
| meta_title | varchar(255) | SEO title | NULL |
| meta_description | text | SEO description | NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |
| deleted_at | timestamp | Thời gian xóa (soft delete) | NULL |

#### `artist_product` - Nghệ sĩ tham gia sản phẩm
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| product_id | bigint | Sản phẩm | FK products.id |
| artist_id | bigint | Nghệ sĩ | FK artists.id |
| role | enum('main','featured','composer','producer') | Vai trò | DEFAULT 'main' |
| sort_order | int | Thứ tự hiển thị | DEFAULT 0 |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

*Ghi chú: Bảng pivot để quản lý nhiều nghệ sĩ cho một sản phẩm. Role 'main' là nghệ sĩ chính, 'featured' là khách mời, 'composer' là nhạc sĩ, 'producer' là nhà sản xuất.*

*Unique constraint: (product_id, artist_id) để tránh duplicate.*

---

### 3. Bảng Shopping & Orders

#### `shopping_cart_items` - Chi tiết giỏ hàng
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| user_id | bigint | Người dùng | FK users.id, NULL |
| session_id | varchar(255) | Session cho guest | NULL |
| product_id | bigint | Sản phẩm | FK products.id |
| quantity | int | Số lượng | NOT NULL |
| unit_price | decimal(10,2) | Giá đơn vị | NOT NULL |
| created_at | timestamp | Thời gian thêm | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

*Ghi chú: Hỗ trợ cả guest users (session_id) và registered users (user_id)*

#### `orders` - Đơn hàng
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| order_number | varchar(50) | Số đơn hàng | UNIQUE, NOT NULL |
| user_id | bigint | Khách hàng | FK users.id, NULL |
| status | enum('pending','confirmed','shipped','delivered','cancelled') | Trạng thái | DEFAULT 'pending' |
| subtotal | decimal(12,2) | Tổng tiền hàng | NOT NULL |
| discount_amount | decimal(12,2) | Giảm giá | DEFAULT 0 |
| total_amount | decimal(12,2) | Tổng thanh toán | NOT NULL |
| currency | varchar(3) | Đơn vị tiền tệ | DEFAULT 'VND' |
| shipping_address | json | Địa chỉ giao hàng | NOT NULL |
| billing_address | json | Địa chỉ thanh toán | NULL |
| notes | text | Ghi chú | NULL |
| placed_at | timestamp | Thời gian đặt hàng | NOT NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |
| deleted_at | timestamp | Thời gian xóa (soft delete) | NULL |

#### `order_items` - Chi tiết đơn hàng
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| order_id | bigint | Đơn hàng | FK orders.id |
| product_id | bigint | Sản phẩm | FK products.id |
| product_name | varchar(255) | Tên sản phẩm (snapshot) | NOT NULL |
| product_sku | varchar(100) | SKU sản phẩm | NOT NULL |
| quantity | int | Số lượng | NOT NULL |
| unit_price | decimal(10,2) | Giá đơn vị | NOT NULL |
| total_price | decimal(12,2) | Thành tiền | NOT NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

#### `order_status_histories` - Lịch sử trạng thái đơn hàng
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| order_id | bigint | Đơn hàng | FK orders.id |
| status | varchar(50) | Trạng thái mới | NOT NULL |
| notes | text | Ghi chú | NULL |
| created_by | bigint | Người cập nhật | FK users.id, NULL |
| created_at | timestamp | Thời gian | NOT NULL |

---

### 4. Bảng Payment & Shipping

#### `payments` - Thanh toán
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| order_id | bigint | Đơn hàng | FK orders.id |
| payment_method | enum('cod') | Phương thức | NOT NULL |
| payment_status | enum('pending','completed','failed','cancelled') | Trạng thái | DEFAULT 'pending' |
| amount | decimal(12,2) | Số tiền | NOT NULL |
| currency | varchar(3) | Đơn vị tiền tệ | DEFAULT 'VND' |
| transaction_id | varchar(255) | Mã giao dịch | NULL |
| gateway_response | json | Phản hồi từ gateway | NULL |
| processed_at | timestamp | Thời gian xử lý | NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

#### `shipping_addresses` - Địa chỉ giao hàng
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| user_id | bigint | Người dùng | FK users.id |
| full_name | varchar(255) | Họ tên người nhận | NOT NULL |
| phone | varchar(10) | Số điện thoại | NOT NULL |
| address_line_1 | varchar(255) | Địa chỉ dòng 1 | NOT NULL |
| address_line_2 | varchar(255) | Địa chỉ dòng 2 | NULL |
| city | varchar(100) | Thành phố | NOT NULL |
| district | varchar(100) | Quận/Huyện | NOT NULL |
| ward | varchar(100) | Phường/Xã | NOT NULL |
| postal_code | varchar(20) | Mã bưu điện | NULL |
| is_default | boolean | Địa chỉ mặc định | DEFAULT false |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

---

### 5. Bảng Marketing & Promotions

#### `vouchers` - Mã giảm giá
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| code | varchar(50) | Mã voucher | UNIQUE, NOT NULL |
| name | varchar(255) | Tên voucher | NOT NULL |
| description | text | Mô tả | NULL |
| type | enum('fixed') | Loại giảm giá | NOT NULL |
| value | decimal(10,2) | Giá trị giảm | NOT NULL |
| minimum_amount | decimal(10,2) | Đơn hàng tối thiểu | NULL |
| maximum_discount | decimal(10,2) | Giảm tối đa | NULL |
| usage_limit | int | Giới hạn sử dụng | NULL |
| used_count | int | Số lần đã dùng | DEFAULT 0 |
| usage_limit_per_user | int | Giới hạn/user | NULL |
| valid_from | timestamp | Có hiệu lực từ | NOT NULL |
| valid_to | timestamp | Có hiệu lực đến | NOT NULL |
| is_active | boolean | Trạng thái | DEFAULT true |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |

#### `voucher_usages` - Lịch sử sử dụng voucher
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| voucher_id | bigint | Voucher | FK vouchers.id |
| user_id | bigint | Người dùng | FK users.id |
| order_id | bigint | Đơn hàng | FK orders.id |
| discount_amount | decimal(10,2) | Số tiền giảm | NOT NULL |
| used_at | timestamp | Thời gian sử dụng | NOT NULL |

---

### 6. Bảng Reviews & Feedback

#### `product_reviews` - Đánh giá album
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| product_id | bigint | Album được đánh giá | FK products.id |
| user_id | bigint | Người đánh giá | FK users.id |
| order_item_id | bigint | Item đã mua | FK order_items.id, NULL |
| rating | tinyint | Điểm đánh giá (1-5) | NOT NULL |
| title | varchar(255) | Tiêu đề | NULL |
| comment | text | Nội dung bình luận | NOT NULL |
| status | enum('pending','approved','rejected') | Trạng thái | DEFAULT 'pending' |
| rejection_reason | text | Lý do từ chối (nếu rejected) | NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |
| updated_at | timestamp | Thời gian cập nhật | NOT NULL |
| deleted_at | timestamp | Soft delete | NULL |

*Ghi chú: Chỉ cho phép review khi đã mua sản phẩm (`order_item_id`). Việc mua hàng đã xác thực được suy ra khi `order_item_id IS NOT NULL`. Khi status='rejected', admin bắt buộc phải ghi lý do vào `rejection_reason` để user hiểu tại sao review bị từ chối.*

---

### 7. Bảng System

#### `email_logs` - Log gửi email
| Cột | Type | Mô tả | Constraints |
|-----|------|-------|-------------|
| id | bigint | Primary key | PK, AI |
| user_id | bigint | Người nhận | FK users.id, NULL |
| email | varchar(255) | Địa chỉ email | NOT NULL |
| subject | varchar(255) | Tiêu đề email | NOT NULL |
| template | varchar(100) | Template sử dụng | NOT NULL |
| status | enum('pending','sent','failed') | Trạng thái | DEFAULT 'pending' |
| sent_at | timestamp | Thời gian gửi | NULL |
| error_message | text | Lỗi (nếu có) | NULL |
| created_at | timestamp | Thời gian tạo | NOT NULL |

---

## Relationships & Indexes

### Primary Relationships
```sql
-- User relationships
users -> shipping_addresses (1:n)
users -> orders (1:n)
users -> product_reviews (1:n)

-- Product relationships
artists -> artist_product (1:n)
products -> artist_product (1:n)
products -> shopping_cart_items (1:n)
products -> order_items (1:n)
products -> product_reviews (1:n)

-- Order relationships
orders -> order_items (1:n)
orders -> order_status_histories (1:n)
orders -> payments (1:n)
orders -> voucher_usages (1:n)

-- Voucher relationships
vouchers -> voucher_usages (1:n)
```

### Key Indexes
```sql
-- Performance critical indexes
INDEX idx_users_role (role)
INDEX idx_products_genre (genre)
INDEX idx_products_label (label)
INDEX idx_artists_slug (slug)
INDEX idx_artists_active (is_active)
INDEX idx_artist_product_product (product_id)
INDEX idx_artist_product_artist (artist_id)
INDEX idx_artist_product_role (role)
INDEX idx_orders_user_status (user_id, status)
INDEX idx_shopping_cart_items_user (user_id)
INDEX idx_shopping_cart_items_session (session_id)
INDEX idx_product_reviews_product_status (product_id, status)
INDEX idx_vouchers_code_active (code, is_active)

-- Full-text search
FULLTEXT INDEX ft_products_search (name, description, genre, label)
FULLTEXT INDEX ft_artists_search (name, description)
```

### Constraints & Business Rules
1. **Stock Management**: Trigger để tự động cập nhật stock khi có order
2. **Voucher Validation**: Check constraints cho usage limits
3. **Review Integrity**: Chỉ cho phép 1 review per user per product
4. **Address Validation**: Chỉ 1 default address per user
5. **Order Status Flow**: Validate chuyển đổi trạng thái hợp lệ
6. **Artist-Product Relationship**: Unique constraint (product_id, artist_id) trong artist_product
7. **Artist Role Validation**: Mỗi product phải có ít nhất 1 artist với role='main'
8. **Soft Deletes**: Users, Artists, Products, Orders sử dụng soft delete để bảo toàn dữ liệu và tránh mất thông tin vĩnh viễn
9. **Review Rejection**: Khi reject review, admin bắt buộc phải nhập lý do trong `rejection_reason`

---

## Ghi chú Tối ưu hóa (Định hướng Phase 2)

*Các chiến lược dưới đây được định hướng cho các giai đoạn sau MVP.*

### Partitioning Strategy
- `orders`: Partition by year (created_at)
- `order_status_histories`: Partition by year
- `email_logs`: Partition by month (auto-archive old data)

### Caching Strategy
- Product catalog: Redis cache với TTL 1 hour
- Artist profiles: Application cache
- User sessions: Redis store
- Shopping cart items: Database + Redis hybrid
