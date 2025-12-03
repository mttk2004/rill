<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCollectionRequest;
use App\Http\Requests\Admin\UpdateCollectionRequest;
use App\Models\Collection;
use App\Services\CollectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function __construct(
        protected CollectionService $collectionService
    ) {}
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

        return Inertia::render('admin/collections/CollectionList', [
            'collections' => $collections,
            'stats' => $this->collectionService->getStats(),
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
        return Inertia::render('admin/collections/CollectionForm', [
            'products' => $this->collectionService->getProductsForForm(),
        ]);
    }

    /**
     * Store a newly created collection.
     */
    public function store(StoreCollectionRequest $request)
    {
        $validated = $request->validated();

        // Generate slug if not provided
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->collectionService->uploadImage($request->file('image'));
        }

        $collection = Collection::create($validated);

        // Sync products
        if (isset($validated['products'])) {
            $this->collectionService->syncProducts($collection, $validated['products']);
        }

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection đã được tạo thành công');
    }

    /**
     * Display the specified collection.
     */
    public function show(string $id)
    {
        $collection = Collection::with(['products' => function ($query) {
            $query->with('artists')->orderBy('collection_product.position');
        }])->withCount('products')->findOrFail($id);

        return response()->json(['collection' => $collection]);
    }

    /**
     * Show the form for editing the specified collection.
     */
    public function edit(string $id)
    {
        $collection = Collection::with(['products' => function ($query) {
            $query->with('artists')->orderBy('collection_product.position');
        }])->findOrFail($id);

        // Prepare collection data
        $collectionData = $collection->toArray();
        if ($collection->image_url) {
            $collectionData['image'] = $collection->image_url;
        }

        return Inertia::render('admin/collections/CollectionForm', [
            'collection' => $collectionData,
            'allProducts' => $this->collectionService->getProductsForForm(),
        ]);
    }

    /**
     * Update the specified collection.
     */
    public function update(UpdateCollectionRequest $request, string $id)
    {
        $collection = Collection::findOrFail($id);
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->collectionService->handleImageUpdate(
                $collection,
                $request->file('image')
            );
        }

        $collection->update($validated);

        // Sync products
        if (isset($validated['products'])) {
            $this->collectionService->syncProducts($collection, $validated['products']);
        }

        return redirect()->route('admin.collections.index')
            ->with('success', 'Collection đã được cập nhật thành công');
    }

    /**
     * Remove the specified collection.
     */
    public function destroy(string $id)
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();

        return redirect()->back()
            ->with('success', 'Collection đã được xóa thành công');
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

}
