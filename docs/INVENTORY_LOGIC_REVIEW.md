# 📦 ĐÁNH GIÁ LOGIC QUẢN LÝ TỒN KHO & ĐỐN HÀNG - RILL

## 🔍 TỔNG QUAN

Đây là bản đánh giá chi tiết về logic quản lý tồn kho, xử lý đơn hàng và các race conditions trong hệ thống Rill.

---

## ✅ NHỮNG GÌ ĐÃ HOẠT ĐỘNG TỐT

### 1. **Hủy đơn hàng - Stock Restoration** ✅
**File:** `app/Actions/Order/CancelOrderAction.php`

```php
// Khi hủy đơn, stock được khôi phục
if ($restoreStock) {
    foreach ($order->items as $item) {
        $this->productRepository->increaseStock(
            $item->product_id,
            $item->quantity
        );
    }
}
```

**✅ Logic đúng:**
- Khi đơn hàng bị hủy, số lượng sản phẩm **được hoàn trả** vào kho
- Chỉ cho phép hủy đơn ở trạng thái: `PENDING`, `CONFIRMED`
- Không cho phép hủy khi đơn đã: `SHIPPING`, `DELIVERED`, `CANCELLED`
- Voucher usage count cũng được giảm lại

---

### 2. **Tạo đơn hàng - Immediate Stock Deduction** ✅
**File:** `app/Actions/Order/CreateOrderAction.php`

```php
// Trừ stock NGAY KHI TẠO ĐƠN (status = PENDING)
foreach ($data->items as $item) {
    $this->productRepository->decreaseStock(
        $item['product_id'],
        $item['quantity']
    );
}
```

**✅ Logic đúng:**
- Stock bị trừ **NGAY** khi đơn hàng được tạo (status = PENDING)
- KHÔNG chờ đến khi đơn được xác nhận (CONFIRMED)
- Điều này **đúng** vì:
  - Ngăn overselling (bán quá số lượng tồn kho)
  - Reserve stock cho khách hàng đã đặt
  - Nếu đơn bị hủy, stock sẽ được hoàn trả

---

### 3. **Stock Validation Before Checkout** ✅
**File:** `app/Services/CartService.php`

```php
public function validateCartStockBeforeCheckout(int $userId): void
{
    foreach ($cartItems as $item) {
        if ($item->quantity > $item->product->stock_quantity) {
            throw new \Exception(
                "Sản phẩm '{$item->product->name}' chỉ còn {$item->product->stock_quantity}"
            );
        }
    }
}
```

**✅ Logic đúng:**
- Validate stock trước khi checkout
- Được gọi trong `CheckoutController::store()`
- Ngăn người dùng checkout với số lượng không hợp lệ

---

## ⚠️ CÁC VẤN ĐỀ CẦN KHẮC PHỤC

### 🚨 **VẤN ĐỀ NGHIÊM TRỌNG #1: Race Condition khi giảm stock**

**File:** `app/Repositories/Eloquent/ProductRepository.php`

```php
public function decreaseStock(int $productId, int $quantity): bool
{
    return $this->model
        ->where('id', $productId)
        ->where('stock_quantity', '>=', $quantity)  // ❌ KHÔNG AN TOÀN!
        ->decrement('stock_quantity', $quantity);
}
```

**❌ Vấn đề:**
Khi 2 người mua cùng lúc:
1. User A: Check stock = 5, đặt 3 cái
2. User B: Check stock = 5, đặt 3 cái
3. Cả 2 đều PASS validation
4. Kết quả: Stock = -1 (OVERSELLING!)

**🔧 Giải pháp:**

```php
public function decreaseStock(int $productId, int $quantity): bool
{
    DB::beginTransaction();
    try {
        // LOCK ROW để ngăn race condition
        $product = $this->model
            ->lockForUpdate()  // ✅ CRITICAL!
            ->find($productId);

        if (!$product || $product->stock_quantity < $quantity) {
            throw new \Exception('Insufficient stock');
        }

        $product->decrement('stock_quantity', $quantity);

        DB::commit();
        return true;
    } catch (\Exception $e) {
        DB::rollBack();
        throw $e;
    }
}
```

---

