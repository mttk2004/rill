# Hướng dẫn Migration sang Supabase Storage

## Tóm tắt các thay đổi

Đã chuyển đổi toàn bộ hệ thống upload và lưu trữ file từ local storage sang Supabase Storage:

### ✅ Đã hoàn thành:

1. **Cấu hình Supabase Storage** (`.env` và `config/filesystems.php`)
2. **Controllers đã được cập nhật:**
   - `ProductController` - upload ảnh sản phẩm
   - `ArtistController` - upload ảnh nghệ sĩ
   - `ProfileController` - upload avatar người dùng

3. **Models đã được cập nhật:**
   - `Product` model - accessor `getImageUrlAttribute()`
   - `Artist` model - accessor `getImageUrlAttribute()`
   - `User` model - accessor `getAvatarUrlAttribute()`

### 📝 Cách hoạt động:

#### Upload file mới:
```php
// Trước đây (local storage)
$image->move(public_path('images/products'), $imageName);

// Bây giờ (Supabase)
$path = $request->file('image')->store('products', 'supabase');
// $path sẽ là: "products/abc123xyz.jpg"
```

#### Hiển thị URL:
```php
// Database lưu: "products/abc123xyz.jpg"
// Accessor tự động chuyển thành:
// "https://hqvescnsogknpicdxnxc.supabase.co/storage/v1/object/public/products/products/abc123xyz.jpg"
```

## 🔄 Migration dữ liệu cũ

Nếu bạn đã có ảnh cũ trong `public/images/`, cần migrate lên Supabase:

### Option 1: Script PHP (Khuyên dùng)

Tạo file `database/seeders/MigrateImagesToSupabase.php`:

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Product;
use App\Models\Artist;

class MigrateImagesToSupabase extends Seeder
{
    public function run()
    {
        $this->info('Bắt đầu migrate ảnh lên Supabase...');

        // Migrate product images
        $this->migrateProductImages();

        // Migrate artist images
        $this->migrateArtistImages();

        $this->info('Hoàn tất!');
    }

    private function migrateProductImages()
    {
        $products = Product::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->get();

        $this->info("Tìm thấy {$products->count()} sản phẩm cần migrate...");

        foreach ($products as $product) {
            try {
                // Đường dẫn local cũ
                $oldPath = public_path($product->image);

                if (!File::exists($oldPath)) {
                    $this->warn("File không tồn tại: {$oldPath}");
                    continue;
                }

                // Đọc file
                $fileContent = File::get($oldPath);
                $extension = File::extension($oldPath);
                $filename = basename($oldPath);

                // Upload lên Supabase
                $newPath = "products/{$filename}";
                Storage::disk('supabase')->put($newPath, $fileContent);

                // Cập nhật database
                $product->update(['image' => $newPath]);

                $this->info("✓ Migrated: {$product->name}");
            } catch (\Exception $e) {
                $this->error("✗ Error migrating {$product->name}: {$e->getMessage()}");
            }
        }
    }

    private function migrateArtistImages()
    {
        $artists = Artist::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->get();

        $this->info("Tìm thấy {$artists->count()} nghệ sĩ cần migrate...");

        foreach ($artists as $artist) {
            try {
                // Đường dẫn local cũ (từ storage/app/public/artists)
                $oldPath = storage_path('app/public/' . $artist->image);

                if (!File::exists($oldPath)) {
                    $this->warn("File không tồn tại: {$oldPath}");
                    continue;
                }

                // Đọc file
                $fileContent = File::get($oldPath);
                $filename = basename($oldPath);

                // Upload lên Supabase
                $newPath = "artists/{$filename}";
                Storage::disk('supabase')->put($newPath, $fileContent);

                // Cập nhật database
                $artist->update(['image' => $newPath]);

                $this->info("✓ Migrated: {$artist->name}");
            } catch (\Exception $e) {
                $this->error("✗ Error migrating {$artist->name}: {$e->getMessage()}");
            }
        }
    }

