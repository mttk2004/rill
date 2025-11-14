<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\ProductAdminService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    protected ProductAdminService $productService;

    public function __construct(ProductAdminService $productService)
    {
        $this->productService = $productService;
    }
    /**
     * Display a listing of products for admin.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);

        $filters = [
            'search' => $request->get('search'),
            'status' => $request->get('status'),
            'genre' => $request->get('genre'),
            'featured' => $request->get('featured'),
            'stock' => $request->get('stock'),
            'sort' => $request->get('sort', 'newest'),
        ];

        $query = $this->productService->buildProductQuery($filters);

        // Eager load relationships
        $products = $query->with(['artists' => function ($q) {
            $q->wherePivot('role', 'main')->orderByPivot('sort_order');
        }])
        ->withCount('orderItems')
        ->paginate($perPage)
        ->withQueryString();

        // Add sales data efficiently (no N+1 queries)
        $this->productService->enrichProductsWithSalesData($products->getCollection());

        // Get stats
        $stats = $this->productService->getProductStats();

        // Get unique genres for filter dropdown
        $genres = Product::select('genre')
            ->distinct()
            ->whereNotNull('genre')
            ->orderBy('genre')
            ->pluck('genre');

        // Get unique labels for form dropdown
        $labels = Product::select('label')
            ->distinct()
            ->whereNotNull('label')
            ->orderBy('label')
            ->pluck('label');

        // Get all artists for form dropdown
        $artists = \App\Models\Artist::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/products/index', [
            'products' => $products,
            'stats' => $stats,
            'genres' => $genres,
            'labels' => $labels,
            'artists' => $artists,
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        $genres = Product::select('genre')
            ->distinct()
            ->whereNotNull('genre')
            ->orderBy('genre')
            ->pluck('genre');

        $labels = Product::select('label')
            ->distinct()
            ->whereNotNull('label')
            ->orderBy('label')
            ->pluck('label');

        $artists = \App\Models\Artist::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/products/create', [
            'genres' => $genres,
            'labels' => $labels,
            'artists' => $artists,
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'min_stock_level' => 'required|integer|min:0',
            'genre' => 'nullable|string|max:100',
            'label' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,out_of_stock',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:500',
            'artists' => 'nullable|array',
            'artists.*.artist_id' => 'required_with:artists|exists:artists,id',
            'artists.*.role' => 'required_with:artists|in:main,featured,composer,producer',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'supabase');
        }

        $product = Product::create($validated);

        // Sync artists
        $this->productService->syncArtists(
            $product,
            $validated['artists'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Tạo sản phẩm mới thành công',
            'product' => $product,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(Request $request, string $id)
    {
        $product = Product::with([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
            'reviews' => function ($query) {
                $query->with('user:id,name')->latest()->limit(config('pagination.admin.recent_items'));
            },
        ])
        ->withCount('reviews')
        ->withTrashed()
        ->findOrFail($id);

        // Calculate total sold
        $product->total_sold = DB::table('order_items')
            ->where('product_id', $product->id)
            ->sum('quantity');

        // Calculate total revenue
        $product->total_revenue = DB::table('order_items')
            ->where('product_id', $product->id)
            ->sum(DB::raw('quantity * unit_price'));

        // Get recent orders
        $product->recent_orders = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('order_items.product_id', $product->id)
            ->select(
                'orders.id',
                'orders.order_number',
                'orders.status',
                'orders.placed_at',
                'order_items.quantity',
                'order_items.unit_price'
            )
            ->orderBy('orders.placed_at', 'desc')
            ->limit(config('pagination.admin.recent_items'))
            ->get();

        // If AJAX request, return JSON
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'props' => [
                    'product' => $product,
                ],
            ]);
        }

        // Otherwise redirect to products list (we use dialog for details)
        return redirect()->route('admin.products');
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(string $id)
    {
        $product = Product::with([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
        ])->findOrFail($id);

        $genres = Product::select('genre')
            ->distinct()
            ->whereNotNull('genre')
            ->orderBy('genre')
            ->pluck('genre');

        $labels = Product::select('label')
            ->distinct()
            ->whereNotNull('label')
            ->orderBy('label')
            ->pluck('label');

        $artists = \App\Models\Artist::select('id', 'name')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('admin/products/edit', [
            'product' => $product,
            'genres' => $genres,
            'labels' => $labels,
            'artists' => $artists,
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::withTrashed()->findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:100|unique:products,sku,' . $product->id,
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'cost_price' => 'nullable|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'genre' => 'nullable|string|max:100',
            'label' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,out_of_stock',
            'is_featured' => 'boolean',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:500',
            'artists' => 'nullable|array',
            'artists.*.artist_id' => 'required_with:artists|exists:artists,id',
            'artists.*.role' => 'required_with:artists|in:main,featured,composer,producer',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            try {
                $validated['image'] = $this->productService->handleImageUpload(
                    $product,
                    $request->file('image')
                );
            } catch (\Exception $e) {
                \Log::error('Failed to upload product image', [
                    'product_id' => $product->id,
                    'error' => $e->getMessage()
                ]);
                throw $e;
            }
        }

        $product->update($validated);

        // Sync artists
        $this->productService->syncArtists(
            $product,
            $validated['artists'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product->fresh(),
        ]);
    }

    /**
     * Remove the specified product from storage (soft delete).
     */
    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->back()->with('success', 'Sản phẩm đã được xóa thành công');
    }

    /**
     * Restore the specified product.
     */
    public function restore(string $id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $product->restore();

        return redirect()->back()->with('success', 'Sản phẩm đã được khôi phục thành công');
    }
}
