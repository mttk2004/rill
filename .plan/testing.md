# Testing Strategy - Rill

## Tổng quan
Tài liệu này mô tả chiến lược testing cho Rill MVP, tập trung vào các test cases quan trọng nhất để đảm bảo chất lượng sản phẩm.

---

## 1. Testing Philosophy

### 1.1 MVP Testing Approach
```
Focus Areas:
✅ Core functionality testing
✅ Critical user journeys
✅ Business logic validation
✅ Security basics

Defer to Phase 2:
❌ Comprehensive edge cases
❌ Performance testing
❌ Load testing
❌ Cross-browser compatibility
```

### 1.2 Testing Pyramid
```
Unit Tests (70%)
├── Model logic
├── Service classes
├── Business rules
└── Utility functions

Feature Tests (25%)
├── User authentication
├── Product management
├── Shopping cart
├── Order processing
└── Payment flow

Browser Tests (5%)
├── Critical user journeys
├── Form submissions
└── Navigation flows
```

---

## 2. Backend Testing (Laravel)

### 2.1 Unit Tests
```php
// tests/Unit/Models/ProductTest.php
<?php

use App\Models\Product;
use App\Models\Artist;

test('product can calculate discount percentage', function () {
    $product = Product::factory()->create([
        'price' => 100000,
        'compare_price' => 150000,
    ]);

    expect($product->discount_percentage)->toBe(33.33);
});

test('product status changes to out of stock when stock is zero', function () {
    $product = Product::factory()->create(['stock_quantity' => 1]);

    $product->update(['stock_quantity' => 0]);

    expect($product->fresh()->status)->toBe('out_of_stock');
});
```

### 2.2 Feature Tests
```php
// tests/Feature/Auth/UserRegistrationTest.php
<?php

test('user can register with valid data', function () {
    $userData = [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post('/register', $userData);

    $response->assertRedirect('/dashboard');
    $this->assertDatabaseHas('users', [
        'email' => 'john@example.com',
        'role' => 'customer',
    ]);
});

test('user cannot register with invalid email', function () {
    $userData = [
        'name' => 'John Doe',
        'email' => 'invalid-email',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ];

    $response = $this->post('/register', $userData);

    $response->assertSessionHasErrors(['email']);
});
```

### 2.3 Service Tests
```php
// tests/Unit/Services/OrderServiceTest.php
<?php

use App\Services\OrderService;
use App\Models\User;
use App\Models\Product;

test('order service creates order with correct total', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['price' => 100000]);

    $cartItems = [
        [
            'product_id' => $product->id,
            'quantity' => 2,
            'unit_price' => 100000,
        ]
    ];

    $order = OrderService::createOrder($user, $cartItems, []);

    expect($order->subtotal)->toBe(200000);
    expect($order->total_amount)->toBe(200000);
});
```

---

## 3. Frontend Testing (React)

### 3.1 Component Tests
```typescript
// tests/components/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

const mockProduct = {
  id: 1,
  name: 'Test Album',
  price: 100000,
  formatted_price: '100,000 VND',
  featured_image: '/test-image.jpg',
  genre: 'Rock',
  label: 'Atlantic Records'
};

test('renders product information correctly', () => {
  render(<ProductCard product={mockProduct} />);

  expect(screen.getByText('Test Album')).toBeInTheDocument();
  expect(screen.getByText('100,000 VND')).toBeInTheDocument();
  expect(screen.getByText('Rock')).toBeInTheDocument();
});

test('links to product detail page', () => {
  render(<ProductCard product={mockProduct} />);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('href', `/products/${mockProduct.slug}`);
});
```

### 3.2 Form Tests
```typescript
// tests/components/ProductForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductForm } from '@/components/ProductForm';

test('validates required fields', async () => {
  render(<ProductForm />);

  const submitButton = screen.getByRole('button', { name: /save/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(screen.getByText('Tên sản phẩm là bắt buộc')).toBeInTheDocument();
  });
});

test('submits form with valid data', async () => {
  const mockSubmit = jest.fn();
  render(<ProductForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText(/tên sản phẩm/i), {
    target: { value: 'Test Product' }
  });
  fireEvent.change(screen.getByLabelText(/giá/i), {
    target: { value: '100000' }
  });

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test Product',
      price: 100000
    });
  });
});
```

---

## 4. Integration Tests