    private function info($message)
    {
        echo "[INFO] {$message}\n";
    }

    private function warn($message)
    {
        echo "[WARN] {$message}\n";
    }

    private function error($message)
    {
        echo "[ERROR] {$message}\n";
    }
}
```

Chạy migration:
```bash
php artisan db:seed --class=MigrateImagesToSupabase
```

### Option 2: Upload thủ công qua Supabase Dashboard

1. Vào Supabase Dashboard → Storage → Bucket `products`
2. Upload các file từ `public/images/products/` và `storage/app/public/artists/`
3. Cập nhật database thủ công nếu cần

### Option 3: Artisan Command (Khuyên dùng nhất)

Tạo file `app/Console/Commands/MigrateImagesToSupabase.php`:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use App\Models\Product;
use App\Models\Artist;
use App\Models\User;

class MigrateImagesToSupabase extends Command
{
    protected $signature = 'images:migrate-to-supabase
                            {--type=all : Type to migrate (products|artists|avatars|all)}
                            {--dry-run : Preview migration without actually uploading}';

    protected $description = 'Migrate images from local storage to Supabase';

    public function handle()
    {
        $type = $this->option('type');
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->warn('🔍 DRY RUN MODE - No files will be uploaded');
        }

        $this->info('🚀 Starting migration to Supabase...');
        $this->newLine();

        match($type) {
            'products' => $this->migrateProducts($dryRun),
            'artists' => $this->migrateArtists($dryRun),
            'avatars' => $this->migrateAvatars($dryRun),
            'all' => $this->migrateAll($dryRun),
            default => $this->error("Invalid type: {$type}")
        };

        $this->newLine();
        $this->info('✅ Migration completed!');
    }

    private function migrateAll($dryRun)
    {
        $this->migrateProducts($dryRun);
        $this->newLine();
        $this->migrateArtists($dryRun);
        $this->newLine();
        $this->migrateAvatars($dryRun);
    }

    private function migrateProducts($dryRun)
    {
        $this->info('📦 Migrating Product Images...');

        $products = Product::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->where('image', 'like', '/images/%')
            ->get();

        $bar = $this->output->createProgressBar($products->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($products as $product) {
            try {
                $oldPath = public_path($product->image);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "products/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $product->update(['image' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$product->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }

    private function migrateArtists($dryRun)
    {
        $this->info('🎤 Migrating Artist Images...');

        $artists = Artist::whereNotNull('image')
            ->where('image', 'not like', 'http%')
            ->get();

        $bar = $this->output->createProgressBar($artists->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($artists as $artist) {
            try {
                // Artist images are in storage/app/public/artists
                $oldPath = storage_path('app/public/' . $artist->image);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "artists/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $artist->update(['image' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$artist->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }

    private function migrateAvatars($dryRun)
    {
        $this->info('👤 Migrating User Avatars...');

        $users = User::whereNotNull('avatar')
            ->where('avatar', 'not like', 'http%')
            ->get();

        $bar = $this->output->createProgressBar($users->count());
        $bar->start();

        $success = 0;
        $failed = 0;

        foreach ($users as $user) {
            try {
                $oldPath = storage_path('app/public/' . $user->avatar);

                if (!File::exists($oldPath)) {
                    $failed++;
                    $bar->advance();
                    continue;
                }

                $filename = basename($oldPath);
                $newPath = "avatars/{$filename}";

                if (!$dryRun) {
                    $fileContent = File::get($oldPath);
                    Storage::disk('supabase')->put($newPath, $fileContent);
                    $user->update(['avatar' => $newPath]);
                }

                $success++;
            } catch (\Exception $e) {
                $this->newLine();
                $this->error("Failed: {$user->name} - {$e->getMessage()}");
                $failed++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->line("✓ Success: {$success} | ✗ Failed: {$failed}");
    }
}
```

