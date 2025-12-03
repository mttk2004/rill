<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CollectionController extends Controller
{
    /**
     * Display a listing of collections.
     */
    public function index(Request $request)
    {
        $query = Collection::query()->withCount('products');

        // Search
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($type = $request->get('type')) {
            if ($type !== 'all') {
                $query->where('type', $type);
            }
        }

        // Status filter
        if ($status = $request->get('status')) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Sorting
        $sort = $request->get('sort', 'name_asc');
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'newest':
                $query->orderBy('created_at', 'desc');
                break;
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        $collections = $query->paginate(20);

        // Stats
        $stats = [
            'total' => Collection::count(),
            'active' => Collection::where('is_active', true)->count(),
            'featured' => Collection::where('type', 'featured')->count(),
        ];

        return Inertia::render('admin/collections/CollectionList', [
            'collections' => $collections,
            'stats' => $stats,
            'filters' => [
                'search' => $request->get('search', ''),
                'type' => $request->get('type', 'all'),
                'status' => $request->get('status', 'all'),
                'sort' => $request->get('sort', 'name_asc'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new collection.
     */
    public function create()
    {
        // Get products for selection
        $products = Product::with('artists')
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

        return Inertia::render('admin/collections/CollectionForm', [
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created collection.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug',
            'type' => 'required|in:featured,banner,promotion,curated',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required_with:products|exists:products,id',
            'products.*.position' => 'required_with:products|integer|min:0',
        ]);

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->uploadImage($request->file('image'), 'collections');
        }

        $collection = Collection::create($validated);

        // Attach products with positions
        if (!empty($validated['products'])) {
            $syncData = [];
            foreach ($validated['products'] as $product) {
                $syncData[$product['id']] = ['position' => $product['position']];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index');
    }

    /**
     * Display the specified collection.
     */
    public function show(string $id)
    {
        $collection = Collection::with(['products' => function ($query) {
            $query->with('artists')->orderBy('collection_product.position');
        }])->withCount('products')->findOrFail($id);

        return Inertia::render('admin/collections/show', [
            'collection' => $collection,
        ]);
    }

    /**
     * Show the form for editing the specified collection.
     */
    public function edit(string $id)
    {
        $collection = Collection::with(['products' => function ($query) {
            $query->with('artists')->orderBy('collection_product.position');
        }])->findOrFail($id);

        // Get all products for selection
        $allProducts = Product::with('artists')
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

        // Prepare collection data with image_url for preview
        $collectionData = $collection->toArray();
        // Ensure image_url is used for preview in form
        if ($collection->image_url) {
            $collectionData['image'] = $collection->image_url;
        }

        return Inertia::render('admin/collections/CollectionForm', [
            'collection' => $collectionData,
            'allProducts' => $allProducts,
        ]);
    }

    /**
     * Update the specified collection.
     */
    public function update(Request $request, string $id)
    {
        $collection = Collection::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:collections,slug,' . $collection->id,
            'type' => 'required|in:featured,banner,promotion,curated',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.id' => 'required_with:products|exists:products,id',
            'products.*.position' => 'required_with:products|integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($collection->image) {
                $this->deleteImage($collection->image);
            }
            $validated['image'] = $this->uploadImage($request->file('image'), 'collections');
        }

        $collection->update($validated);

        // Update products with positions
        if (isset($validated['products'])) {
            $syncData = [];
            foreach ($validated['products'] as $product) {
                $syncData[$product['id']] = ['position' => $product['position']];
            }
            $collection->products()->sync($syncData);
        }

        return redirect()->route('admin.collections.index');
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(string $id)
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();

        return redirect()->back();
    }

    /**
     * Toggle collection active status.
     */
    public function toggleStatus(string $id)
    {
        $collection = Collection::findOrFail($id);
        $collection->update(['is_active' => !$collection->is_active]);

        return back()->with('success', 'Trạng thái collection đã được cập nhật!');
    }

    /**
     * Upload image to Supabase storage
     */
    private function uploadImage($file, string $folder = 'collections'): string
    {
        return $file->store($folder, 'supabase');
    }

    /**
     * Delete image from Supabase storage
     */
    private function deleteImage(string $path): void
    {
        if ($path && !filter_var($path, FILTER_VALIDATE_URL)) {
            try {
                Storage::disk('supabase')->delete($path);
            } catch (\Exception $e) {
                \Log::warning('Failed to delete collection image', [
                    'image_path' => $path,
                    'error' => $e->getMessage()
                ]);
            }
        }
    }
}
