Chào bạn, việc cho phép khách hàng đính kèm ảnh vào đánh giá (Review) là một tính năng tuyệt vời để tăng tính xác thực (Social Proof) cho sản phẩm đĩa than.

Vì bạn đang sử dụng **Supabase Storage** và muốn tuân thủ Clean Code, chúng ta sẽ không lưu ảnh trực tiếp vào thư mục `public` mà sẽ upload lên Cloud.

Dưới đây là kế hoạch chi tiết để Refactor chức năng Review.

-----

### Kế hoạch tổng quan

1.  **Database:** Thêm cột `images` (kiểu JSON) vào bảng `product_reviews`. Chúng ta chọn JSON thay vì bảng riêng để đơn giản hóa vì mỗi review thường chỉ có ít ảnh (3-5 tấm).
2.  **Backend (Laravel):**
      * Cập nhật `ProductReview` Model để cast `images` và tự động sinh URL.
      * Cập nhật `StoreProductReviewRequest` để validate ảnh.
      * Refactor `ReviewController` (hoặc `ReviewService`) để xử lý upload ảnh lên Supabase.
3.  **Frontend (React):**
      * Cập nhật `review-form.tsx`: Thêm nút upload, preview ảnh, nén ảnh client-side.
      * Cập nhật `review-list.tsx`: Hiển thị lưới ảnh (gallery) trong mỗi comment.

-----

### Chi tiết triển khai

#### Bước 1: Thay đổi Database (Migration)

Chúng ta cần thêm một cột để lưu đường dẫn các file ảnh.

**Prompt:**

```bash
php artisan make:migration add_images_to_product_reviews_table --table=product_reviews
```

**Nội dung Migration:**

```php
public function up(): void
{
    Schema::table('product_reviews', function (Blueprint $table) {
        $table->json('images')->nullable()->after('comment');
    });
}

public function down(): void
{
    Schema::table('product_reviews', function (Blueprint $table) {
        $table->dropColumn('images');
    });
}
```

#### Bước 2: Cập nhật Model (`app/Models/ProductReview.php`)

Cần cast cột `images` sang mảng và tạo Accessor để khi lấy dữ liệu, Laravel tự động nối thêm domain của Supabase vào link ảnh (giống như bạn làm với `Product`).

```php
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Casts\Attribute;

class ProductReview extends Model
{
    // 1. Thêm vào fillable
    protected $fillable = [
        // ... các trường cũ
        'images',
    ];

    // 2. Cast JSON sang Array
    protected $casts = [
        'images' => 'array',
        'rating' => 'integer',
    ];

    // 3. Accessor để lấy Full URL từ Supabase
    protected function images(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                if (!$value) return [];
                $paths = json_decode($value, true) ?? [];

                return array_map(function ($path) {
                    // Nếu là URL ngoài (ảnh test cũ) thì giữ nguyên
                    if (filter_var($path, FILTER_VALIDATE_URL)) return $path;
                    // Nếu là path, nối với Supabase URL
                    return Storage::disk('supabase')->url($path);
                }, $paths);
            }
        );
    }
}
```

#### Bước 3: Validate Request (`StoreProductReviewRequest.php`)

Cập nhật file `app/Http/Requests/StoreProductReviewRequest.php` để cho phép upload ảnh.

```php
public function rules(): array
{
    return [
        'rating' => ['required', 'integer', 'min:1', 'max:5'],
        'comment' => ['required', 'string', 'min:10', 'max:1000'],
        'images' => ['nullable', 'array', 'max:5'], // Tối đa 5 ảnh
        'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:2048'], // Mỗi ảnh max 2MB
    ];
}
```

#### Bước 4: Logic Upload (`ReviewService.php`)

Bạn nên tạo hoặc cập nhật `ReviewService` để xử lý logic upload, giữ cho Controller sạch.

```php
// app/Services/ReviewService.php

public function createReview(User $user, Product $product, array $data)
{
    $imagePaths = [];

    // Xử lý upload ảnh nếu có
    if (isset($data['images']) && is_array($data['images'])) {
        foreach ($data['images'] as $image) {
            if ($image instanceof \Illuminate\Http\UploadedFile) {
                // Lưu vào folder 'reviews' trên Supabase
                // Tên file sẽ được hash tự động
                $path = $image->store('reviews', 'supabase');
                $imagePaths[] = $path;
            }
        }
    }

    return $product->reviews()->create([
        'user_id' => $user->id,
        'rating' => $data['rating'],
        'comment' => $data['comment'],
        'images' => !empty($imagePaths) ? $imagePaths : null, // Lưu mảng đường dẫn
    ]);
}
```

