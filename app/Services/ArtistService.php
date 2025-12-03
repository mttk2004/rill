<?php

namespace App\Services;

use App\Models\Artist;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Artist Service
 *
 * Handles artist-related business logic
 */
class ArtistService
{
    /**
     * Get unique countries for filter/dropdown.
     *
     * @return array
     */
    public function getCountries(): array
    {
        return Artist::whereNotNull('country')
            ->distinct()
            ->pluck('country')
            ->filter()
            ->sort()
            ->values()
            ->toArray();
    }

    /**
     * Get artist statistics.
     *
     * @return array
     */
    public function getStats(): array
    {
        $artistStats = Artist::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN EXISTS (
                    SELECT 1 FROM artist_product WHERE artist_product.artist_id = artists.id
                ) THEN 1 ELSE 0 END) as with_products
            ')
            ->first();

        return [
            'total' => $artistStats->total,
            'with_products' => $artistStats->with_products,
            'without_products' => $artistStats->total - $artistStats->with_products,
            'total_products' => DB::table('artist_product')->count(),
        ];
    }

    /**
     * Upload artist image.
     *
     * @param UploadedFile $image
     * @return string
     */
    public function uploadImage(UploadedFile $image): string
    {
        return $image->store('artists', 'supabase');
    }

    /**
     * Delete artist image.
     *
     * @param string|null $imagePath
     * @return bool
     */
    public function deleteImage(?string $imagePath): bool
    {
        if ($imagePath && !filter_var($imagePath, FILTER_VALIDATE_URL)) {
            return Storage::disk('supabase')->delete($imagePath);
        }

        return false;
    }

    /**
     * Handle image update (delete old, upload new).
     *
     * @param Artist $artist
     * @param UploadedFile $newImage
     * @return string
     */
    public function handleImageUpdate(Artist $artist, UploadedFile $newImage): string
    {
        // Delete old image if exists
        $this->deleteImage($artist->image);

        // Upload new image
        return $this->uploadImage($newImage);
    }

    /**
     * Get filtered artists with pagination.
     *
     * @param array $filters
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getFilteredArtists(array $filters)
    {
        $perPage = $filters['per_page'] ?? 20;
        $search = trim($filters['search'] ?? '');
        $country = $filters['country'] ?? 'all';
        $status = $filters['status'] ?? 'all';
        $sort = $filters['sort'] ?? 'name_asc';

        $query = Artist::query()->withTrashed();

        // Search
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('country', 'like', "%{$search}%");
            });
        }

        // Country filter
        if ($country && $country !== 'all') {
            $query->where('country', $country);
        }

        // Status filter
        if ($status && $status !== 'all') {
            if ($status === 'active') {
                $query->whereNull('deleted_at')->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->whereNull('deleted_at')->where('is_active', false);
            } elseif ($status === 'deleted') {
                $query->whereNotNull('deleted_at');
            }
        }

        // Sorting
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'products_desc':
                $query->withCount('products')
                      ->orderBy('products_count', 'desc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'created_asc':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        // Eager load relationships and counts
        return $query->withCount('products')
            ->paginate($perPage)
            ->withQueryString();
    }
}
