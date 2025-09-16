# Quy ước Lập trình - Rill

## Tổng quan
Tài liệu này định nghĩa các quy ước lập trình chung cho team phát triển Rill, bao gồm Laravel backend và React frontend với Inertia.js.

---

## 1. Naming Conventions

### 1.1 Files & Folders (CẬP NHẬT - NHẤT QUÁN HƠN)
```
✅ Chuẩn Laravel & TypeScript (Simplified & Community-aligned):

Folders:
- kebab-case cho tất cả folders: user-management/, api-routes/, product-catalog/

PHP Files (Laravel - SIMPLIFIED):
- PascalCase cho TẤT CẢ class files: ProductController.php, UserService.php, UserModel.php
- Lý do: Nhất quán với PSR-4 autoloading và Laravel community standards

TypeScript/React Files (CONSISTENT):
- PascalCase cho React components: ProductCard.tsx, AuthLayout.tsx
- camelCase cho TẤT CẢ non-component files: userService.ts, formatUtils.ts, apiClient.ts

Variables & Functions:
- camelCase cho tất cả: userName, productList, isLoading, getUserData()
- PascalCase cho Classes: UserService, ProductModel
- UPPER_SNAKE_CASE cho constants: API_BASE_URL, MAX_RETRY_COUNT

✅ Benefits của approach này:
- Consistency: Same pattern for same file types
- Community standard: Follows Laravel/React conventions
- IDE support: Better autocomplete và imports
- Onboarding: Easier for new developers

❌ Tránh:
- Mixing conventions: user_service.ts, User-service.php
- kebab-case cho PHP classes: user-service.php (confusing)
- Inconsistent TypeScript: userService.ts + format-utils.ts mixed
```

### 1.2 Variables & Functions
```
- camelCase cho JavaScript/TypeScript: userName, getUserData()
- camelCase cho PHP: userName, getUserData()
- PascalCase cho Classes: UserService, ProductModel
- UPPER_SNAKE_CASE cho constants: API_BASE_URL
```
---

## 2. Laravel Backend

### 2.1 Directory Structure
```
app/
├── Http/
│   ├── Controllers/       # Inertia controllers
│   ├── Middleware/
│   └── Requests/          # Form requests
├── Models/
├── Services/              # Business logic services
└── Notifications/         # Email notifications
```

### 2.2 Controller Conventions
```php
<?php
class ProductController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Products/Index', [
            'products' => ProductService::getFilteredProducts(request())
        ]);
    }

    public function store(ProductStoreRequest $request): RedirectResponse
    {
        $product = ProductService::create($request->validated());
        return redirect()->route('products.show', $product)
            ->with('success', 'Sản phẩm đã được tạo thành công.');
    }
}
```

### 2.3 Model Conventions
```php
<?php
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes; // Soft delete support

    protected $fillable = [
        'name', 'slug', 'price', 'genre', 'label',
        'description', 'sku', 'stock_quantity', 'is_featured'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_featured' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function artists(): BelongsToMany
    {
        return $this->belongsToMany(Artist::class, 'artist_product')
                    ->withPivot('role', 'sort_order')
                    ->orderBy('pivot_sort_order');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeWithMainArtist($query)
    {
        return $query->with(['artists' => function ($q) {
            $q->wherePivot('role', 'main');
        }]);
    }
}
```

### 2.4 Request Validation
```php
<?php
class ProductStoreRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'genre' => 'required|string|max:255',
            'label' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'sku' => 'required|string|unique:products,sku',
            'stock_quantity' => 'required|integer|min:0',
            'artists' => 'required|array|min:1',
            'artists.*.id' => 'required|exists:artists,id',
            'artists.*.role' => 'required|in:main,featured,composer,producer',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên sản phẩm là bắt buộc.',
            'genre.required' => 'Thể loại nhạc là bắt buộc.',
            'label.required' => 'Hãng phát hành là bắt buộc.',
            'price.min' => 'Giá sản phẩm phải lớn hơn 0.',
            'sku.unique' => 'Mã SKU đã tồn tại.',
            'artists.required' => 'Phải có ít nhất một nghệ sĩ.',
            'artists.*.role.in' => 'Vai trò nghệ sĩ không hợp lệ.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $artists = $this->input('artists', []);
            $hasMainArtist = collect($artists)->contains('role', 'main');

            if (!$hasMainArtist) {
                $validator->errors()->add('artists', 'Phải có ít nhất một nghệ sĩ chính (main).');
            }
        });
    }
}
```

---

## 3. React + TypeScript Frontend

### 3.1 Component Structure
```typescript
// ProductCard.tsx
import React from 'react';
import { Link } from '@inertiajs/react';

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
    product,
    className = ''
}) => {
    const mainArtist = product.artists?.find(a => a.pivot?.role === 'main');

    return (
        <div className={`border rounded-lg p-4 ${className}`}>
            <Link href={`/products/${product.slug}`}>
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                <h3 className="font-semibold mt-2">{product.name}</h3>
                {mainArtist && (
                    <p className="text-gray-600 text-sm">{mainArtist.name}</p>
                )}
                <p className="text-gray-500 text-xs">{product.genre} • {product.label}</p>
                <p className="text-red-600 font-bold">{product.formatted_price}</p>
            </Link>
        </div>
    );
};

export default ProductCard;
```

