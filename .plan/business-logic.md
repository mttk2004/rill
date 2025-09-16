# Logic Nghiệp Vụ - Rill

## Tổng quan
Tài liệu này mô tả chi tiết các quy tắc và logic nghiệp vụ cốt lõi của hệ thống Rill - cửa hàng đĩa than online, đảm bảo tính nhất quán và chính xác trong các quy trình kinh doanh.

---

## 1. Quản lý Người dùng (User Management)

### 1.1 Đăng ký & Xác thực
```
Business Rules:
- Email phải unique trong hệ thống
- Mật khẩu tối thiểu 8 ký tự, có chữ hoa, chữ thường, số
- Tự động gán role "customer" khi đăng ký
- Gửi email xác thực sau khi đăng ký thành công
- Tài khoản chưa verify vẫn có thể đăng nhập nhưng bị giới hạn chức năng
```

### 1.2 Phân quyền (Authorization)
```
Roles & Permissions:

ADMIN:
- Toàn quyền truy cập hệ thống
- Quản lý products và artists
- Xem orders, payments, analytics
- Quản lý users và reviews

CUSTOMER:
- Xem catalog sản phẩm
- Quản lý profile và shipping addresses
- Tạo và theo dõi orders
- Viết reviews cho sản phẩm đã mua
- Sử dụng vouchers

GUEST (chưa đăng nhập):
- Xem catalog sản phẩm (read-only)
- Thêm sản phẩm vào cart (session-based)
- Không thể checkout
```

### 1.3 Quản lý Profile
```
Validation Rules:
- Họ và tên: bắt buộc, string, max:255
- Số điện thoại: format Việt Nam (03x, 05x, 07x, 08x, 09x)
- Ngày sinh: không được lớn hơn ngày hiện tại
- Avatar: file image, tối đa 2MB
- Chỉ có thể có 1 địa chỉ mặc định
```

---

## 2. Quản lý Sản phẩm (Product Management)

### 2.1 Catalog Structure (ĐƠN GIẢN HÓA HOÀN TOÀN CHO MVP)
```
Product Attributes (SIÊU ĐƠN GIẢN):
- Artists: Many-to-Many relationship qua bảng artist_product
- Genre và Label: cột string trong products table (không normalize)
- Không có categories/brands tables
- Admin nhập text trực tiếp cho genre và label

Filtering & Search:
- Filter by genre (string matching)
- Filter by label (string matching)
- Filter by artist (qua relationship)
- Full-text search across name, description, genre, label
```

### 2.2 Inventory Management
```
Stock Rules:
- Stock quantity không được âm
- Khi stock = 0, product status = "out_of_stock"
- Khi stock <= min_stock_level, gửi alert đến admin
- Update stock khi order confirmed

Price Management:
- Price > 0 (bắt buộc)
- Cost price <= Price (nếu có)
- Compare price > Price (để hiển thị discount)
- Tự động tính % discount = (compare_price - price) / compare_price * 100
```

### 2.3 Product Visibility (ĐƠN GIẢN HÓA CHO MVP)
```
Display Rules:
- Status = "active"
- Stock > 0 (không có backorder)
- Có ít nhất 1 image
- Có ít nhất 1 artist với role='main'

SEO & URLs (ĐƠN GIẢN HÓA):
- Slug auto-generate từ name, unique
- Meta title/description cơ bản
- Không có structured data markup (Phase 2)
```

---

## 3. Shopping Cart & Checkout

### 3.1 Cart Management (ĐƠN GIẢN HÓA)
```
Cart Rules:
- Giỏ hàng được lưu trong database. Với guest, giỏ hàng được liên kết qua `session_id`. Khi người dùng đăng nhập, giỏ hàng của session sẽ được hợp nhất và liên kết với `user_id` của họ.
- Logic hợp nhất: Các sản phẩm trong giỏ hàng của khách sẽ được thêm vào giỏ hàng của người dùng. Nếu sản phẩm đã tồn tại, số lượng sẽ được cộng dồn (tối đa là 99).
- Max quantity per item: 99 (hard limit)
- Auto-remove items khi product inactive/deleted

Stock Validation:
- Real-time stock check khi checkout (không reserve)
- Show warning nếu stock thấp
- Block checkout nếu out of stock
- Simple first-come-first-served basis
```

