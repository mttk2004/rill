<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Artist;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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

        return Inertia::render('admin/artists', [
            'artists' => $artists,
            'stats' => $stats,
            'countries' => $countries,
            'filters' => $request->only(['search', 'country', 'status', 'sort']),
        ]);
    }

    /**
     * Display the specified artist.
     */
    public function show(Request $request, string $id)
    {
        $artist = Artist::with([
            'products' => function ($query) {
                $query->withCount('orderItems')
                      ->orderBy('created_at', 'desc')
                      ->limit(10);
            },
        ])->withCount('products')
          ->findOrFail($id);

        // If AJAX request, return JSON
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'props' => [
                    'artist' => $artist,
                ],
            ]);
        }

        // Otherwise redirect to list (we use dialog for details)
        return redirect()->route('admin.artists');
    }

    /**
     * Remove the specified artist (soft delete).
     */
    public function destroy(string $id)
    {
        $artist = Artist::findOrFail($id);
        $artist->delete();

        return redirect()->back()->with('success', 'Nghệ sĩ đã được xóa');
    }

    /**
     * Restore a deleted artist.
     */
    public function restore(string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);
        $artist->restore();

        return redirect()->back()->with('success', 'Nghệ sĩ đã được khôi phục');
    }
}
