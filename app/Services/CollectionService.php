<?php

namespace App\Services;

use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

/**
 * Collection Service
 *
 * Handles business logic for collection management.
 */
class CollectionService
{
    /**
     * Get collection statistics.
     *
     * @return array
     */
    public function getStats(): array
    {
        return [
            'total' => Collection::count(),
            'active' => Collection::where('is_active', true)->count(),
            'featured' => Collection::where('type', 'featured')->count(),
        ];
    }

    /**
     * Get products for collection form.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getProductsForForm()
    {
        return Product::with('artists')
            ->active()
            ->orderBy('name')
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'image_url' => $product->image_url,
                'artists' => $product->artists->pluck('name')->join(', '),
            ]);
    }

    /**
     * Upload image to Supabase storage.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return string
     */
    public function uploadImage(UploadedFile $file, string $folder = 'collections'): string
    {
        return $file->store($folder, 'supabase');
    }

    /**
     * Delete image from Supabase storage.
     *
     * @param string|null $path
     * @return void
     */
    public function deleteImage(?string $path): void
    {
        if (!$path || filter_var($path, FILTER_VALIDATE_URL)) {
            return;
        }

        try {
            Storage::disk('supabase')->delete($path);
        } catch (\Exception $e) {
            Log::warning('Failed to delete collection image', [
                'image_path' => $path,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Sync products to collection with positions.
     *
     * @param Collection $collection
     * @param array|null $products
     * @return void
     */
    public function syncProducts(Collection $collection, ?array $products): void
    {
        if ($products === null) {
            $collection->products()->detach();
            return;
        }

        $syncData = [];
        foreach ($products as $product) {
            $syncData[$product['id']] = ['position' => $product['position']];
        }

        $collection->products()->sync($syncData);
    }

    /**
     * Handle image upload for collection update.
     * Deletes old image if new one is uploaded.
     *
     * @param Collection $collection
     * @param UploadedFile|null $newImage
     * @return string|null
     */
    public function handleImageUpdate(Collection $collection, ?UploadedFile $newImage): ?string
    {
        if (!$newImage) {
            return null;
        }

        // Delete old image
        if ($collection->image) {
            $this->deleteImage($collection->image);
        }

        // Upload new image
        return $this->uploadImage($newImage, 'collections');
    }
}
