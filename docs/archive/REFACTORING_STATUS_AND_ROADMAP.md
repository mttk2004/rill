# Clean Architecture Refactoring - Assessment & Roadmap

## Current Status Overview

### ✅ Completed (Phase 1-6)

**Foundation Layer:**
- BaseRepository, BaseData, ServiceResult, BaseAction
- RepositoryServiceProvider

**Repositories (3):**
- ProductRepository (~350 lines)
- OrderRepository (~300 lines)
- UserRepository (~200 lines)

**DTOs (9):**
- Order: CreateOrderData, UpdateOrderData, OrderFilterData
- Product: CreateProductData, UpdateProductData, ProductFilterData
- Payment: PaymentData
- User: UserData
- Additional: Money, DateRange, Address (Value Objects)

**Actions (8):**
- Order: CreateOrderAction, UpdateOrderStatusAction, CancelOrderAction
- Product: CreateProductAction, UpdateProductAction, UpdateProductStockAction
- Payment: ProcessPaymentAction, RefundPaymentAction

**Query Builders (4):**
- ProductQueryBuilder (~380 lines)
- OrderQueryBuilder (~370 lines)
- SalesReportQueryBuilder (~300 lines)
- UserQueryBuilder (~199 lines)

**Refactored Services (3):**
- OrderServiceRefactored (~242 lines) - ✅ Using Actions
- ProductServiceRefactored (~254 lines) - ✅ Using Actions
- AdminDashboardService (~310 lines) - ✅ Using Query Builders

**Updated Controllers (4):**
- CheckoutController - ✅ Uses OrderServiceRefactored
- VnpayController - ✅ Uses OrderServiceRefactored
- Admin\OrderController - ✅ Uses OrderServiceRefactored
- Admin\DashboardController - ✅ Uses AdminDashboardService

---

## ❌ Services NOT Refactored Yet (11)

### High Priority (Complex Business Logic)

#### 1. **CartService** (~238 lines)
**Current State:** Direct model access, session handling
**Usage:** CartController, ProductController, ShippingController (API)
**Complexity:** Medium
**Business Logic:**
- Add/update/remove items
- Cart validation
- Stock checking
- Guest vs authenticated user handling
- Cart merging on login

**Refactoring Needs:**
- Create CartRepository
- Create Actions: AddToCartAction, UpdateCartItemAction, RemoveFromCartAction, MergeCartAction
- Create CartData DTO
- Handle session vs database storage

---

#### 2. **ReviewService** (~193 lines)
**Current State:** Direct model access, file uploads
**Usage:** ReviewController
**Complexity:** Medium
**Business Logic:**
- Create/update/delete reviews
- Verify purchase eligibility
- Image upload handling
- Review moderation (approve/reject)
- Average rating calculations

**Refactoring Needs:**
- Create ReviewRepository
- Create Actions: CreateReviewAction, UpdateReviewAction, DeleteReviewAction, ModerateReviewAction
- Create ReviewData DTO
- Use ProductRepository for rating updates

---

#### 3. **ProductAdminService** (~230 lines)
**Current State:** Partially refactored (uses ProductRepository)
**Usage:** Admin\ProductController
**Complexity:** Low (already 50% refactored)
**Current Methods:**
- `buildProductQuery()` - Can use ProductQueryBuilder
- `enrichProductsWithSalesData()` - Keep as utility
- `getProductStats()` - ✅ Already uses repository
- `syncArtists()` - Keep as utility
- `handleImageUpload()` - Can move to ProductServiceRefactored

**Refactoring Needs:**
- Replace `buildProductQuery()` with ProductQueryBuilder
- Move `handleImageUpload()` to ProductServiceRefactored
- Keep utility methods (syncArtists, enrichProductsWithSalesData)

---

#### 4. **VoucherService** (~unknown lines)
**Current State:** Unknown
**Usage:** Admin\VoucherController, Api\VoucherController, OrderServiceRefactored (validation)
**Complexity:** Medium
**Business Logic:**
- Create/update/delete vouchers
- Validate voucher eligibility
- Apply discount calculations
- Usage tracking