### 4.1 API Endpoint Tests
```php
// tests/Feature/Api/ProductApiTest.php
<?php

test('api returns products with pagination', function () {
    Product::factory()->count(15)->create();

    $response = $this->getJson('/api/products?page=1&per_page=10');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'price', 'genre', 'label', 'artists']
            ],
            'meta' => ['current_page', 'last_page', 'total']
        ]);
});

test('api validates product creation data', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->postJson('/api/products', [
            'name' => '',
            'price' => -100,
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name', 'price']);
});
```

### 4.2 Database Integration Tests
```php
// tests/Feature/Database/OrderProcessingTest.php
<?php

test('order processing updates stock correctly', function () {
    $product = Product::factory()->create(['stock_quantity' => 10]);
    $user = User::factory()->create();

    // Create order
    $order = Order::factory()->create(['user_id' => $user->id]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    // Process order
    OrderService::confirmOrder($order);

    expect($product->fresh()->stock_quantity)->toBe(7);
});
```

---

## 5. Critical User Journey Tests

### 5.1 Complete Shopping Flow
```php
// tests/Feature/ShoppingFlowTest.php
<?php

test('user can complete full shopping journey', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['stock_quantity' => 5]);
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);

    // 1. Add to cart
    $this->actingAs($user)
        ->post('/cart/add', [
            'product_id' => $product->id,
            'quantity' => 2,
        ])
        ->assertRedirect();

    // 2. View cart
    $response = $this->actingAs($user)->get('/cart');
    $response->assertSee($product->name);

    // 3. Checkout
    $response = $this->actingAs($user)
        ->post('/checkout', [
            'shipping_address_id' => $address->id,
            'payment_method' => 'cod',
        ]);

    $response->assertRedirect('/orders');

    // 4. Verify order created
    $this->assertDatabaseHas('orders', [
        'user_id' => $user->id,
        'status' => 'pending',
    ]);
});
```

### 5.2 Admin Product Management
```php
// tests/Feature/Admin/ProductManagementTest.php
<?php

test('admin can manage products', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    // Create product
    $response = $this->actingAs($admin)
        ->post('/admin/products', [
            'name' => 'Test Album',
            'description' => 'Test Description',
            'genre' => 'Rock',
            'label' => 'Atlantic Records',
            'price' => 100000,
            'stock_quantity' => 10,
        ]);

    $response->assertRedirect('/admin/products');

    // Update product
    $product = Product::where('name', 'Test Album')->first();
    $response = $this->actingAs($admin)
        ->put("/admin/products/{$product->id}", [
            'name' => 'Updated Album',
            'price' => 120000,
        ]);

    $response->assertRedirect();
    expect($product->fresh()->name)->toBe('Updated Album');
});
```

---

## 6. Security Testing

### 6.1 Authentication Tests
```php
// tests/Feature/Security/AuthenticationTest.php
<?php

test('unauthenticated user cannot access admin routes', function () {
    $response = $this->get('/admin/products');
    $response->assertRedirect('/login');
});

test('customer cannot access admin routes', function () {
    $customer = User::factory()->create(['role' => 'customer']);

    $response = $this->actingAs($customer)->get('/admin/products');
    $response->assertStatus(403);
});

test('password must meet requirements', function () {
    $response = $this->post('/register', [
        'name' => 'John Doe',
        'email' => 'john@example.com',
        'password' => '123',
        'password_confirmation' => '123',
    ]);

    $response->assertSessionHasErrors(['password']);
});
```

### 6.2 Authorization Tests
```php
// tests/Feature/Security/AuthorizationTest.php
<?php

test('user can only edit own profile', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $response = $this->actingAs($user1)
        ->put("/users/{$user2->id}", [
            'name' => 'Hacked Name',
        ]);

    $response->assertStatus(403);
    expect($user2->fresh()->name)->not->toBe('Hacked Name');
});
```

---

## 7. Performance Testing (Basic)

### 7.1 Database Query Tests
```php
// tests/Feature/Performance/DatabasePerformanceTest.php
<?php

test('product listing does not cause N+1 queries', function () {
    $artists = Artist::factory()->count(5)->create();
    $products = Product::factory()->count(10)->create();

    // Attach artists to products
    $products->each(function ($product) use ($artists) {
        $product->artists()->attach($artists->random(2), [
            'role' => 'main',
            'sort_order' => 1
        ]);
    });

    $this->assertDatabaseQueryCount(2, function () {
        $products = Product::with('artists')->get();
        $products->each(fn($p) => $p->artists->first()->name);
    });
});
```