#### Bước 5: Frontend - Form Upload (`review-form.tsx`)

Bạn cần cài đặt thư viện nén ảnh (như đã bàn ở bài trước) để upload nhanh hơn.
`npm install browser-image-compression lucide-react`

Trong `resources/js/components/product/review-form.tsx`:

1.  **State:** Thêm state để chứa mảng file ảnh (`previewImages`).
2.  **Input File:** Thêm input `type="file"` ẩn và một nút icon Camera để kích hoạt nó.
3.  **Preview:** Hiển thị các ảnh nhỏ bên dưới ô comment, kèm nút "X" để xóa.
4.  **Submit:** Khi submit, `useForm` của Inertia sẽ tự động chuyển đổi payload thành `FormData` để gửi file.

<!-- end list -->

```tsx
// Snippet gợi ý cho ReviewForm

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages = [...data.images]; // data.images từ useForm
    const newPreviews = [...previews];

    for (let i = 0; i < files.length; i++) {
        if (newImages.length >= 5) break; // Limit 5 ảnh

        const file = files[i];
        // Nén ảnh (Optional nhưng Recommended)
        const compressedFile = await imageCompression(file, { maxSizeMB: 1 });

        newImages.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
    }

    setData('images', newImages);
    setPreviews(newPreviews);
};

// UI phần upload
<div className="flex gap-2 mt-2">
   {/* Nút chọn ảnh */}
   <label className="cursor-pointer border p-2 rounded hover:bg-gray-50">
       <Camera className="w-5 h-5" />
       <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
   </label>

   {/* Danh sách preview */}
   {previews.map((src, idx) => (
       <div key={idx} className="relative w-16 h-16">
           <img src={src} className="w-full h-full object-cover rounded" />
           <button onClick={() => removeImage(idx)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
               <X className="w-3 h-3" />
           </button>
       </div>
   ))}
</div>
```

#### Bước 6: Frontend - Hiển thị Ảnh (`review-list.tsx`)

Trong `resources/js/components/product/review-list.tsx`:

  * Kiểm tra nếu `review.images` có dữ liệu.
  * Render grid ảnh nhỏ.
  * **(Tinh tế)** Khi click vào ảnh, mở một Modal (Dialog) để xem ảnh phóng to (Lightbox). Bạn có thể dùng component `Dialog` của `shadcn/ui` có sẵn trong dự án.

-----

### Prompt yêu cầu triển khai

Dưới đây là prompt chi tiết để bạn gửi cho AI Assistant thực hiện coding:

```text
Tôi muốn nâng cấp tính năng đánh giá sản phẩm (Review) để cho phép người dùng đính kèm ảnh. Hệ thống đang dùng Laravel 12, Inertia React, và Supabase Storage.

Hãy thực hiện các bước sau:

1.  **Backend Migration:** Tạo migration thêm cột `json('images')->nullable()` vào bảng `product_reviews`.
2.  **Backend Model:** Cập nhật `App\Models\ProductReview`. Thêm `images` vào `$fillable`, `$casts` (array). Viết Accessor cho `images` để trả về mảng URL đầy đủ từ Supabase (dùng `Storage::disk('supabase')->url()`).
3.  **Backend Request:** Cập nhật `StoreProductReviewRequest` để validate `images`: mảng, tối đa 5 file, mỗi file là ảnh (jpg,png,webp), max 2MB.
4.  **Backend Service:** Refactor logic lưu review (có thể là trong Controller hoặc Service) để xử lý upload file:
    - Duyệt qua mảng `images`.
    - Dùng `$file->store('reviews', 'supabase')` để upload.
    - Lưu mảng các đường dẫn (paths) vào cột `images` trong DB.
5.  **Frontend Form (`review-form.tsx`):**
    - Thêm nút icon Camera để chọn ảnh.
    - Xử lý nén ảnh client-side (nếu được) hoặc chọn ảnh thường.
    - Hiển thị preview các ảnh đã chọn, có nút xóa.
    - Cập nhật `useForm` để gửi mảng `images[]` lên server.
6.  **Frontend List (`review-list.tsx`):**
    - Hiển thị các ảnh thumbnail trong mỗi review item.
    - Khi bấm vào ảnh, mở Dialog (shadcn) xem ảnh kích thước lớn.

Yêu cầu code sạch, tuân thủ các convention hiện tại của dự án.
```
