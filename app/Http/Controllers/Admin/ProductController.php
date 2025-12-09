<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Product;
use App\QueryBuilders\ProductQueryBuilder;
use App\Services\ProductCrudService;
use App\Services\ProductMediaService;
use App\Services\ProductQueryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function __construct(
        protected ProductCrudService $productCrudService,
        protected ProductQueryService $productQueryService,
        protected ProductMediaService $productMediaService
    ) {}
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
            'sort' => $request->get('sort', 'name_asc'),
        ];

        // Build query using ProductQueryBuilder
        $queryBuilder = new ProductQueryBuilder(Product::query()->withTrashed());

        // Apply filters
        $queryBuilder->search($filters['search'] ?? null)
                    ->status($filters['status'] ?? null)
                    ->genre($filters['genre'] ?? null);

        // Stock filter
        if (($filters['stock'] ?? null) === 'low_stock') {
            $queryBuilder->lowStock();
        } elseif (($filters['stock'] ?? null) === 'out_of_stock') {
            $queryBuilder->outOfStock();
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        match ($sort) {
            'name_asc' => $queryBuilder->sortByName('asc'),
            'name_desc' => $queryBuilder->sortByName('desc'),
            'price_asc' => $queryBuilder->sortByPrice('asc'),
            'price_desc' => $queryBuilder->sortByPrice('desc'),
            'stock_asc' => $queryBuilder->orderBy('stock_quantity', 'asc'),
            'stock_desc' => $queryBuilder->orderBy('stock_quantity', 'desc'),
            'sold_desc' => $queryBuilder->bestSellers(),
            'oldest' => $queryBuilder->oldest(),
            default => $queryBuilder->newest(),
        };

        // Eager load relationships (include soft deleted products)
        $query = $queryBuilder->getQuery();

        // DEBUG: Log SQL query when sort is sold_desc
        if ($sort === 'sold_desc') {
            \Log::info('=== SQL QUERY DEBUG ===');
            \Log::info('SQL: ' . $query->toSql());
            \Log::info('Bindings: ' . json_encode($query->getBindings()));
        }
        $query->with([
            'artists' => function ($q) {
                $q->orderByPivot('sort_order');
            },
            'collections' => function ($query) {
                $query->where('is_active', true)
                    ->orderBy('name')
                    ->limit(1);
            }
        ]);

        // Only add withCount if not using bestSellers (which already includes it)
        if ($sort !== 'sold_desc') {
            $query->withCount('orderItems');
        }

        $products = $query->paginate($perPage)
            ->withQueryString();

        // Add sales data efficiently (no N+1 queries)
        // Skip enriching when sort is sold_desc because bestSellers() already calculated it
        if ($sort !== 'sold_desc') {
            $this->productQueryService->enrichProductsWithSalesData($products->getCollection());
        }

        // Get stats and form options
        $stats = $this->productQueryService->getProductStats();
        $formOptions = $this->productQueryService->getFormOptions();

        return Inertia::render('admin/products/ProductList', [
            'products' => $products,
            'stats' => $stats,
            'genres' => $formOptions['genres'],
            'labels' => $formOptions['labels'],
            'artists' => $formOptions['artists'],
            'filters' => $filters,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        return Inertia::render('admin/products/ProductForm', $this->productQueryService->getFormOptions());
    }

    /**
     * Store a newly created product.
     */
    public function store(StoreProductRequest $request)
    {
        $validated = $request->validated();

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'supabase');
        }

        $product = Product::create($validated);

        // Sync artists
        if (isset($validated['artists'])) {
            $this->productMediaService->syncArtists($product, $validated['artists']);
        }

        return redirect()->route('admin.products')
            ->with('success', 'Tạo sản phẩm mới thành công');
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

        // Return product data for detail dialog (opened from frontend)
        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit(string $id)
    {
        $product = Product::findOrFail($id);

        // Explicitly load artists relationship
        $product->load([
            'artists' => function ($query) {
                $query->orderByPivot('sort_order');
            },
        ]);

        return Inertia::render('admin/products/ProductForm', array_merge(
            ['product' => $product],
            $this->productQueryService->getFormOptions()
        ));
    }

    /**
     * Update the specified product.
     */
    public function update(UpdateProductRequest $request, string $id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $validated = $request->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $this->productMediaService->handleImageUpload(
                $product,
                $request->file('image')
            );
        }

        // Remove artists from update data to handle separately
        $artistsData = $validated['artists'] ?? null;
        unset($validated['artists']);

        $product->update($validated);

        // Sync artists only if explicitly provided in request
        // If artists key exists in request (even if empty), sync it
        // If artists key doesn't exist, keep current relationships
        if ($request->has('artists')) {
            $this->productMediaService->syncArtists($product, $artistsData);
        }

        return redirect()->route('admin.products')
            ->with('success', 'Cập nhật sản phẩm thành công');
    }

    /**
     * Remove the specified product from storage (soft delete).
     */
    public function destroy(string $id)
    {
        $result = $this->productCrudService->deleteProduct($id);

        if (!$result->success) {
            return redirect()->back()->with('error', $result->message);
        }

        return redirect()->back()->with('success', $result->message);
    }

    /**
     * Restore the specified product.
     */
    public function restore(string $id)
    {
        $result = $this->productCrudService->restoreProduct($id);

        if (!$result->success) {
            return redirect()->back()->with('error', $result->message);
        }

        return redirect()->back()->with('success', $result->message);
    }
}


