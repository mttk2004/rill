# KẾ HOẠCH VIẾT LẠI TOÀN BỘ - CLEAN ARCHITECTURE

> **Mục tiêu**: Viết lại 100% Controllers và Services theo Clean Architecture
> **Backup**: `.backup/Controllers/` và `.backup/Services/`
> **Timeline**: 10-15 phases, mỗi phase 2-4 giờ

---

## 📊 PHÂN TÍCH HIỆN TRẠNG

### Services cần viết lại (21 files):
**✅ ĐÃ REFACTOR (7):**
- OrderServiceRefactored
- ProductServiceRefactored
- CartServiceRefactored
- ReviewServiceRefactored
- VoucherServiceRefactored
- AddressServiceRefactored
- AdminDashboardService

**❌ CẦN VIẾT LẠI (14):**
1. **BestSellerService** - Logic tính best sellers
2. **ContentValidationService** - Validation nội dung
3. **GHNService** - Tích hợp Giao Hàng Nhanh API
4. **OrderStatusService** - Quản lý trạng thái đơn hàng
5. **SettingService** - Quản lý settings
6. **ShippingService** - Tính phí ship
7. **ThankYouPageService** - Xử lý thank you page
8. **VnpayService** - Tích hợp VNPAY payment
9. **Dashboard/DashboardStatsService** - Thống kê dashboard
10. **Dashboard/OrderAnalyticsService** - Phân tích đơn hàng
11. **Dashboard/ProductAnalyticsService** - Phân tích sản phẩm
12. **Dashboard/RevenueAnalyticsService** - Phân tích doanh thu
13. **Responses/ServiceResponse** - (Keep, nhưng migrate sang ServiceResult)
14. **OLD Services** - OrderService, ProductService, CartService, ReviewService, VoucherService, AddressService (XÓA)

### Controllers cần viết lại (32 files):

**✅ ĐÃ REFACTOR (10):**
- Admin/ProductController
- Admin/OrderController
- Admin/VoucherController
- Admin/DashboardController
- AddressController
- CartController
- CheckoutController
- ReviewController
- Api/VoucherController
- VnpayController

**❌ CẦN VIẾT LẠI (22):**
#### Public Controllers (7):
1. **HomeController** - Trang chủ
2. **ProductController** - Danh sách & chi tiết sản phẩm
3. **OrderController** - Đơn hàng của user

#### Admin Controllers (4):
4. **Admin/ArtistController** - CRUD artists
5. **Admin/CollectionController** - CRUD collections
6. **Admin/CustomerController** - Quản lý khách hàng (đã check, chỉ cần polish)
7. **Admin/SettingController** - Cài đặt hệ thống

#### API Controllers (4):
8. **Api/AddressDataController** - API địa chỉ
9. **Api/CategoryController** - API danh mục
10. **Api/SearchController** - API tìm kiếm
11. **Api/ShippingController** - API phí ship

#### Auth Controllers (7) - GIỮ NGUYÊN:
- Auth/AuthenticatedSessionController
- Auth/ConfirmablePasswordController
- Auth/EmailVerificationNotificationController
- Auth/EmailVerificationPromptController
- Auth/NewPasswordController
- Auth/PasswordResetLinkController
- Auth/RegisteredUserController
- Auth/VerifyEmailController

#### Settings Controllers (2) - GIỮ NGUYÊN:
- Settings/PasswordController
- Settings/ProfileController

---

## 🎯 CHIẾN LƯỢC TRIỂN KHAI

### Nguyên tắc:
1. **Incremental Migration** - Làm từng module, test ngay
2. **Backward Compatible** - Giữ old code cho đến khi new code stable
3. **Zero Downtime** - App chạy được trong suốt quá trình refactor
4. **Progressive Enhancement** - Từ simple → complex

### Thứ tự ưu tiên:
1. **Critical Services** (payment, shipping, orders) → HIGH PRIORITY
2. **Admin Features** (CRUD operations) → MEDIUM PRIORITY
3. **Public Features** (browse, search) → MEDIUM PRIORITY
4. **Analytics & Reports** → LOW PRIORITY

---

## 📋 ROADMAP CHI TIẾT

