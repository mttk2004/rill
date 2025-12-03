# 🏗️ Laravel Architecture Refactoring Roadmap - Rill Project

> **Mục tiêu**: Chuyển đổi sang Clean Architecture với SOLID principles, tăng khả năng maintain, test, và scale

---

## 📋 PHÂN TÍCH HIỆN TRẠNG

### ✅ Những gì đang tốt:
- Service Layer đã được tách riêng (ProductService, CartService, ReviewService...)
- Form Requests đã được sử dụng (StoreProductReviewRequest, UpdateVoucherRequest...)
- Resources được dùng cho API responses (OrderResource, OrderAdminResource)
- Enums cho constants (OrderStatus, PaymentStatus, PaymentMethod)
- Dependency Injection đã được áp dụng ở Controllers

### ⚠️ Vấn đề cần cải thiện:

#### 1. **Business Logic rò rỉ vào Controllers**
```php
// ❌ BAD: Logic phức tạp trong Controller
public function index(Request $request) {
    $query = Order::query()->withTrashed();

    if ($search !== '') {
        $query->where(function ($q) use ($search) {
            $q->where('order_number', 'like', "%{$search}%")
              ->orWhere('customer_name', 'like', "%{$search}%");
        });
    }
    // ... 50+ lines of query building
}
```

#### 2. **Service Classes quá lớn và làm nhiều việc**
- ProductAdminService: 500+ lines
- Kết hợp cả query building, business logic, file upload
- Vi phạm Single Responsibility Principle

#### 3. **Thiếu Repository Pattern**
- Eloquent queries rải rác khắp nơi
- Khó mock khi testing
- Khó thay đổi data source

#### 4. **Thiếu DTOs (Data Transfer Objects)**
- Truyền arrays khắp nơi
- Không type-safe
- Khó validate và document

#### 5. **Thiếu Action/Command Pattern**
- Logic phức tạp nên được tách thành các actions độc lập
- VD: CreateOrderAction, ProcessPaymentAction

#### 6. **Response Patterns không nhất quán**
```php
// Một số nơi dùng ServiceResult
$result = $this->reviewService->createReview(...);
if ($result->isError()) { ... }

// Một số nơi return trực tiếp
return $this->orderService->getOrders();
```

---

## 🎯 KIẾN TRÚC MỤC TIÊU

```
app/
├── Actions/                    # Single-purpose business actions
│   ├── Order/
│   │   ├── CreateOrderAction.php
│   │   ├── CancelOrderAction.php
│   │   └── ProcessRefundAction.php
│   ├── Product/
│   │   ├── CreateProductAction.php
│   │   └── UpdateStockAction.php
│   └── Payment/
│       ├── ProcessVNPayPaymentAction.php
│       └── VerifyPaymentAction.php
│
├── DataObjects/               # DTOs for type-safe data transfer
│   ├── OrderData.php
│   ├── ProductData.php
│   ├── FilterData.php
│   └── PaginationData.php
│
├── Domain/                    # Domain logic (optional cho large apps)
│   ├── Order/
│   │   ├── OrderAggregateRoot.php
│   │   ├── OrderStatus.php
│   │   └── OrderEvents.php
│   └── Product/
│
├── Repositories/              # Data access layer
│   ├── Contracts/
│   │   ├── OrderRepositoryInterface.php
│   │   ├── ProductRepositoryInterface.php
│   │   └── UserRepositoryInterface.php
│   └── Eloquent/
│       ├── OrderRepository.php
│       ├── ProductRepository.php
│       └── UserRepository.php
│
├── Services/                  # Orchestration services
│   ├── Order/
│   │   ├── OrderService.php          # Orchestrates actions
│   │   └── OrderQueryService.php     # Read-only queries
│   ├── Product/
│   │   ├── ProductService.php
│   │   └── ProductSearchService.php
│   └── Payment/
│       └── PaymentGatewayService.php
│
├── QueryBuilders/             # Complex query logic
│   ├── OrderQueryBuilder.php
│   ├── ProductQueryBuilder.php
│   └── ReportQueryBuilder.php
│
├── Traits/                    # Reusable behaviors
│   ├── HasFilters.php
│   ├── HasPagination.php
│   └── HasSorting.php
│
└── ValueObjects/              # Immutable value objects
    ├── Money.php
    ├── Address.php
    └── DateRange.php
```