### 3.2 Pricing Calculation (CẬP NHẬT CHO MVP - CÁCH 1)
```
Price Calculation Logic (Dynamic Pricing Approach):
1. Khi checkout → LUÔN lấy giá mới nhất từ products table
2. shopping_cart_items.unit_price chỉ dùng để detect price changes (comparison only)
3. Item subtotal = quantity × current_product_price (từ products table)
4. Cart subtotal = sum(all item subtotals)
5. Apply voucher discount (if applicable)
6. Final total = cart subtotal - discount

Price Change Handling (Cách 1 - Đơn giản cho MVP):
├── Khi user click "Checkout" → Recalculate tất cả prices
├── So sánh current_price vs cart.unit_price (chỉ để detect changes)
├── Nếu có thay đổi → Show clear notification cho user:
│   "Giá sản phẩm [Product Name] đã thay đổi từ [Old Price] thành [New Price]"
├── User phải acknowledge price changes trước khi continue
└── Update cart với new prices sau khi user confirm

Benefits của Cách 1:
✅ Luôn đảm bảo giá chính xác tại thời điểm checkout
✅ Không có price inconsistency
✅ Simple implementation - no complex price locking
✅ Transparent cho customer về price changes
✅ Admin có thể update prices tự do mà không lo impact cart

Discount Priority (ĐƠN GIẢN HÓA):
1. Cart-level vouchers only
2. Không có product-level promotions
3. Không có category-level promotions
4. Không có user-specific vouchers
```

### 3.3 Checkout Process (CẬP NHẬT VỚI PRICE VALIDATION)
```
Checkout Validation Flow:
- User must be logged in
- Cart không được empty
- All items in stock và active
- Shipping address valid
- Payment method selected (COD cho MVP)

Pre-checkout Checks (Updated với Price Validation):
1. Verify stock availability for each item
2. **Price Reconciliation Process:**
   ├── Fetch current prices từ products table
   ├── Compare với shopping_cart_items.unit_price
   ├── Calculate price differences
   └── Generate price change notifications

3. Price Change Notification UI:
   ├── "⚠️ Giá sản phẩm đã thay đổi:"
   ├── Show side-by-side comparison table:
   │   │ Sản phẩm │ Giá cũ │ Giá mới │ Chênh lệch │
   ├── "Tổng tiền mới: [New Total]"
   └── Require user confirmation để continue

4. Post-confirmation Actions:
   ├── Update shopping_cart_items.unit_price với current prices (để lần compare sau)
   ├── Re-validate voucher với new cart total
   ├── Check shipping address format
   └── Proceed với order creation

Error Handling:
├── Out of stock → Remove item + notification
├── Price increase > 20% → Require explicit confirmation
├── Product deactivated → Remove item + notification
└── Voucher invalid với new total → Remove voucher + notification
```