### **PHASE 10: Critical Services Foundation**
**Mục tiêu**: Viết lại các services quan trọng nhất (payment, shipping, settings)

**10.1 - VnpayService → VnpayServiceRefactored**
- Repository: PaymentRepository
- Actions: CreateVnpayPayment, VerifyVnpayCallback, ProcessVnpayIPN
- DTOs: VnpayPaymentData, VnpayCallbackData
- Methods: createPaymentUrl(), verifyCallback(), processIPN()
- **Estimated**: 3h

**10.2 - ShippingService → ShippingServiceRefactored**
- Repository: Reuse existing (no DB operations needed)
- Actions: CalculateShippingFee, ValidateShippingAddress
- DTOs: ShippingCalculationData, ShippingAddressData
- Methods: calculateFee(), validateAddress(), getEstimatedDelivery()
- **Estimated**: 2h

**10.3 - SettingService → SettingServiceRefactored**
- Repository: SettingRepository
- Actions: UpdateSetting, GetSetting
- DTOs: SettingData
- Methods: get(), set(), getAll(), flush()
- **Estimated**: 2h

**Deliverables**:
- 3 refactored services
- 5 new Actions
- 4 new DTOs
- 1 new Repository (Setting)
- All payment & shipping flows working

---

### **PHASE 11: Analytics & Dashboard Services**
**Mục tiêu**: Refactor dashboard analytics services

**11.1 - DashboardStatsService → DashboardServiceRefactored (DONE)**
- Already refactored as AdminDashboardService
- ✅ Skip

**11.2 - OrderAnalyticsService → OrderAnalyticsServiceRefactored**
- Repository: OrderRepository (already exists)
- Query Builders: OrderQueryBuilder (already exists), SalesReportQueryBuilder (already exists)
- Actions: None (read-only analytics)
- Methods: getOrderTrends(), getOrdersByStatus(), getTopCustomers()
- **Estimated**: 2h

**11.3 - ProductAnalyticsService → ProductAnalyticsServiceRefactored**
- Repository: ProductRepository (already exists)
- Query Builders: ProductQueryBuilder (already exists)
- Actions: None (read-only analytics)
- Methods: getTopProducts(), getStockAlerts(), getCategoryDistribution()
- **Estimated**: 2h

**11.4 - RevenueAnalyticsService → RevenueAnalyticsServiceRefactored**
- Repository: OrderRepository (already exists)
- Query Builders: SalesReportQueryBuilder (already exists)
- Actions: None (read-only analytics)
- Methods: getTotalRevenue(), getRevenueByPeriod(), getRevenueGrowth()
- **Estimated**: 2h

**Deliverables**:
- 3 analytics services refactored
- Reuse existing repositories & query builders
- Dashboard fully functional

---

### **PHASE 12: Utility Services**
**Mục tiêu**: Refactor các utility services

**12.1 - BestSellerService → Integrate into ProductServiceRefactored**
- Method: getBestSellers() already exists
- Action: None (read-only query)
- ✅ Can be deleted after integration

**12.2 - OrderStatusService → Integrate into OrderServiceRefactored**
- Methods: updateStatus(), getStatusHistory()
- Action: UpdateOrderStatusAction (already exists)
- ✅ Can be deleted after integration

**12.3 - ContentValidationService → Standalone (Keep)**
- Pure utility, no DB operations
- ✅ Keep as is

**12.4 - GHNService → External API (Keep for now)**
- External API integration
- Refactor later if needed
- ✅ Low priority

**12.5 - ThankYouPageService → ThankYouServiceRefactored**
- Simplify logic
- Use OrderServiceRefactored
- Methods: resolveOrder(), processPaymentCallback()
- **Estimated**: 1h

**Deliverables**:
- Delete 2 redundant services
- 1 refactored service (ThankYou)
- Keep 2 utility services as-is

---

### **PHASE 13: Public Controllers - Product Browsing**
**Mục tiêu**: Refactor public product browsing

**13.1 - ProductController**
- Replace ProductService with ProductServiceRefactored
- Use ProductQueryBuilder for filtering
- Methods: index(), show()
- **Estimated**: 2h

**13.2 - HomeController**
- Use ProductServiceRefactored
- Use AdminDashboardService for stats
- Methods: index()
- **Estimated**: 1h

