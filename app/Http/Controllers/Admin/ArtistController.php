<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ArtistController extends Controller
{
    /**
     * Display a listing of artists for admin.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);
        $search = trim((string) $request->get('search', ''));
        $country = $request->get('country', 'all');
        $status = $request->get('status', 'all');
        $sort = $request->get('sort', 'name_asc');

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

        // Get unique countries for filters
        $countries = Artist::whereNotNull('country')
            ->distinct()
            ->pluck('country')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        // Eager load relationships and counts
        $artists = $query->withCount('products')
            ->paginate($perPage)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Artist::count(),
            'with_products' => Artist::has('products')->count(),
            'without_products' => Artist::doesntHave('products')->count(),
            'total_products' => DB::table('artist_product')->count(),
        ];

        return Inertia::render('admin/artists/index', [
            'artists' => $artists,
            'stats' => $stats,
            'countries' => $countries,
            'filters' => $request->only(['search', 'country', 'status', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new artist.
     */
    public function create()
    {
        // Get unique countries for dropdown
        $countries = Artist::whereNotNull('country')
            ->distinct()
            ->pluck('country')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        return Inertia::render('admin/artists/create', [
            'countries' => $countries,
        ]);
    }

    /**
     * Store a newly created artist in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'country' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:500',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('artists', 'supabase');
            $validated['image'] = $path;
        }

        $artist = Artist::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Nghệ sĩ đã được tạo thành công',
            'artist' => $artist->fresh(),
        ]);
    }

    /**
     * Display the specified artist (for AJAX requests).
     */
    public function show(Request $request, string $id)
    {
        $artist = Artist::with([
            'products' => function ($query) {
                $query->withCount('orderItems')
                      ->orderBy('created_at', 'desc');
            },
        ])->withCount('products')
          ->withTrashed()
          ->findOrFail($id);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json($artist);
        }

        // Fallback to Inertia render (though this shouldn't be used anymore)
        return Inertia::render('admin/artists/show', [
            'artist' => $artist,
        ]);
    }

    /**
     * Show the form for editing the specified artist.
     */
    public function edit(string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);

        // Get unique countries for dropdown
        $countries = Artist::whereNotNull('country')
            ->distinct()
            ->pluck('country')
            ->filter()
            ->sort()
            ->values()
            ->toArray();

        return Inertia::render('admin/artists/edit', [
            'artist' => $artist,
            'countries' => $countries,
        ]);
    }

    /**
     * Update the specified artist in storage.
     */
    public function update(Request $request, string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'country' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif,webp|max:500',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($artist->image && !filter_var($artist->image, FILTER_VALIDATE_URL)) {
                Storage::disk('supabase')->delete($artist->image);
            }

            // Store new image
            $path = $request->file('image')->store('artists', 'supabase');
            $validated['image'] = $path;
        }

        $artist->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật nghệ sĩ thành công',
            'artist' => $artist->fresh(),
        ]);
    }

    /**
     * Remove the specified artist (soft delete).
     */
    public function destroy(string $id)
    {
        $artist = Artist::findOrFail($id);
        $artist->delete();

        return response()->json([
            'success' => true,
            'message' => 'Nghệ sĩ đã được xóa thành công',
        ]);
    }

    /**
     * Restore a deleted artist.
     */
    public function restore(string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);
        $artist->restore();

        return response()->json([
            'success' => true,
            'message' => 'Nghệ sĩ đã được khôi phục thành công',
        ]);
    }
}