**Refactoring Needs:**
- Create VoucherRepository
- Create Actions: CreateVoucherAction, ApplyVoucherAction, ValidateVoucherAction
- Create VoucherData DTO

---

### Medium Priority (Utility Services)

#### 5. **ProductService** (~448 lines)
**Current State:** Public display service
**Usage:** ProductController (public catalog)
**Complexity:** Medium
**Purpose:** Product listing, filtering, search for public users
**Methods:**
- `getProducts()` - complex filtering
- `applyFilters()` - search, genre, label, artist
- `applySorting()` - various sort options
- `getDataForShowPage()` - product detail page
- `transformProduct()` - data transformation

**Decision:**
- This is a **read-only display service**
- Already uses complex queries
- **Recommendation:** Can use ProductQueryBuilder for queries, but keep as-is for now
- Not critical for Phase 6 (no write operations)

---

#### 6. **AddressService** (~unknown lines)
**Current State:** Unknown
**Usage:** AddressController
**Complexity:** Low
**Business Logic:**
- CRUD for shipping addresses
- Set default address

**Refactoring Needs:**
- Create AddressRepository (simple CRUD)
- Create AddressData DTO
- Optional: Create Actions if validation is complex

---

#### 7. **OrderStatusService** (~unknown lines)
**Current State:** Unknown
**Usage:** Unknown
**Purpose:** Likely status transitions and history

**Analysis Needed:** Check if redundant with UpdateOrderStatusAction

---

### Low Priority (External/Infrastructure Services)

#### 8. **ShippingService**
**Current State:** External API integration (GHN)
**Purpose:** Calculate shipping fees, create shipments
**Refactoring:** **NOT NEEDED** - Infrastructure service, keep as-is

#### 9. **VnpayService**
**Current State:** Payment gateway integration
**Purpose:** Create payment URLs, verify signatures
**Refactoring:** **NOT NEEDED** - Infrastructure service, keep as-is

#### 10. **GHNService**
**Current State:** Shipping API wrapper
**Purpose:** GHN (Giao Hàng Nhanh) API calls
**Refactoring:** **NOT NEEDED** - Infrastructure service, keep as-is

#### 11. **SettingService**
**Current State:** System settings management
**Purpose:** Get/update application settings
**Refactoring:** **LOW PRIORITY** - Can use Repository pattern if complex

#### 12. **ContentValidationService**
**Current State:** Content moderation
**Purpose:** Validate user-generated content
**Refactoring:** **NOT NEEDED** - Utility service, keep as-is

#### 13. **ThankYouPageService**
**Current State:** Order confirmation page data
**Purpose:** Prepare data for thank you page
**Refactoring:** **LOW PRIORITY** - Display service, can refactor later

#### 14. **BestSellerService**
**Current State:** Best seller calculations
**Purpose:** Calculate best selling products
**Refactoring:** **DONE** - SalesReportQueryBuilder has `getTopProducts()`

---

## 🔄 Controllers NOT Updated Yet

### Admin Controllers

#### Admin\ProductController
**Current:** Uses ProductAdminService
**Action:** Update to use ProductServiceRefactored + ProductQueryBuilder
**Methods to update:**
- `index()` - Use ProductQueryBuilder
- `store()` - Use CreateProductAction
- `update()` - Use UpdateProductAction
- `destroy()` - Keep as-is (soft delete)

#### Admin\VoucherController
**Current:** Uses VoucherService
**Action:** Refactor VoucherService first, then update controller

#### Admin\CustomerController
**Current:** Unknown
**Action:** Check if uses UserRepository, update if needed

#### Admin\SettingController
**Current:** Uses SettingService
**Action:** Low priority

---

### Public Controllers

#### CartController
**Current:** Uses CartService
**Action:** Refactor CartService first, then update controller

#### ReviewController
**Current:** Uses ReviewService
**Action:** Refactor ReviewService first, then update controller

#### ProductController
**Current:** Uses ProductService
**Action:** Optional - can use ProductQueryBuilder but not critical