---

## 🚀 KẾ HOẠCH TRIỂN KHAI (6 PHASES)

### **PHASE 1: Foundation Setup** (Thời gian: 3-4 giờ)
**Mục tiêu**: Tạo base classes và interfaces

#### Tasks:
1. **Tạo Base Repository Interface & Implementation**
```php
// app/Repositories/Contracts/BaseRepositoryInterface.php
interface BaseRepositoryInterface
{
    public function find(int $id): ?Model;
    public function findOrFail(int $id): Model;
    public function all(array $columns = ['*']): Collection;
    public function paginate(int $perPage = 15): LengthAwarePaginator;
    public function create(array $data): Model;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}

// app/Repositories/Eloquent/BaseRepository.php
abstract class BaseRepository implements BaseRepositoryInterface
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    // Implement interface methods...
}
```

2. **Tạo Base DTO Class**
```php
// app/DataObjects/BaseData.php
abstract class BaseData
{
    public static function fromRequest(Request $request): static
    {
        return static::from($request->validated());
    }

    public static function from(array $data): static
    {
        return new static(...$data);
    }

    public function toArray(): array
    {
        return get_object_vars($this);
    }
}
```

3. **Tạo Service Result Pattern**
```php
// app/Support/ServiceResult.php
class ServiceResult
{
    private function __construct(
        public readonly bool $success,
        public readonly mixed $data = null,
        public readonly ?string $message = null,
        public readonly ?array $errors = null
    ) {}

    public static function success(mixed $data = null, ?string $message = null): self
    {
        return new self(true, $data, $message);
    }

    public static function error(string $message, ?array $errors = null): self
    {
        return new self(false, null, $message, $errors);
    }

    public function isSuccess(): bool { return $this->success; }
    public function isError(): bool { return !$this->success; }
}
```

4. **Tạo Base Action Class**
```php
// app/Actions/BaseAction.php
abstract class BaseAction
{
    abstract public function execute(...$params): ServiceResult;

    protected function success(mixed $data = null, ?string $message = null): ServiceResult
    {
        return ServiceResult::success($data, $message);
    }

    protected function error(string $message, ?array $errors = null): ServiceResult
    {
        return ServiceResult::error($message, $errors);
    }
}
```

5. **Setup Service Container Bindings**
```php
// app/Providers/RepositoryServiceProvider.php
public function register(): void
{
    $this->app->bind(OrderRepositoryInterface::class, OrderRepository::class);
    $this->app->bind(ProductRepositoryInterface::class, ProductRepository::class);
    // ... other bindings
}
```

---

### **PHASE 2: Repository Layer** (Thời gian: 5-6 giờ)
**Mục tiêu**: Tách data access logic khỏi Services

#### Priority Order:
1. **ProductRepository** (Quan trọng nhất)
2. **OrderRepository**
3. **UserRepository**
4. **ArtistRepository**
5. **VoucherRepository**

#### Ví dụ Implementation:

```php
// app/Repositories/Contracts/ProductRepositoryInterface.php
interface ProductRepositoryInterface extends BaseRepositoryInterface
{
    public function findBySlug(string $slug): ?Product;
    public function getActive(): Collection;
    public function searchProducts(array $filters): LengthAwarePaginator;
    public function getBestSellers(int $limit = 10): Collection;
    public function updateStock(int $productId, int $quantity): bool;
}

// app/Repositories/Eloquent/ProductRepository.php
class ProductRepository extends BaseRepository implements ProductRepositoryInterface
{
    public function __construct(Product $model)
    {
        parent::__construct($model);
    }

    public function findBySlug(string $slug): ?Product
    {
        return $this->model
            ->with(['artists', 'reviews'])
            ->where('slug', $slug)
            ->where('status', 'active')
            ->first();
    }

    public function searchProducts(array $filters): LengthAwarePaginator
    {
        $query = $this->model->query();

        // Delegate to QueryBuilder for complex logic
        return app(ProductQueryBuilder::class)
            ->applyFilters($query, $filters)
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getBestSellers(int $limit = 10): Collection
    {
        return $this->model
            ->withCount(['orderItems as total_sold' => fn($q) =>
                $q->selectRaw('COALESCE(SUM(quantity), 0)')
            ])
            ->orderByDesc('total_sold')
            ->orderBy('id')
            ->limit($limit)
            ->get();
    }
}
```

#### Migration Strategy:
- Tạo Repository cho 1 model
- Refactor Service tương ứng để dùng Repository
- Test kỹ
- Chuyển sang model tiếp theo

---

### **PHASE 3: DTOs & Value Objects** (Thời gian: 4-5 giờ)
**Mục tiêu**: Type-safe data transfer

#### DTOs cần tạo:

```php
// app/DataObjects/Order/CreateOrderData.php
final readonly class CreateOrderData extends BaseData
{
    public function __construct(
        public int $userId,
        public string $customerName,
        public string $customerEmail,
        public string $customerPhone,
        public AddressData $shippingAddress,
        public PaymentMethod $paymentMethod,
        public array $items, // Collection of OrderItemData
        public ?int $voucherId = null,
        public ?string $note = null,
    ) {}

    public static function fromRequest(CreateOrderRequest $request): self
    {
        return new self(
            userId: auth()->id(),
            customerName: $request->validated('customer_name'),
            customerEmail: $request->validated('customer_email'),
            customerPhone: $request->validated('customer_phone'),
            shippingAddress: AddressData::from($request->validated('shipping_address')),
            paymentMethod: PaymentMethod::from($request->validated('payment_method')),
            items: collect($request->validated('items'))
                ->map(fn($item) => OrderItemData::from($item))
                ->toArray(),
            voucherId: $request->validated('voucher_id'),
            note: $request->validated('note'),
        );
    }
}

// app/DataObjects/Product/ProductFilterData.php
final readonly class ProductFilterData extends BaseData
{
    public function __construct(
        public ?string $search = null,
        public ?string $genre = null,
        public ?string $label = null,
        public ?string $artist = null,
        public ?string $collection = null,
        public ?int $priceMin = null,
        public ?int $priceMax = null,
        public string $sort = 'newest',
        public int $perPage = 15,
    ) {}
}

// app/ValueObjects/Money.php
final readonly class Money
{
    public function __construct(
        public int $amount, // Store in cents/smallest unit
        public string $currency = 'VND'
    ) {
        if ($amount < 0) {
            throw new InvalidArgumentException('Amount cannot be negative');
        }
    }

    public static function fromVND(int $amount): self
    {
        return new self($amount, 'VND');
    }

    public function format(): string
    {
        return number_format($this->amount, 0, ',', '.') . ' ₫';
    }

    public function add(Money $money): self
    {
        $this->ensureSameCurrency($money);
        return new self($this->amount + $money->amount, $this->currency);
    }

    public function subtract(Money $money): self
    {
        $this->ensureSameCurrency($money);
        return new self($this->amount - $money->amount, $this->currency);
    }

    private function ensureSameCurrency(Money $money): void
    {
        if ($this->currency !== $money->currency) {
            throw new InvalidArgumentException('Currency mismatch');
        }
    }
}
```

---

### **PHASE 4: Action Classes** (Thời gian: 6-8 giờ)
**Mục tiêu**: Single-responsibility business operations

#### Critical Actions:

```php
// app/Actions/Order/CreateOrderAction.php
final class CreateOrderAction extends BaseAction
{
    public function __construct(
        private OrderRepository $orderRepository,
        private ProductRepository $productRepository,
        private VoucherRepository $voucherRepository,
    ) {}

    public function execute(CreateOrderData $data): ServiceResult
    {
        DB::beginTransaction();

        try {
            // 1. Validate stock availability
            foreach ($data->items as $item) {
                $product = $this->productRepository->find($item->productId);

                if (!$product || $product->stock_quantity < $item->quantity) {
                    return $this->error("Sản phẩm {$product?->name} không đủ hàng");
                }
            }

            // 2. Calculate totals
            $subtotal = $this->calculateSubtotal($data->items);
            $discount = $this->calculateDiscount($subtotal, $data->voucherId);
            $shippingFee = $this->calculateShippingFee($data->shippingAddress);
            $total = $subtotal - $discount + $shippingFee;

            // 3. Create order
            $order = $this->orderRepository->create([
                'user_id' => $data->userId,
                'order_number' => $this->generateOrderNumber(),
                'customer_name' => $data->customerName,
                'customer_email' => $data->customerEmail,
                'customer_phone' => $data->customerPhone,
                'shipping_address' => $data->shippingAddress->toString(),
                'payment_method' => $data->paymentMethod->value,
                'subtotal' => $subtotal,
                'discount' => $discount,
                'shipping_fee' => $shippingFee,
                'total_amount' => $total,
                'note' => $data->note,
                'status' => OrderStatus::PENDING->value,
            ]);

            // 4. Create order items & update stock
            foreach ($data->items as $item) {
                $order->items()->create([
                    'product_id' => $item->productId,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                ]);

                $this->productRepository->decreaseStock($item->productId, $item->quantity);
            }

            // 5. Record voucher usage
            if ($data->voucherId) {
                $this->voucherRepository->recordUsage($data->voucherId, $data->userId);
            }

            DB::commit();

            return $this->success($order, 'Đơn hàng đã được tạo thành công');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->error('Có lỗi xảy ra khi tạo đơn hàng: ' . $e->getMessage());
        }
    }

    private function calculateSubtotal(array $items): int
    {
        return collect($items)->sum(fn($item) => $item->price * $item->quantity);
    }

    private function calculateDiscount(int $subtotal, ?int $voucherId): int
    {
        if (!$voucherId) return 0;

        $voucher = $this->voucherRepository->find($voucherId);

        return match($voucher->type) {
            'percentage' => (int)($subtotal * $voucher->value / 100),
            'fixed' => min($voucher->value, $subtotal),
            default => 0,
        };
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
    }
}

// app/Actions/Product/UpdateProductStockAction.php
final class UpdateProductStockAction extends BaseAction
{
    public function __construct(
        private ProductRepository $productRepository
    ) {}

    public function execute(int $productId, int $quantityChange, string $reason): ServiceResult
    {
        try {
            $product = $this->productRepository->findOrFail($productId);

            $newQuantity = $product->stock_quantity + $quantityChange;

            if ($newQuantity < 0) {
                return $this->error('Số lượng không đủ để thực hiện thao tác');
            }

            $this->productRepository->update($productId, [
                'stock_quantity' => $newQuantity
            ]);

            // Log stock movement
            StockMovement::create([
                'product_id' => $productId,
                'quantity' => $quantityChange,
                'reason' => $reason,
                'user_id' => auth()->id(),
            ]);

            return $this->success($product->fresh(), 'Cập nhật tồn kho thành công');

        } catch (\Exception $e) {
            return $this->error('Lỗi cập nhật tồn kho: ' . $e->getMessage());
        }
    }
}
```

#### Actions Priority List:
1. CreateOrderAction ⭐⭐⭐
2. CancelOrderAction ⭐⭐⭐
3. ProcessPaymentAction ⭐⭐⭐
4. CreateProductAction ⭐⭐
5. UpdateProductAction ⭐⭐
6. CreateReviewAction ⭐⭐
7. ApplyVoucherAction ⭐

---

### **PHASE 5: Query Builders** (Thời gian: 3-4 giờ)
**Mục tiêu**: Tách complex query logic

