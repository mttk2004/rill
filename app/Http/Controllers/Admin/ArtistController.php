<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreArtistRequest;
use App\Http\Requests\Admin\UpdateArtistRequest;
use App\Models\Artist;
use App\Services\ArtistService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ArtistController extends Controller
{
    public function __construct(
        private ArtistService $artistService
    ) {}
    /**
     * Display a listing of artists for admin.
     */
    public function index(Request $request)
    {
        $filters = [
            'per_page' => (int) $request->get('per_page', 20),
            'search' => $request->get('search', ''),
            'country' => $request->get('country', 'all'),
            'status' => $request->get('status', 'all'),
            'sort' => $request->get('sort', 'name_asc'),
        ];

        $artists = $this->artistService->getFilteredArtists($filters);
        $stats = $this->artistService->getStats();
        $countries = $this->artistService->getCountries();

        return Inertia::render('admin/artists/ArtistList', [
            'artists' => $artists,
            'stats' => $stats,
            'countries' => $countries,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new artist.
     */
    public function create()
    {
        return Inertia::render('admin/artists/ArtistForm', [
            'countries' => $this->artistService->getCountries(),
        ]);
    }

    /**
     * Store a newly created artist in storage.
     */
    public function store(StoreArtistRequest $request)
    {
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->artistService->uploadImage($request->file('image'));
        }

        Artist::create($validated);

        return redirect()->route('admin.artists');
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

        return Inertia::render('admin/artists/ArtistForm', [
            'artist' => $artist,
            'countries' => $this->artistService->getCountries(),
        ]);
    }

    /**
     * Update the specified artist in storage.
     */
    public function update(UpdateArtistRequest $request, string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->artistService->handleImageUpdate(
                $artist,
                $request->file('image')
            );
        }

        $artist->update($validated);

        return redirect()->route('admin.artists');
    }

    /**
     * Remove the specified artist (soft delete).
     */
    public function destroy(string $id)
    {
        $artist = Artist::findOrFail($id);
        $artist->delete();

        return redirect()->back();
    }

    /**
     * Restore a deleted artist.
     */
    public function restore(string $id)
    {
        $artist = Artist::withTrashed()->findOrFail($id);
        $artist->restore();

        return redirect()->back();
    }
}