#### AddressController
**Current:** Uses AddressService
**Action:** Refactor AddressService first, then update controller

#### OrderController
**Current:** Direct model access
**Action:** Can use OrderServiceRefactored for queries (getUserOrders)

---

### API Controllers

#### Api\VoucherController
**Current:** Uses VoucherService
**Action:** Refactor VoucherService first, then update controller

#### Api\ShippingController
**Current:** Uses CartService, ShippingService
**Action:** Update when CartService refactored

---

## 📋 Recommended Roadmap

### Phase 7: Cart & Review Services (HIGH PRIORITY)

**Goal:** Refactor services with complex business logic used by public users

**Tasks:**
1. Create CartRepository with methods:
   - `getCartItems(userId, sessionId)`
   - `addItem(data)`, `updateItem(id, quantity)`, `removeItem(id)`
   - `clearCart(userId, sessionId)`
   - `mergeCart(sessionId, userId)`

2. Create Cart Actions:
   - CreateCartItemAction
   - UpdateCartItemAction
   - RemoveCartItemAction
   - MergeCartAction (guest → authenticated)

3. Create CartServiceRefactored:
   - Uses CartRepository
   - Delegates to Actions
   - Returns ServiceResult

4. Create ReviewRepository:
   - `getReviews(productId, filters)`
   - `getUserReview(userId, productId)`
   - `canUserReview(userId, productId)`
   - `createReview(data)`, `updateReview(id, data)`

5. Create Review Actions:
   - CreateReviewAction (with image upload)
   - UpdateReviewAction
   - DeleteReviewAction
   - ModerateReviewAction (admin)

6. Create ReviewServiceRefactored:
   - Uses ReviewRepository, ProductRepository
   - Delegates to Actions

7. Update Controllers:
   - CartController → CartServiceRefactored
   - ReviewController → ReviewServiceRefactored
   - Api\ShippingController → CartServiceRefactored

**Estimated:** 6-8 hours

---

### Phase 8: Voucher & Address Services (MEDIUM PRIORITY)

**Goal:** Refactor CRUD-heavy services

**Tasks:**
1. Create VoucherRepository:
   - CRUD operations
   - `validateVoucher(code, amount, userId)`
   - `applyVoucher(voucherId, orderId)`
   - `getActiveVouchers()`

2. Create Voucher Actions:
   - CreateVoucherAction
   - UpdateVoucherAction
   - ApplyVoucherAction (with validation)

3. Create VoucherServiceRefactored:
   - Uses VoucherRepository
   - Delegates to Actions

4. Create AddressRepository (simple CRUD)

5. Create AddressServiceRefactored

6. Update Controllers:
   - Admin\VoucherController
   - Api\VoucherController
   - AddressController

**Estimated:** 4-5 hours

---

### Phase 9: Complete Admin Controllers (CLEANUP)

**Goal:** Update remaining admin controllers to use refactored services

**Tasks:**
1. Update Admin\ProductController:
   - Replace ProductAdminService.buildProductQuery() with ProductQueryBuilder
   - Use ProductServiceRefactored for create/update
   - Move image upload to ProductServiceRefactored

2. Check Admin\CustomerController:
   - Verify if uses UserRepository
   - Update if needed

3. Clean up unused services:
   - Remove old OrderService
   - Remove old ProductService (if public controller migrated)
   - Remove ProductAdminService (merge into ProductServiceRefactored)

**Estimated:** 2-3 hours

---

### Phase 10: Public Display Services (OPTIONAL)

**Goal:** Refactor read-only display services

**Tasks:**
1. Update ProductController:
   - Use ProductQueryBuilder for filtering
   - Keep ProductService or create ProductDisplayService

2. Update OrderController:
   - Use OrderServiceRefactored for getUserOrders()

3. Consider: Create separate display services vs using refactored services

**Estimated:** 2-3 hours

---

## 🎯 Priority Matrix