```php
// app/QueryBuilders/ProductQueryBuilder.php
final class ProductQueryBuilder
{
    private Builder $query;

    public function __construct()
    {
        $this->query = Product::query();
    }

    public static function make(): self
    {
        return new self();
    }

    public function applyFilters(ProductFilterData $filters): self
    {
        return $this
            ->search($filters->search)
            ->filterByGenre($filters->genre)
            ->filterByLabel($filters->label)
            ->filterByArtist($filters->artist)
            ->filterByCollection($filters->collection)
            ->filterByPriceRange($filters->priceMin, $filters->priceMax)
            ->sort($filters->sort);
    }

    public function search(?string $term): self
    {
        if (!$term) return $this;

        $this->query->where(function($q) use ($term) {
            $q->where('name', 'LIKE', "%{$term}%")
              ->orWhere('sku', 'LIKE', "%{$term}%")
              ->orWhere('description', 'LIKE', "%{$term}%")
              ->orWhereHas('artists', fn($q) =>
                  $q->where('name', 'LIKE', "%{$term}%")
              );
        });

        return $this;
    }

    public function filterByGenre(?string $genre): self
    {
        if (!$genre) return $this;

        $this->query->where('genre', $genre);
        return $this;
    }

    public function filterByPriceRange(?int $min, ?int $max): self
    {
        if ($min !== null) {
            $this->query->where('price', '>=', $min);
        }

        if ($max !== null) {
            $this->query->where('price', '<=', $max);
        }

        return $this;
    }

    public function sort(string $sort): self
    {
        match($sort) {
            'price-asc' => $this->query->orderBy('price', 'asc'),
            'price-desc' => $this->query->orderBy('price', 'desc'),
            'name-asc' => $this->query->orderBy('name', 'asc'),
            'name-desc' => $this->query->orderBy('name', 'desc'),
            'oldest' => $this->query->orderBy('created_at', 'asc'),
            default => $this->query->orderBy('created_at', 'desc'),
        };

        return $this;
    }

    public function withRelations(): self
    {
        $this->query->with(['artists', 'collections', 'reviews']);
        return $this;
    }

    public function onlyActive(): self
    {
        $this->query->where('status', 'active');
        return $this;
    }

    public function get(): Collection
    {
        return $this->query->get();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->query->paginate($perPage);
    }

    public function getQuery(): Builder
    {
        return $this->query;
    }
}

// Usage in Repository:
public function searchProducts(ProductFilterData $filters): LengthAwarePaginator
{
    return ProductQueryBuilder::make()
        ->applyFilters($filters)
        ->onlyActive()
        ->withRelations()
        ->paginate($filters->perPage);
}
```

---

### **PHASE 6: Refactor Services** (Thời gian: 5-6 giờ)
**Mục tiêu**: Services chỉ orchestrate, không chứa business logic

```php
// app/Services/Order/OrderService.php
final class OrderService
{
    public function __construct(
        private OrderRepository $orderRepository,
        private CreateOrderAction $createOrderAction,
        private CancelOrderAction $cancelOrderAction,
        private ProcessRefundAction $processRefundAction,
    ) {}

    public function createOrder(CreateOrderData $data): ServiceResult
    {
        return $this->createOrderAction->execute($data);
    }

    public function cancelOrder(int $orderId, string $reason): ServiceResult
    {
        return $this->cancelOrderAction->execute($orderId, $reason);
    }

    public function getOrder(int $orderId): ?Order
    {
        return $this->orderRepository->find($orderId);
    }

    public function getUserOrders(int $userId, ?OrderStatus $status = null): Collection
    {
        return $this->orderRepository->getUserOrders($userId, $status);
    }
}

// app/Services/Product/ProductService.php
final class ProductService
{
    public function __construct(
        private ProductRepository $productRepository,
        private CreateProductAction $createProductAction,
        private UpdateProductAction $updateProductAction,
    ) {}

    public function getProducts(ProductFilterData $filters): LengthAwarePaginator
    {
        return $this->productRepository->searchProducts($filters);
    }

    public function createProduct(CreateProductData $data): ServiceResult
    {
        return $this->createProductAction->execute($data);
    }

    public function updateProduct(int $id, UpdateProductData $data): ServiceResult
    {
        return $this->updateProductAction->execute($id, $data);
    }

    public function getBestSellers(int $limit = 10): Collection
    {
        return $this->productRepository->getBestSellers($limit);
    }
}
```