Chạy command:
```bash
# Xem trước (không upload thật)
php artisan images:migrate-to-supabase --dry-run

# Migrate tất cả
php artisan images:migrate-to-supabase

# Migrate riêng products
php artisan images:migrate-to-supabase --type=products

# Migrate riêng artists
php artisan images:migrate-to-supabase --type=artists
```

## 🧪 Testing

Sau khi hoàn tất migration, test các tính năng:

1. ✅ Upload ảnh mới cho Product
2. ✅ Upload ảnh mới cho Artist
3. ✅ Upload avatar mới cho User
4. ✅ Hiển thị ảnh cũ (đã migrate)
5. ✅ Hiển thị ảnh mới
6. ✅ Xóa và update ảnh

## 🔒 Bảo mật Bucket

### ⚠️ VẤN ĐÈ QUAN TRỌNG: RLS Policies

Vì Laravel backend **KHÔNG sử dụng Supabase Auth** (bạn dùng Laravel Auth riêng), có 2 cách xử lý:

---

### ✅ **Cách 1: DISABLE RLS (KHUYÊN DÙNG)**

Đây là cách **đơn giản và phù hợp nhất** cho trường hợp của bạn:

#### Tại sao nên disable RLS?
- ✅ Laravel dùng **Service Role Key** → đã có quyền tối cao, tự động bypass RLS
- ✅ Bucket đã set **Public** → mọi người đều xem được ảnh (đúng với mục đích)
- ✅ Chỉ Laravel backend mới upload/xóa được (vì chỉ có Service Role Key)
- ✅ Không phải maintain policies phức tạp

#### Cách disable:

**Option A - Qua Dashboard (Dễ nhất):**
1. Vào **Supabase Dashboard** → **Storage** → Click vào bucket **`PRODUCTS`**
2. Click **Settings** (icon bánh răng) ở góc trên bên phải
3. Tìm mục **"Row Level Security (RLS)"**
4. **Tắt toggle "Enable RLS"** hoặc chọn "Disable RLS"

**Option B - Qua SQL:**
```sql
-- Disable RLS cho storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

> **Lưu ý**: Sau khi disable RLS, mọi request với Service Role Key (như Laravel của bạn) đều có quyền upload/xóa. Public vẫn chỉ đọc được vì bucket là Public.

---

### 📋 **Cách 2: Giữ RLS + Tạo Policies đơn giản**

Nếu vẫn muốn dùng RLS (để bảo mật tốt hơn cho tương lai):

```sql
-- 1. Cho phép PUBLIC đọc (xem ảnh)
CREATE POLICY "Anyone can view files"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- 2. Cho phép Service Role INSERT (không cần check auth vì Service Role bypass)
CREATE POLICY "Service role can insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'products');

-- 3. Cho phép Service Role UPDATE
CREATE POLICY "Service role can update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'products');

-- 4. Cho phép Service Role DELETE
CREATE POLICY "Service role can delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'products');
```

> **Lưu ý**: Service Role Key tự động **bypass** RLS, nên các policies trên hơi thừa. Chỉ cần tạo nếu bạn muốn kiểm soát chặt chẽ hơn trong tương lai.

---

### 🎯 **Khuyến nghị cuối cùng:**

👉 **DISABLE RLS** - Đơn giản, hiệu quả, phù hợp với architecture hiện tại của bạn.

Nếu sau này cần bảo mật cao hơn (ví dụ: ảnh private, nhiều user roles), lúc đó hãy:
- Bật lại RLS
- Tạo policies chi tiết
- Hoặc tích hợp Supabase Auth

## 🎯 Kết luận

- ✅ Code đã sẵn sàng cho production
- ✅ Không còn lưu file trong `public/images/`
- ✅ Tất cả file mới sẽ được upload lên Supabase
- ✅ URL ảnh tự động được generate từ Supabase
- ✅ Dễ dàng scale và deploy

**Lưu ý quan trọng**: Nhớ thêm credentials vào `.env` production và đảm bảo bucket `products` đã được tạo trên Supabase!