### MUST DO (Phase 7-8):
- ✅ CartService → CartServiceRefactored
- ✅ ReviewService → ReviewServiceRefactored
- ✅ VoucherService → VoucherServiceRefactored
- ✅ AddressService → AddressServiceRefactored
- ✅ Update 6 controllers (Cart, Review, Address, Admin Voucher, API endpoints)

### SHOULD DO (Phase 9):
- ✅ Admin\ProductController updates
- ✅ Clean up old services
- ✅ Remove redundant code

### COULD DO (Phase 10):
- ✅ ProductService refactoring
- ✅ Public OrderController updates
- ✅ Display service optimization

### WON'T DO:
- ❌ ShippingService (external API)
- ❌ VnpayService (payment gateway)
- ❌ GHNService (shipping API)
- ❌ ContentValidationService (utility)

---

## 📊 Metrics

### Current Progress:
- **Services Refactored:** 3/14 (21%)
- **Controllers Updated:** 4/20+ (20%)
- **Repositories Created:** 3/6 needed (50%)
- **Actions Created:** 8/15+ needed (53%)
- **Query Builders:** 4/4 needed (100%) ✅

### After Phase 7-8:
- **Services Refactored:** 7/14 (50%)
- **Controllers Updated:** 10/20+ (50%)
- **Repositories Created:** 6/6 needed (100%) ✅

### After Phase 9-10:
- **Services Refactored:** 10/14 (71%)
- **Controllers Updated:** 15/20+ (75%)
- **Clean Architecture Coverage:** 75%+ ✅

---

## 🚀 Next Steps

### Immediate Actions:

1. **Analyze CartService** - Check current implementation details
2. **Analyze ReviewService** - Check current implementation details
3. **Start Phase 7** - Create CartRepository and Cart Actions
4. **Test thoroughly** - Each refactored service must pass tests
5. **Update documentation** - Keep REFACTORING_ROADMAP.md updated

### Questions to Consider:

1. **Should we refactor ProductService?**
   - It's a public display service with complex logic
   - Could benefit from ProductQueryBuilder
   - But not critical (no write operations)

2. **What to do with ProductAdminService?**
   - Already 50% refactored
   - Merge into ProductServiceRefactored?
   - Or keep as separate admin-only service?

3. **Do we need separate display services?**
   - ProductService (public), ProductServiceRefactored (admin)
   - Or use ProductServiceRefactored for both?

4. **How to handle old services?**
   - Keep temporarily for backward compatibility?
   - Remove immediately after migration?

---

## 💡 Recommendations

### For Maximum Impact:

1. **Start with Phase 7** (Cart & Review)
   - Most used by public users
   - Complex business logic
   - High value for refactoring

2. **Then Phase 8** (Voucher & Address)
   - Cleaner CRUD operations
   - Good learning examples
   - Complete the core services

3. **Finally Phase 9** (Cleanup)
   - Remove old code
   - Consolidate services
   - Polish the architecture

4. **Optional Phase 10** (Display Services)
   - Only if time permits
   - Focus on Query Builders
   - Keep existing structure if working

### Best Practices:

- ✅ Test each refactored service thoroughly
- ✅ Update one controller at a time
- ✅ Keep old services until full migration
- ✅ Document breaking changes
- ✅ Update API documentation
- ✅ Create integration tests

---

## 🎯 Success Criteria

### Phase 7-8 Complete When:
- ✅ All CRUD operations use Actions
- ✅ All queries use Repositories/Query Builders
- ✅ All responses use ServiceResult
- ✅ No direct model access in services
- ✅ Controllers handle ServiceResult properly
- ✅ Tests pass for all refactored code
- ✅ Documentation updated

### Project Complete When:
- ✅ 75%+ services refactored
- ✅ 75%+ controllers updated
- ✅ All business logic in Actions
- ✅ All data access in Repositories
- ✅ Consistent architecture throughout
- ✅ Old code removed or deprecated
- ✅ Team trained on new patterns

---

**Current Phase:** Phase 6 Complete ✅
**Next Phase:** Phase 7 - Cart & Review Services
**Estimated Total Time:** 12-16 hours for Phases 7-9
**Priority:** HIGH - These services are used by public users daily
