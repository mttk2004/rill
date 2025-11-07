<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /**
     * Display a listing of products for admin.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);
        $search = trim((string) $request->get('search', ''));
        $status = $request->get('status'); // active/inactive/out_of_stock
        $genre = $request->get('genre');
        $featured = $request->get('featured'); // yes/no
        $stock = $request->get('stock'); // low/out
        $sort = $request->get('sort', 'newest');

        $query = Product::query()->withTrashed();

        // Search
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('sku', 'like', "%{$search}%")
                  ->orWhere('genre', 'like', "%{$search}%")
                  ->orWhere('label', 'like', "%{$search}%")
                  ->orWhereHas('artists', function ($artistQuery) use ($search) {
                      $artistQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($status === 'active') {
            $query->where('status', 'active');
        } elseif ($status === 'inactive') {
            $query->where('status', 'inactive');
        } elseif ($status === 'out_of_stock') {
            $query->where('status', 'out_of_stock');
        }

        // Genre filter
        if ($genre && $genre !== 'all-genres') {
            $query->where('genre', $genre);
        }

        // Featured filter
        if ($featured === 'yes') {
            $query->where('is_featured', true);
        } elseif ($featured === 'no') {
            $query->where('is_featured', false);
        }

        // Stock filter
        if ($stock === 'low_stock') {
            // Sắp hết: tồn kho <= mức tối thiểu và > 0
            $query->whereColumn('stock_quantity', '<=', 'min_stock_level')
                  ->where('stock_quantity', '>', 0);
        } elseif ($stock === 'out_of_stock') {
            // Hết hàng: tồn kho = 0
            $query->where('stock_quantity', 0);
        } elseif ($stock === 'in_stock') {
            // Còn hàng: tồn kho > mức tối thiểu (không bao gồm sắp hết)
            $query->whereColumn('stock_quantity', '>', 'min_stock_level');
        }

        // Sorting
        switch ($sort) {
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name_desc':
                $query->orderBy('name', 'desc');
                break;
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'stock_asc':
                $query->orderBy('stock_quantity', 'asc');
                break;
            case 'stock_desc':
                $query->orderBy('stock_quantity', 'desc');
                break;
            case 'sold_desc':
                $query->withCount('orderItems')
                      ->orderBy('order_items_count', 'desc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            default:
                $query->orderBy('name', 'asc');
                break;
        }

        // Eager load relationships and aggregate data
        $products = $query->with(['artists' => function ($q) {
            $q->wherePivot('role', 'main')->orderByPivot('sort_order');
        }])
        ->withCount('orderItems')
        ->paginate($perPage)
        ->withQueryString();

        // Add total sold quantity for each product
        $products->getCollection()->transform(function ($product) {
            $product->total_sold = DB::table('order_items')
                ->where('product_id', $product->id)
                ->sum('quantity');
            return $product;
        });

        // Stats
        $stats = [
            'total' => Product::count(),
            'active' => Product::where('status', 'active')->count(),
            'out_of_stock' => Product::where('status', 'out_of_stock')->orWhere('stock_quantity', 0)->count(),
            'low_stock' => Product::whereColumn('stock_quantity', '<=', 'min_stock_level')
                                  ->where('stock_quantity', '>', 0)
                                  ->count(),
            'featured' => Product::where('is_featured', true)->count(),
        ];

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

        return Inertia::render('admin/products', [
            'products' => $products,
            'stats' => $stats,
            'genres' => $genres,
            'labels' => $labels,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'genre' => $genre,
                'featured' => $featured,
                'stock' => $stock,
                'sort' => $sort,
            ],
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
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        // Generate slug
        $validated['slug'] = Str::slug($validated['name']);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/products'), $imageName);
            $validated['image'] = '/images/products/' . $imageName;
        }

        $product = Product::create($validated);

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
                $query->latest()->limit(10);
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
            ->limit(10)
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
            'image' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:2048',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('images/products'), $imageName);
            $validated['image'] = '/images/products/' . $imageName;

            // Delete old image if exists
            if ($product->image && file_exists(public_path($product->image))) {
                @unlink(public_path($product->image));
            }
        }

        $product->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'product' => $product,
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