### 🚨 **VẤN ĐỀ NGHIÊM TRỌNG #2: CreateOrderAction thiếu row locking**

**File:** `app/Actions/Order/CreateOrderAction.php`

```php
// ❌ Validate và decrease stock KHÔNG ĐƯỢC LOCK
foreach ($data->items as $item) {
    $product = $products->firstWhere('id', $item['product_id']);

    if ($product->stock_quantity < $item['quantity']) {
        return $this->error("Insufficient stock");
    }
}

// ❌ Giữa validate và decrease có thể có người khác mua
foreach ($data->items as $item) {
    $this->productRepository->decreaseStock(
        $item['product_id'],
        $item['quantity']
    );
}
```

**🔧 Giải pháp:**

```php
public function execute(CreateOrderData $data): ServiceResult
{
    return $this->transaction(function () use ($data) {
        // ✅ LOCK TẤT CẢ SẢN PHẨM TRƯỚC
        $productIds = array_column($data->items, 'product_id');
        $products = $this->productRepository->model
            ->lockForUpdate()  // ✅ CRITICAL!
            ->whereIn('id', $productIds)
            ->get();

        // Validate stock với data đã được lock
        foreach ($data->items as $item) {
            $product = $products->firstWhere('id', $item['product_id']);

            if (!$product || $product->stock_quantity < $item['quantity']) {
                throw new \Exception("Insufficient stock for: {$item['product_id']}");
            }
        }

        // Decrease stock an toàn
        foreach ($data->items as $item) {
            $product = $products->firstWhere('id', $item['product_id']);
            $product->decrement('stock_quantity', $item['quantity']);
        }

        // Tạo order...
    });
}
```

---

### ⚠️ **VẤN ĐỀ #3: AddToCart không lock row**

**File:** `app/Actions/Cart/AddToCartAction.php`

```php
// ❌ Chỉ check stock, không lock
if ($data->quantity > $product->stock_quantity) {
    return ServiceResult::error("Chỉ còn {$product->stock_quantity}");
}
```

**Ảnh hưởng:** Ít nghiêm trọng hơn vì cart chưa reserve stock
- Người dùng có thể thêm vào cart nhiều hơn stock
- Nhưng sẽ bị reject ở bước checkout
- **KHÔNG CẦN FIX** nếu validate tốt ở checkout

---

### ⚠️ **VẤN ĐỀ #4: Product Model có lockForUpdate nhưng không được sử dụng**

**File:** `app/Models/Product.php`

```php
public function decreaseStock(int $quantity): void
{
    // ✅ ĐÃ CÓ lockForUpdate
    $product = self::lockForUpdate()->find($this->id);

    if ($product->stock_quantity < $quantity) {
        throw new \Exception("Insufficient stock");
    }

    $product->decrement('stock_quantity', $quantity);
}
```

**Vấn đề:** Method này TỐT nhưng KHÔNG ĐƯỢC SỬ DỤNG!
- `CreateOrderAction` gọi `$this->productRepository->decreaseStock()` (không lock)
- KHÔNG gọi `$product->decreaseStock()` (có lock)

**🔧 Giải pháp:** Sử dụng Product model method thay vì repository

---

## 📋 DANH SÁCH CẦN KHẮC PHỤC

### 🔴 **CRITICAL (Phải fix ngay):**

1. **Thêm `lockForUpdate()` vào `ProductRepository::decreaseStock()`**
   - File: `app/Repositories/Eloquent/ProductRepository.php`
   - Impact: Ngăn overselling khi 2 người mua cùng lúc

2. **Lock rows trong `CreateOrderAction` trước khi validate**
   - File: `app/Actions/Order/CreateOrderAction.php`
   - Impact: Ngăn race condition giữa validate và decrease

3. **Sử dụng `Product::decreaseStock()` thay vì repository**
   - Hoặc refactor repository để có lock
   - Impact: Tận dụng logic đã có của Model

### 🟡 **MEDIUM (Nên cải thiện):**

4. **Thêm idempotency key cho CreateOrder**
   - Ngăn tạo trùng đơn khi user submit nhiều lần
   - Store idempotency key trong session/cache