---

## 📝 BEST PRACTICES & CODING STANDARDS

### 1. **Naming Conventions**
```php
// ✅ GOOD
class CreateOrderAction extends BaseAction { }
interface OrderRepositoryInterface { }
class ProductFilterData extends BaseData { }
class Money { } // Value Object - no suffix needed

// ❌ BAD
class OrderCreator { }
class IOrderRepository { }
class ProductFilterDTO { }
class MoneyValueObject { }
```

### 2. **Service Result Pattern**
```php
// ✅ GOOD - Always return ServiceResult
public function createOrder(CreateOrderData $data): ServiceResult
{
    return $this->createOrderAction->execute($data);
}

// Controller
$result = $this->orderService->createOrder($orderData);

if ($result->isSuccess()) {
    return redirect()->route('orders.show', $result->data)
        ->with('success', $result->message);
}

return back()->with('error', $result->message)->withErrors($result->errors);
```

### 3. **Type Hints Everywhere**
```php
// ✅ GOOD
public function execute(CreateOrderData $data): ServiceResult
{
    // ...
}

// ❌ BAD
public function execute($data)
{
    // ...
}
```

### 4. **Readonly Properties (PHP 8.1+)**
```php
// ✅ GOOD - Immutable DTOs
final readonly class CreateOrderData
{
    public function __construct(
        public int $userId,
        public string $customerName,
        // ...
    ) {}
}
```

### 5. **Constructor Property Promotion**
```php
// ✅ GOOD
public function __construct(
    private OrderRepository $orderRepository,
    private CreateOrderAction $createOrderAction,
) {}

// ❌ BAD
private OrderRepository $orderRepository;

public function __construct(OrderRepository $orderRepository)
{
    $this->orderRepository = $orderRepository;
}
```

### 6. **Early Returns**
```php
// ✅ GOOD
public function execute(int $orderId): ServiceResult
{
    $order = $this->orderRepository->find($orderId);

    if (!$order) {
        return $this->error('Order not found');
    }

    if ($order->status === OrderStatus::CANCELLED) {
        return $this->error('Order already cancelled');
    }

    // Main logic here
    return $this->success($order);
}

// ❌ BAD - Nested ifs
public function execute(int $orderId): ServiceResult
{
    $order = $this->orderRepository->find($orderId);

    if ($order) {
        if ($order->status !== OrderStatus::CANCELLED) {
            // Main logic nested deep
        }
    }
}
```

### 7. **Match Expression over Switch**
```php
// ✅ GOOD
return match($voucher->type) {
    VoucherType::PERCENTAGE => (int)($subtotal * $voucher->value / 100),
    VoucherType::FIXED => min($voucher->value, $subtotal),
    default => 0,
};

// ❌ BAD
switch($voucher->type) {
    case VoucherType::PERCENTAGE:
        return (int)($subtotal * $voucher->value / 100);
    case VoucherType::FIXED:
        return min($voucher->value, $subtotal);
    default:
        return 0;
}
```

---

## 🧪 TESTING STRATEGY