### 3.4 Technical Implementation - Dynamic Pricing (NEW)
```
Backend Implementation (Laravel):

class CheckoutService
{
    public function validateCart(User $user): array
    {
        $cartItems = $user->cartItems()->with('product')->get();
        $priceChanges = [];
        $errors = [];

        foreach ($cartItems as $item) {
            // Stock validation
            if ($item->product->stock_quantity < $item->quantity) {
                $errors[] = "Sản phẩm '{$item->product->name}' chỉ còn {$item->product->stock_quantity} trong kho";
                continue;
            }

            // Price validation (Cách 1 Implementation)
            $currentPrice = $item->product->price;
            $cartPrice = $item->unit_price;

            if ($currentPrice != $cartPrice) {
                $priceChanges[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product->name,
                    'old_price' => $cartPrice,
                    'new_price' => $currentPrice,
                    'difference' => $currentPrice - $cartPrice,
                    'quantity' => $item->quantity
                ];
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'price_changes' => $priceChanges,
            'requires_confirmation' => !empty($priceChanges)
        ];
    }

    public function updateCartPrices(User $user): void
    {
        $cartItems = $user->cartItems()->with('product')->get();

        foreach ($cartItems as $item) {
            $item->update([
                'unit_price' => $item->product->price
            ]);
        }
    }
}

Frontend Implementation (React):

interface PriceChange {
    product_id: number;
    product_name: string;
    old_price: number;
    new_price: number;
    difference: number;
    quantity: number;
}

const CheckoutPriceConfirmation: React.FC<{
    priceChanges: PriceChange[];
    onConfirm: () => void;
    onCancel: () => void;
}> = ({ priceChanges, onConfirm, onCancel }) => {
    const totalDifference = priceChanges.reduce((sum, change) =>
        sum + (change.difference * change.quantity), 0
    );

    return (
        <div className="price-change-modal">
            <h3>⚠️ Giá sản phẩm đã thay đổi</h3>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá cũ</th>
                        <th>Giá mới</th>
                        <th>Chênh lệch</th>
                    </tr>
                </thead>
                <tbody>
                    {priceChanges.map(change => (
                        <tr key={change.product_id}>
                            <td>{change.product_name}</td>
                            <td>{formatPrice(change.old_price)}</td>
                            <td>{formatPrice(change.new_price)}</td>
                            <td className={change.difference > 0 ? 'text-red-600' : 'text-green-600'}>
                                {change.difference > 0 ? '+' : ''}{formatPrice(change.difference)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="total-change">
                <strong>Tổng chênh lệch: {formatPrice(totalDifference)}</strong>
            </div>
            <div className="actions">
                <button onClick={onCancel}>Quay lại giỏ hàng</button>
                <button onClick={onConfirm}>Đồng ý và tiếp tục</button>
            </div>
        </div>
    );
};

Business Rules:
├── Price changes được logged cho audit trail
├── Large price increases (>20%) require additional confirmation
├── Customers có thể cancel và review cart trước khi proceed
└── Admin dashboard shows metrics về price change impact
```

---

## 4. Order Processing

### 4.1 Order Creation
```
Order Flow:
1. Create order với status "pending"
2. Generate unique order_number (dựa trên ID, ví dụ: ORD-0000001)
3. Create order_items từ cart items
4. Deduct stock quantity
5. Clear shopping cart
6. Create payment record
7. Send order confirmation email

Order Number Format:
- Format: ORD-XXXXXXX (ví dụ: ORD-0000001)
- Sử dụng ID của đơn hàng, được pad với số 0 ở đầu để đủ 7 chữ số.
- Đơn giản, không bị race condition và đảm bảo unique.
```

### 4.2 Status Management (ĐƠN GIẢN HÓA)
```
Order Status Flow (Simplified):
pending → confirmed → shipped → delivered
    ↓
cancelled (chỉ khi status = pending)

Status Rules:
- pending: có thể cancel bởi customer/admin trong 30 phút
- confirmed: admin xác nhận và chuẩn bị hàng (không thể cancel)
- shipped: đã giao cho shipper
- delivered: khách hàng đã nhận hàng
- cancelled: đã hủy (chỉ từ pending)

Auto Status Updates:
- Admin xác nhận đơn hàng COD thủ công để đảm bảo tính xác thực trước khi giao hàng.
- Auto mark delivered sau 5 ngày kể từ shipped (phù hợp với thời gian ship nội địa VN)
- Auto cancel unconfirmed COD orders sau 24 giờ (đơn hàng chưa được admin xác nhận)
```

### 4.3 Inventory Updates (ĐƠN GIẢN HÓA CHO MVP)
```
Stock Deduction Rules:
- Deduct ngay khi order confirmed
- Không deduct cho status "pending"
- Restock khi order cancelled/refunded

Không có Backorder:
- Khi hết hàng thì không cho đặt
- Simple out-of-stock logic
- Admin cần restock manually
```

---

## 5. Payment Processing

### 5.1 Payment Methods (ĐƠN GIẢN HÓA CHO MVP)
```
Supported Methods:
1. COD (Cash on Delivery) - CHỈ METHOD DUY NHẤT CHO MVP
   - Payment status = "pending"
   - Mark as "completed" khi order delivered
   - Không cần pre-payment validation
   - Admin confirm cash received manually

Future Enhancement (Phase 2):
2. VNPay - Thêm sau khi MVP hoàn thành
3. MoMo - Thêm sau khi MVP hoàn thành
```