### 3.2 Type Definitions
```typescript
// types/index.ts
export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    formatted_price: string;
    image?: string;
    genre: string;
    label: string;
    artists: Artist[];
}

export interface Artist {
    id: number;
    name: string;
    slug: string;
    image?: string;
    pivot?: {
        role: 'main' | 'featured' | 'composer' | 'producer';
        sort_order: number;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}
```

### 3.3 Form Handling
```typescript
// Form với React Hook Form + Zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
    name: z.string().min(1, 'Tên sản phẩm là bắt buộc'),
    price: z.number().min(0, 'Giá phải lớn hơn 0'),
});

type FormData = z.infer<typeof schema>;

export function ProductForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = (data: FormData) => {
        // Submit logic
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name')} />
            {errors.name && <span>{errors.name.message}</span>}

            <input type="number" {...register('price', { valueAsNumber: true })} />
            {errors.price && <span>{errors.price.message}</span>}

            <button type="submit">Lưu</button>
        </form>
    );
}
```

---

## 4. Review Management Conventions

### 4.1 Review Rejection Handling
```php
<?php
class ReviewController extends Controller
{
    public function reject(Request $request, ProductReview $review): RedirectResponse
    {
        $request->validate([
            'rejection_reason' => 'required|string|min:10|max:500'
        ], [
            'rejection_reason.required' => 'Lý do từ chối là bắt buộc.',
            'rejection_reason.min' => 'Lý do phải có ít nhất 10 ký tự.',
        ]);

        $review->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason
        ]);

        // Send notification to user
        $review->user->notify(new ReviewRejectedNotification($review));

        return redirect()->back()
            ->with('success', 'Review đã bị từ chối với lý do đã ghi nhận.');
    }

    public function approve(ProductReview $review): RedirectResponse
    {
        $review->update([
            'status' => 'approved',
            'rejection_reason' => null // Clear any previous rejection reason
        ]);

        return redirect()->back()
            ->with('success', 'Review đã được phê duyệt.');
    }
}
```

### 4.2 Soft Delete Usage
```php
<?php
// Models that use soft deletes
class User extends Model
{
    use SoftDeletes;

    protected $casts = [
        'deleted_at' => 'datetime',
    ];
}

class Product extends Model
{
    use SoftDeletes;

    // When fetching products, automatically exclude soft deleted
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Include soft deleted when needed
    public static function withTrashed()
    {
        return static::query()->withTrashed();
    }
}

// Controller methods
class ProductController extends Controller
{
    public function destroy(Product $product): RedirectResponse
    {
        $product->delete(); // Soft delete

        return redirect()->route('products.index')
            ->with('success', 'Sản phẩm đã được xóa.');
    }

    public function restore($id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();

        return redirect()->route('products.index')
            ->with('success', 'Sản phẩm đã được khôi phục.');
    }

    public function forceDelete($id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->forceDelete(); // Permanently delete

        return redirect()->route('products.index')
            ->with('success', 'Sản phẩm đã được xóa vĩnh viễn.');
    }
}
```

---

## 5. Database Conventions

### 5.1 Naming
```sql
-- Tables: plural, snake_case
users, products, order_items

-- Columns: snake_case
first_name, created_at

-- Foreign keys: table_name_id
user_id, product_id
```

### 5.2 Migrations
```php
<?php
public function up(): void
{
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique();
        $table->string('genre');
        $table->string('label');
        $table->decimal('price', 12, 2);
        $table->timestamps();

        $table->index(['genre', 'created_at']);
        $table->index(['label', 'created_at']);
    });
}
```

---

## 6. Git Conventions

### 6.1 Commit Messages
```
feat: add user registration
fix: resolve cart quantity issue
docs: update API documentation
style: format code
refactor: simplify product service
```

### 6.2 Branch Naming
```
feature/user-authentication
feature/product-catalog
bugfix/cart-quantity-issue
hotfix/payment-error
```

---

## 7. Performance Best Practices

### 7.1 Laravel
```php
// Eager loading - Updated for MVP structure
$products = Product::with(['artists'])->get();

// Caching - Simplified for MVP
Cache::remember('products_featured', 3600, fn() =>
    Product::where('is_featured', true)->with('artists')->get()
);

// Query optimization
$products = Product::withMainArtist()
    ->where('status', 'active')
    ->orderBy('created_at', 'desc')
    ->paginate(20);
```

### 7.2 React
```typescript
// React.memo cho expensive components
const ProductCard = React.memo(({ product }) => {
    return <div>{product.name}</div>;
});

// Lazy loading
const ProductDetails = lazy(() => import('./ProductDetails'));
```

---

*Tài liệu này tập trung vào các quy ước thiết yếu cho MVP.*