5. **Thêm stock reservation mechanism**
   - Reserve stock khi user vào checkout (15 phút)
   - Auto-release nếu không hoàn tất
   - Phức tạp nhưng UX tốt hơn

6. **Database constraints**
   - `CHECK (stock_quantity >= 0)` trong migration
   - Ngăn stock âm ở database level

### 🟢 **LOW (Nice to have):**

7. **Audit log cho stock changes**
   - Track mọi thay đổi stock (who, when, why)
   - Giúp debug và prevent fraud

8. **Stock alerts**
   - Email/notification khi stock < min_stock_level
   - Admin dashboard warning

---

## 🎯 PRIORITY IMPLEMENTATION PLAN

### **Phase 1: Fix Critical Issues (1-2 ngày)**
- [ ] Add `lockForUpdate()` to `ProductRepository::decreaseStock()`
- [ ] Lock rows in `CreateOrderAction` before validation
- [ ] Test race conditions với concurrent requests
- [ ] Add database constraint `CHECK (stock_quantity >= 0)`

### **Phase 2: Improve Reliability (2-3 ngày)**
- [ ] Implement idempotency for order creation
- [ ] Add comprehensive logging for stock operations
- [ ] Create stock audit trail table
- [ ] Add unit tests for race conditions

### **Phase 3: Advanced Features (Optional)**
- [ ] Stock reservation system
- [ ] Real-time stock sync với external systems
- [ ] Predictive stock alerts

---

## 🧪 TEST CASES CẦN VIẾT

```php
// Test: Concurrent order creation
test('prevents overselling when two users buy simultaneously', function () {
    $product = Product::factory()->create(['stock_quantity' => 1]);

    // Simulate 2 concurrent requests
    $promises = [
        async(fn() => createOrder($product, quantity: 1)),
        async(fn() => createOrder($product, quantity: 1)),
    ];

    $results = await($promises);

    // Only one should succeed
    expect($results->filter(fn($r) => $r->success))->toHaveCount(1);
    expect($product->fresh()->stock_quantity)->toBe(0);
});

// Test: Cancel order restores stock
test('restores stock when order is cancelled', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);
    $order = Order::factory()->create([...]);

    OrderItem::create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    expect($product->fresh()->stock_quantity)->toBe(7);

    $order->cancel();

    expect($product->fresh()->stock_quantity)->toBe(10);
});
```

---

## 📊 HIỆN TRẠNG TỔNG QUAN

| Chức năng | Trạng thái | Ghi chú |
|-----------|-----------|---------|
| Stock deduction on order | ✅ Đúng | Trừ ngay khi tạo đơn |
| Stock restoration on cancel | ✅ Đúng | Hoàn trả khi hủy |
| Checkout validation | ✅ Đúng | Validate trước checkout |
| Race condition protection | ❌ Thiếu | CRITICAL - cần fix |
| Row locking | ⚠️ Một phần | Có trong Model, chưa dùng |
| Concurrent order handling | ❌ Thiếu | Có thể overselling |
| Idempotency | ❌ Chưa có | Có thể tạo trùng đơn |
| Stock audit trail | ❌ Chưa có | Khó debug |

---

## 🔗 FILES CẦN CHỈNH SỬA

1. `app/Repositories/Eloquent/ProductRepository.php` - Add lockForUpdate
2. `app/Actions/Order/CreateOrderAction.php` - Lock before validate
3. `app/Actions/Cart/AddToCartAction.php` - Optional: improve validation
4. `database/migrations/*_create_products_table.php` - Add CHECK constraint
5. `tests/Feature/OrderConcurrencyTest.php` - NEW: Test race conditions

---

## 💡 KẾT LUẬN

**Điểm mạnh:**
- Logic tổng thể đúng (trừ ngay, hoàn trả khi hủy)
- Có validation ở nhiều layer
- Code structure tốt (Action pattern, Repository)

**Điểm yếu nghiêm trọng:**
- **Race condition** - 2 người có thể mua cùng lúc và gây overselling
- Thiếu row locking ở các thao tác quan trọng
- Model có lock nhưng không được sử dụng

**Khuyến nghị:**
Fix ngay 2 vấn đề CRITICAL (#1, #2) trước khi production.
Các vấn đề khác có thể cải thiện dần.