### 5.2 Payment Validation
```
Payment Rules:
- Amount phải match với order total
- Currency = "VND"
- Transaction ID unique (nếu có, không áp dụng cho COD)
- Auto-cancel orders nếu thanh toán COD không thành công (khách không nhận hàng)

Refund Logic (Đơn giản hóa cho MVP):
- COD: không cần action refund trên hệ thống. Việc hoàn tiền (nếu có) sẽ được xử lý thủ công.
- Các logic refund qua API sẽ được thêm ở Phase 2.
```

---

## 6. Voucher & Promotion System

### 6.1 Voucher Types (ĐƠN GIẢN HÓA)
```
Fixed Amount Only (for MVP):
- Chỉ giảm số tiền cố định (VD: 50,000 VND)
- Minimum order amount required
- Usage limit per voucher
- Usage limit per user (1 lần/user/voucher)

Percentage Discounts:
- KHÔNG implement trong MVP
- Thêm trong Phase 2

Usage Rules:
- Global usage limit (tổng số lần sử dụng)
- Per-user usage limit (1 lần/user)
- Date range validity
- Active/inactive status
- Chỉ 1 voucher per order
```

### 6.2 Voucher Validation
```
Validation Steps:
1. Voucher code exists và active
2. Within valid date range
3. Order amount >= minimum required
4. Usage limits not exceeded (global + per-user)
5. User eligible (nếu có restrictions)

Apply Discount:
1. Calculate discount amount
2. Cap với maximum_discount (nếu có)
3. Ensure discount <= order subtotal
4. Record usage trong voucher_usages table
5. Update used_count
```

### 6.3 Promotion Logic (ĐƠN GIẢN HÓA CHO MVP)
```
Stacking Rules:
- Chỉ 1 voucher per order
- Không có product promotions
- Không có category promotions
- Không có multiple promotions

Auto-apply Logic (ĐƠN GIẢN HÓA):
- Không có auto-apply promotions
- Customer phải nhập voucher code manually
- Không có notification về available promotions
```

---

## 7. Review & Rating System

### 7.1 Review Eligibility
```
Review Rules:
- Chỉ customers đã mua product mới được review
- 1 review per customer per product
- Review chỉ allowed sau khi order delivered
- Review window: 90 ngày sau delivery

Verification:
- Link review với order_item_id
- Mark as "verified_purchase"
- Display verified badge
```

### 7.2 Rating Calculation (ĐƠN GIẢN HÓA CHO MVP)
```
Product Rating:
- Average của tất cả approved reviews
- Không có weight theo verification status
- Tất cả reviews đều có weight = 1.0

Display Logic (ĐƠN GIẢN HÓA):
- Minimum 1 review to show rating
- Round to 0.5 stars
- Không có rating distribution (Phase 2)
```

### 7.3 Review Moderation (CẬP NHẬT CHO REJECTION REASON)
```
Review Moderation Workflow:
1. Customer submit review → status="pending"
2. Admin review content → approve/reject decision
3. If approved → status="approved", shows on product page
4. If rejected → status="rejected" + mandatory rejection_reason

Rejection Rules:
- Admin PHẢI nhập lý do khi reject review
- Rejection reason tối thiểu 10 ký tự, tối đa 500 ký tự
- System gửi email thông báo rejection + reason cho customer
- Customer có thể edit và resubmit review sau khi bị reject

Auto-Rejection Triggers (Phase 2):
- Spam detection (repeated content)
- Profanity filter
- Off-topic content detection
```

---

## 8. Shipping & Address Management

### 8.1 Address Validation (ĐƠN GIẢN HÓA CHO MVP)
```
Address Rules:
- Full name: required, min 2 words
- Phone: Vietnam format validation
- Address line 1: required, detailed street address
- City/District/Ward: required, free text (không validate against master data)
- Postal code: optional
- Chỉ 1 default address per user

Address Change (ĐƠN GIẢN HÓA):
- Update existing addresses
- Add new addresses (max 3 per user)
- Set new default (unset previous default)
- Cannot delete address đang được sử dụng trong orders
```

### 8.2 Shipping Cost Calculation
```
Shipping Rules: Để đơn giản, phí ship luôn là 0

Delivery Time: Để đơn giản, thời gian giao hàng là 1-4 ngày (ngẫu nhiên)
```

---

## 9. Notification System