### 1. **Unit Tests cho Actions**
```php
// tests/Unit/Actions/CreateOrderActionTest.php
class CreateOrderActionTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_creates_order_successfully(): void
    {
        // Arrange
        $user = User::factory()->create();
        $product = Product::factory()->create(['stock_quantity' => 10]);

        $orderData = new CreateOrderData(
            userId: $user->id,
            customerName: 'John Doe',
            // ... other data
            items: [
                new OrderItemData($product->id, 2, $product->price)
            ]
        );

        $action = app(CreateOrderAction::class);

        // Act
        $result = $action->execute($orderData);

        // Assert
        $this->assertTrue($result->isSuccess());
        $this->assertInstanceOf(Order::class, $result->data);
        $this->assertEquals(OrderStatus::PENDING, $result->data->status);

        // Verify stock decreased
        $this->assertEquals(8, $product->fresh()->stock_quantity);
    }

    public function test_it_fails_when_insufficient_stock(): void
    {
        // Arrange
        $product = Product::factory()->create(['stock_quantity' => 1]);

        $orderData = new CreateOrderData(
            // ... data with quantity = 5
        );

        $action = app(CreateOrderAction::class);

        // Act
        $result = $action->execute($orderData);

        // Assert
        $this->assertTrue($result->isError());
        $this->assertStringContainsString('không đủ hàng', $result->message);
    }
}
```

### 2. **Feature Tests cho Controllers**
```php
// tests/Feature/Order/CreateOrderTest.php
class CreateOrderTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_order(): void
    {
        $user = User::factory()->create();
        $product = Product::factory()->create();

        $response = $this->actingAs($user)->post('/orders', [
            'customer_name' => 'John Doe',
            'customer_email' => 'john@example.com',
            // ... other data
            'items' => [
                ['product_id' => $product->id, 'quantity' => 1]
            ]
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'customer_email' => 'john@example.com',
        ]);
    }
}
```

---

## 📊 METRICS & SUCCESS CRITERIA

### Sau mỗi Phase, đánh giá:

1. **Code Coverage**: Tăng từ ~20% lên >80%
2. **Cyclomatic Complexity**: Giảm từ ~15-20 xuống <10 per method
3. **Code Duplication**: Giảm từ ~15% xuống <5%
4. **Lines per File**: Giảm từ 500+ xuống <200
5. **Methods per Class**: Giảm từ 20+ xuống <15

### Tools:
```bash
# PHPStan - Static Analysis
composer require --dev phpstan/phpstan
./vendor/bin/phpstan analyse

# PHP CodeSniffer
composer require --dev squizlabs/php_codesniffer
./vendor/bin/phpcs

# PHP Metrics
composer require --dev phpmetrics/phpmetrics
./vendor/bin/phpmetrics --report-html=myreport.html .
```

---

## ⏱️ TIMELINE TỔNG

| Phase | Thời gian | Độ ưu tiên |
|-------|-----------|------------|
| Phase 1: Foundation | 3-4 giờ | ⭐⭐⭐⭐⭐ |
| Phase 2: Repositories | 5-6 giờ | ⭐⭐⭐⭐⭐ |
| Phase 3: DTOs | 4-5 giờ | ⭐⭐⭐⭐ |
| Phase 4: Actions | 6-8 giờ | ⭐⭐⭐⭐⭐ |
| Phase 5: Query Builders | 3-4 giờ | ⭐⭐⭐ |
| Phase 6: Refactor Services | 5-6 giờ | ⭐⭐⭐⭐ |

**Tổng: 26-33 giờ (~4-5 ngày làm việc)**

---

## 🎓 TÀI LIỆU THAM KHẢO

1. **Domain-Driven Design** - Eric Evans
2. **Clean Architecture** - Robert C. Martin
3. **Laravel Beyond CRUD** - Brent Roose (spatie.be)
4. **SOLID Principles** - Uncle Bob
5. **Repository Pattern** - Martin Fowler

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Phase 1: Foundation classes created
- [ ] Phase 2: All repositories implemented
- [ ] Phase 3: DTOs for major entities created
- [ ] Phase 4: Critical actions implemented
- [ ] Phase 5: Query builders for complex queries
- [ ] Phase 6: Services refactored
- [ ] Unit tests coverage >70%
- [ ] Feature tests for critical flows
- [ ] Documentation updated
- [ ] Team trained on new architecture

---

**🚀 Sẵn sàng bắt đầu? Hãy cho tôi biết bạn muốn bắt đầu từ Phase nào!**