### 7.2 Memory Usage Tests
```php
// tests/Feature/Performance/MemoryUsageTest.php
<?php

test('large product catalog does not exceed memory limit', function () {
    $memoryBefore = memory_get_usage();

    Product::factory()->count(1000)->create();
    $products = Product::with('artists')->paginate(50);

    $memoryAfter = memory_get_usage();
    $memoryUsed = $memoryAfter - $memoryBefore;

    expect($memoryUsed)->toBeLessThan(50 * 1024 * 1024); // 50MB
});
```

---

## 8. Test Data Management

### 8.1 Factories
```php
// database/factories/ProductFactory.php
<?php

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(3, true),
            'slug' => $this->faker->slug(),
            'description' => $this->faker->paragraph(),
            'genre' => $this->faker->randomElement(['Rock', 'Jazz', 'Classical', 'Pop', 'Electronic']),
            'label' => $this->faker->randomElement(['Atlantic Records', 'Blue Note', 'Columbia', 'EMI', 'Warner Bros']),
            'price' => $this->faker->numberBetween(50000, 500000),
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'status' => 'active',
        ];
    }

    public function outOfStock(): static
    {
        return $this->state(['stock_quantity' => 0, 'status' => 'out_of_stock']);
    }
}
```

### 8.2 Seeders for Testing
```php
// database/seeders/TestDataSeeder.php
<?php

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create test artists
        $artists = Artist::factory()->count(20)->create();

        // Create test products
        $products = Product::factory()->count(50)->create();

        // Attach artists to products with roles
        $products->each(function ($product) use ($artists) {
            $selectedArtists = $artists->random(rand(1, 3));
            $product->artists()->attach($selectedArtists->first(), [
                'role' => 'main',
                'sort_order' => 1
            ]);

            if ($selectedArtists->count() > 1) {
                $product->artists()->attach($selectedArtists->slice(1), [
                    'role' => 'featured',
                    'sort_order' => 2
                ]);
            }
        });

        // Create test users
        User::factory()->create(['email' => 'admin@test.com', 'role' => 'admin']);
        User::factory()->count(10)->create();
    }
}
```

---

## 9. Test Automation

### 9.1 GitHub Actions Workflow
```yaml
# .github/workflows/tests.yml
name: Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: password
          MYSQL_DATABASE: rill_test
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3

    steps:
    - uses: actions/checkout@v3

    - name: Setup PHP
      uses: shivammathur/setup-php@v2
      with:
        php-version: '8.2'
        extensions: mbstring, dom, fileinfo, mysql

    - name: Install dependencies
      run: composer install --no-progress --prefer-dist --optimize-autoloader

    - name: Copy environment
      run: cp .env.testing .env

    - name: Generate key
      run: php artisan key:generate

    - name: Run migrations
      run: php artisan migrate --force

    - name: Run tests
      run: php artisan test

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run tests
      run: npm test
```

### 9.2 Local Testing Commands
```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage

# Run frontend tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 10. Test Coverage Goals

### 10.1 MVP Coverage Targets
```
Critical Paths: 90%+
├── User authentication
├── Product management
├── Shopping cart
├── Order processing
└── Payment flow

Business Logic: 80%+
├── Price calculations
├── Stock management
├── Voucher validation
└── Order status flow

UI Components: 70%+
├── Forms
├── Navigation
├── Product display
└── Cart interface
```

### 10.2 Coverage Reports
```bash
# Generate coverage report
php artisan test --coverage-html coverage/

# View coverage report
open coverage/index.html
```

---

## 11. Bug Tracking & Quality Gates

### 11.1 Quality Gates
```
Before Merge:
✅ All tests pass
✅ Code coverage > 70%
✅ No critical security issues
✅ No performance regressions

Before Release:
✅ All critical user journeys tested
✅ Security scan passed
✅ Performance benchmarks met
✅ Manual testing completed
```

### 11.2 Bug Severity Levels
```
Critical (P0): Blocks core functionality
High (P1): Major feature broken
Medium (P2): Minor feature issues
Low (P3): UI/UX improvements
```

---

*Tài liệu này tập trung vào testing strategy thiết yếu cho MVP. Các test cases nâng cao sẽ được thêm vào Phase 2.*
