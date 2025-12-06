<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * Product Media Service
 *
 * Handles all product media operations: images, artist associations
 * Separated from CRUD and query operations for better organization
 */
class ProductMediaService
{
    /**
     * Upload product image.
     *
     * @param int $productId
     * @param UploadedFile $image
     * @return \App\Support\ServiceResult
     */
    public function uploadImage(int $productId, UploadedFile $image): \App\Support\ServiceResult
    {
        try {
            $product = Product::findOrFail($productId);

            $imagePath = $this->handleImageUpload($product, $image);

            $product->update(['image' => $imagePath]);

            return \App\Support\ServiceResult::success(
                'Hình ảnh đã được tải lên thành công.'
            );
        } catch (\Exception $e) {
            return \App\Support\ServiceResult::error('Không thể tải lên hình ảnh: ' . $e->getMessage());
        }
    }

    /**
     * Handle image upload for product.
     *
     * Manages product image uploads to Supabase storage. Deletes the old image
     * if it exists (excluding external URLs), then stores the new image.
     *
     * @param Product $product The product to update image for
     * @param \Illuminate\Http\UploadedFile $imageFile The uploaded image file
     * @return string The storage path of the newly uploaded image
     */
    public function handleImageUpload(Product $product, $imageFile): string
    {
        // Delete old image if exists
        if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
            try {
                Storage::disk('supabase')->delete($product->image);
            } catch (\Exception $e) {
                // Log error but don't fail - old image might already be deleted
                \Log::warning('Failed to delete old product image: ' . $e->getMessage());
            }
        }

        // Store new image
        $path = $imageFile->store('products', 'supabase');

        return $path;
    }

    /**
     * Sync product artists.
     *
     * Updates the many-to-many relationship between a product and artists.
     * Handles both attaching new artists and detaching removed ones.
     *
     * @param Product $product The product to sync artists for
     * @param array|null $artists Array of artist IDs, or null to detach all
     * @return void
     */
    public function syncArtists(Product $product, ?array $artists): void
    {
        if ($artists === null || empty($artists)) {
            $product->artists()->detach();
            return;
        }

        // Prepare sync data with pivot fields
        $syncData = [];
        foreach ($artists as $artistData) {
            // Handle both array and object format
            if (is_array($artistData)) {
                $artistId = $artistData['artist_id'] ?? null;
                $role = $artistData['role'] ?? 'main';
                $sortOrder = $artistData['sort_order'] ?? 0;
            } else if (is_object($artistData)) {
                $artistId = $artistData->artist_id ?? null;
                $role = $artistData->role ?? 'main';
                $sortOrder = $artistData->sort_order ?? 0;
            } else {
                // Simple artist ID format (backward compatibility)
                $artistId = $artistData;
                $role = 'main';
                $sortOrder = 0;
            }

            if ($artistId) {
                $syncData[$artistId] = [
                    'role' => $role,
                    'sort_order' => $sortOrder,
                ];
            }
        }

        $product->artists()->sync($syncData);
    }

    /**
     * Delete product image.
     *
     * @param int $productId
     * @return \App\Support\ServiceResult
     */
    public function deleteImage(int $productId): \App\Support\ServiceResult
    {
        try {
            $product = Product::findOrFail($productId);

            if ($product->image && !filter_var($product->image, FILTER_VALIDATE_URL)) {
                Storage::disk('supabase')->delete($product->image);
            }

            $product->update(['image' => null]);

            return \App\Support\ServiceResult::success('Hình ảnh đã được xóa thành công.');
        } catch (\Exception $e) {
            return \App\Support\ServiceResult::error('Không thể xóa hình ảnh: ' . $e->getMessage());
        }
    }
}