**Deliverables**:
- 2 public controllers refactored
- Homepage & product pages working

---

### **PHASE 14: Public Controllers - User Orders**
**Mục tiêu**: Refactor user order management

**14.1 - OrderController (Public)**
- Use OrderServiceRefactored
- Use OrderQueryBuilder
- Methods: index(), show(), cancel()
- **Estimated**: 2h

**Deliverables**:
- User order management working
- Order history, details, cancellation

---

### **PHASE 15: Admin Controllers - Content Management**
**Mục tiêu**: Refactor admin CRUD controllers

**15.1 - Admin/ArtistController**
- Repository: ArtistRepository (NEW)
- Actions: CreateArtist, UpdateArtist, DeleteArtist
- DTOs: ArtistData
- Methods: index(), store(), update(), destroy()
- **Estimated**: 3h

**15.2 - Admin/CollectionController**
- Repository: CollectionRepository (NEW)
- Actions: CreateCollection, UpdateCollection, DeleteCollection
- DTOs: CollectionData
- Methods: index(), store(), update(), destroy()
- **Estimated**: 3h

**15.3 - Admin/SettingController**
- Use SettingServiceRefactored
- Methods: index(), update()
- **Estimated**: 1h

**Deliverables**:
- 3 admin controllers refactored
- 2 new repositories
- 6 new actions
- 2 new DTOs

---

### **PHASE 16: API Controllers**
**Mục tiêu**: Refactor API endpoints

**16.1 - Api/SearchController**
- Use ProductServiceRefactored
- Use ProductQueryBuilder
- Methods: search(), suggestions()
- **Estimated**: 1.5h

**16.2 - Api/AddressDataController**
- Pure data controller (provinces, districts, wards)
- Keep as is or simplify
- **Estimated**: 0.5h

**16.3 - Api/CategoryController**
- Use ProductRepository
- Methods: index(), show()
- **Estimated**: 1h

**16.4 - Api/ShippingController**
- Use ShippingServiceRefactored
- Methods: calculate(), validate()
- **Estimated**: 1h

**Deliverables**:
- 4 API controllers refactored
- All API endpoints working

---

### **PHASE 17: Cleanup & Optimization**
**Mục tiêu**: Dọn dẹp code cũ, optimize performance

**17.1 - Delete Old Services**
- Remove all deprecated services
- Update all imports
- **Estimated**: 1h

**17.2 - Service Provider Cleanup**
- Ensure all bindings registered
- Remove unused bindings
- **Estimated**: 0.5h

**17.3 - Testing & Validation**
- Run full test suite
- Test critical flows
- Fix any breaking changes
- **Estimated**: 2h

**17.4 - Documentation**
- Update architecture docs
- Create migration guide
- Document new patterns
- **Estimated**: 1h

**Deliverables**:
- Clean codebase
- All tests passing
- Complete documentation

---

## 📈 PROGRESS TRACKING

### Summary:
- **Phase 10**: Critical Services (7h)
- **Phase 11**: Analytics (6h)
- **Phase 12**: Utilities (1h)
- **Phase 13**: Public Product (3h)
- **Phase 14**: Public Orders (2h)
- **Phase 15**: Admin CRUD (7h)
- **Phase 16**: API Controllers (4h)
- **Phase 17**: Cleanup (4.5h)

**Total Estimated**: ~34.5 hours (4-5 working days)

### Current Status:
- ✅ Phases 1-9: Foundation & Initial Refactoring (COMPLETE)
- 🔄 Phase 10-17: Complete Rewrite (PENDING)

---

## 🎯 SUCCESS CRITERIA

1. **100% Controllers Refactored** - All use Clean Architecture
2. **0 Deprecated Services** - All old services removed
3. **All Tests Passing** - No broken functionality
4. **Performance Maintained** - No performance regression
5. **Code Coverage >80%** - All critical paths tested
6. **Documentation Complete** - Clear architecture guide

---

## 🚀 NEXT STEPS

**Immediate Action**:
1. Start Phase 10.1: VnpayServiceRefactored
2. Create VnpayRepository
3. Create payment Actions & DTOs
4. Update VnpayController to use new service

**Confirm to proceed?**