Trong MVP, hệ thống sẽ chỉ tập trung vào các thông báo quan trọng nhất qua email. Các hệ thống thông báo trong ứng dụng (in-app) và đẩy (push) đã được loại bỏ để đơn giản hóa.
```
Automated Emails:
- Welcome email (sau registration)
- Email verification
- Order confirmation
- Payment confirmation
- Order status updates
- Delivery notification
- Review requests

Email Templates:
- Responsive HTML templates
- Vietnamese + English support
- Personalization with user data
- Unsubscribe links
```

---

## 10. Admin Dashboard & Analytics

### 10.1 Key Metrics
```
Sales Analytics:
- Revenue by period (daily/monthly/yearly)
- Order volume và average order value
- Top selling products
- Customer acquisition metrics
- Geographic sales distribution

Product Analytics:
- Product performance ranking
- Category performance
- Brand performance
- Stock levels và turnover
- Review ratings distribution

Customer Analytics:
- Customer lifetime value
- Repeat purchase rate
- Customer churn analysis
- Geographic customer distribution
```

### 10.2 Reporting
```
Automated Reports:
- Daily sales summary
- Weekly inventory status
- Monthly business review
- Quarterly customer analysis

Export Capabilities:
- CSV/Excel export
- PDF reports
- Email scheduled reports
- API access for external tools
```

---

## 11. Security & Data Protection

### 11.1 Data Security
```
Password Security:
- Bcrypt hashing với salt
- Password strength requirements
- Account lockout sau failed attempts
- Password reset với email verification

Session Management:
- Secure session tokens
- Session timeout (24 hours)
- Remember me (30 days)
- Single sign-on prevention
```

### 11.2 Data Privacy
```
GDPR Compliance:
- User consent for data processing
- Right to data access
- Right to data deletion
- Data portability
- Privacy policy compliance

PCI DSS:
- No credit card data storage
- Secure payment processing
- PCI compliant payment gateways
- Regular security audits
```

---

## 12. Performance & Scalability (Phase 2)

*Ghi chú: Các chiến lược dưới đây được định hướng cho Phase 2 sau khi MVP đã hoạt động ổn định. Trong MVP, chúng ta sẽ tập trung vào việc tối ưu hóa query và cấu trúc code tốt mà chưa cần đến các hệ thống caching phức tạp.*

### 12.1 Caching Strategy
```
Cache Layers:
- Product catalog: Redis (1 hour TTL)
- Category tree: Application cache
- User sessions: Redis
- Shopping carts: Database + Redis
- Search results: Elasticsearch

Cache Invalidation:
- Product updates: clear product cache
- Category changes: clear catalog cache
- Price changes: clear related caches
- Stock updates: real-time updates
```

### 12.2 Database Optimization
```
Query Optimization:
- Proper indexing strategy
- Database connection pooling
- Query result pagination
- N+1 query prevention
- Database query monitoring

Scaling Strategy:
- Read replicas for analytics
- Database sharding cho large datasets
- CDN for static assets
- Load balancing for high traffic
```

---

## 13. Data Management & Retention (THÊM MỚI)

### 13.1 Soft Delete Strategy
```
Soft Delete Implementation:
- Users: Soft delete để bảo toàn order history và analytics
- Products: Soft delete để maintain order_items references
- Artists: Soft delete để maintain product relationships
- Orders: Soft delete để compliance và audit trail

Business Rules for Soft Deletes:
1. Khi user request account deletion → soft delete user
2. Deleted users không thể login nhưng order history preserved
3. Deleted products không hiển thị catalog nhưng order references intact
4. Admin có thể restore soft-deleted records trong 90 ngày
5. Sau 90 ngày có thể hard delete (manual process)

Hard Delete Scenarios:
- GDPR compliance requests (immediate hard delete)
- System cleanup sau khi business rules cho phép
- Test data trong development environment
```

### 13.2 Data Recovery & Audit
```
Recovery Procedures:
- Daily backup của production database
- Point-in-time recovery capability
- Soft delete restore function trong admin panel
- Audit log cho tất cả delete operations

Audit Trail:
- Who deleted what và when
- Reason for deletion (if provided)
- Automatic notifications cho critical deletions
- Monthly report về deleted vs restored items
```

---
