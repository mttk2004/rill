<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startDate = $request->get('start_date', now()->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // Convert to Carbon instances
        $startDate = Carbon::parse($startDate);
        $endDate = Carbon::parse($endDate);

        // Get previous period for comparison
        $daysDiff = $startDate->diffInDays($endDate);
        $prevStartDate = $startDate->copy()->subDays($daysDiff + 1);
        $prevEndDate = $startDate->copy()->subDay();

        // Current period stats
        $currentRevenue = Order::whereBetween('placed_at', [$startDate, $endDate])
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->sum('total_amount');

        $currentOrders = Order::whereBetween('placed_at', [$startDate, $endDate])
            ->count();

        $currentCustomers = User::whereBetween('created_at', [$startDate, $endDate])
            ->where('role', 'customer')
            ->count();

        $currentProducts = Product::whereBetween('created_at', [$startDate, $endDate])
            ->count();

        // Previous period stats
        $prevRevenue = Order::whereBetween('placed_at', [$prevStartDate, $prevEndDate])
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->sum('total_amount');

        $prevOrders = Order::whereBetween('placed_at', [$prevStartDate, $prevEndDate])
            ->count();

        $prevCustomers = User::whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->where('role', 'customer')
            ->count();

        $prevProducts = Product::whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->count();

        // Calculate percentage changes
        $revenueChange = $prevRevenue > 0
            ? round((($currentRevenue - $prevRevenue) / $prevRevenue) * 100, 1)
            : 0;

        $ordersChange = $prevOrders > 0
            ? round((($currentOrders - $prevOrders) / $prevOrders) * 100, 1)
            : 0;

        $customersChange = $prevCustomers > 0
            ? round((($currentCustomers - $prevCustomers) / $prevCustomers) * 100, 1)
            : 0;

        $productsChange = $prevProducts > 0
            ? round((($currentProducts - $prevProducts) / $prevProducts) * 100, 1)
            : 0;

        // Stats summary
        $stats = [
            'revenue' => [
                'value' => $currentRevenue,
                'change' => $revenueChange,
                'trend' => $revenueChange >= 0 ? 'up' : 'down',
            ],
            'orders' => [
                'value' => $currentOrders,
                'change' => $ordersChange,
                'trend' => $ordersChange >= 0 ? 'up' : 'down',
            ],
            'customers' => [
                'value' => $currentCustomers,
                'change' => $customersChange,
                'trend' => $customersChange >= 0 ? 'up' : 'down',
            ],
            'products' => [
                'value' => $currentProducts,
                'change' => $productsChange,
                'trend' => $productsChange >= 0 ? 'up' : 'down',
            ],
        ];

        // Daily revenue chart data (last 30 days)
        $dailyRevenue = Order::where('placed_at', '>=', now()->subDays(30))
            ->where('status', '!=', OrderStatus::CANCELLED)
            ->select(
                DB::raw('DATE(placed_at) as date'),
                DB::raw('SUM(total_amount) as revenue'),
                DB::raw('COUNT(*) as orders')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date, // Keep ISO format Y-m-d for JavaScript parsing
                    'revenue' => (float) $item->revenue,
                    'orders' => (int) $item->orders,
                ];
            });

        // Order status distribution
        $ordersByStatus = Order::whereBetween('placed_at', [$startDate, $endDate])
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => $item->status,
                    'count' => $item->count,
                ];
            });

        // Top selling products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            // ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                'products.image',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.sku', 'products.image')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'image' => $item->image,
                    'sales' => (int) $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

        \Log::info('Top Products Query Result', ['count' => $topProducts->count(), 'data' => $topProducts->toArray()]);

        // Low stock products
        $lowStockProducts = Product::whereColumn('stock_quantity', '<=', 'min_stock_level')
            ->orWhere(function ($query) {
                $query->where('stock_quantity', '<=', 5)
                      ->whereNull('min_stock_level');
            })
            ->select('id', 'name', 'slug', 'image', 'stock_quantity', 'min_stock_level')
            ->orderBy('stock_quantity')
            ->limit(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image,
                    'stock_quantity' => $product->stock_quantity,
                    'min_stock_level' => $product->min_stock_level ?? 5,
                ];
            });

        // Pending orders
        $pendingOrders = Order::where('status', OrderStatus::PENDING)
            ->orderByDesc('placed_at')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'created_at' => $order->placed_at->toISOString(),
                    'shipping_address' => [
                        'full_name' => $order->shipping_address['full_name'] ?? 'N/A',
                    ],
                ];
            });

        // Recent orders
        $recentOrders = Order::with(['user', 'items.product', 'payment'])
            ->orderByDesc('placed_at')
            ->limit(config('pagination.admin.recent_items'))
            ->get()
            ->map(function ($order) {
                \Log::info('Recent Order Data', [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'shipping_address' => $order->shipping_address,
                    'full_name' => $order->shipping_address['full_name'] ?? null,
                ]);

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status->value,
                    'created_at' => $order->placed_at->toISOString(),
                    'shipping_address' => [
                        'full_name' => $order->shipping_address['full_name'] ?? 'N/A',
                    ],
                ];
            });

        // Revenue by payment method
        $revenueByPaymentMethod = Order::join('payments', 'orders.id', '=', 'payments.order_id')
            ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'payments.payment_method',
                DB::raw('SUM(orders.total_amount) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->groupBy('payments.payment_method')
            ->get()
            ->map(function ($item) {
                return [
                    'method' => $item->payment_method,
                    'total' => (float) $item->total,
                    'count' => (int) $item->count,
                ];
            });

        // Revenue by genre (top 9 + others)
        $allGenres = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            // ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->whereNotNull('products.genre')
            ->select(
                'products.genre',
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('products.genre')
            ->orderByDesc('total_revenue')
            ->get();

        // Take top 9 genres
        $topGenres = $allGenres->take(9)->map(function ($item) {
            return [
                'name' => ucfirst($item->genre),
                'value' => (float) $item->total_revenue,
            ];
        });

        // Sum remaining genres as "Khác"
        $othersRevenue = $allGenres->skip(9)->sum('total_revenue');
        if ($othersRevenue > 0) {
            $topGenres->push([
                'name' => 'Khác',
                'value' => (float) $othersRevenue,
            ]);
        }

        $genreRevenue = $topGenres;

        \Log::info('Genre Revenue Query Result', ['count' => $genreRevenue->count(), 'data' => $genreRevenue->toArray()]);

        // Trending artists (by sales volume)
        $trendingArtists = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('artist_product', 'products.id', '=', 'artist_product.product_id')
            ->join('artists', 'artist_product.artist_id', '=', 'artists.id')
            // ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'artists.id',
                'artists.name',
                'artists.country',
                'artists.image',
                DB::raw('SUM(order_items.quantity) as total_sales')
            )
            ->groupBy('artists.id', 'artists.name', 'artists.country', 'artists.image')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'country' => $item->country ?? 'N/A',
                    'sales' => (int) $item->total_sales,
                    'image' => $item->image,
                ];
            });

        \Log::info('Trending Artists Query Result', ['count' => $trendingArtists->count(), 'data' => $trendingArtists->toArray()]);

        return Inertia::render('admin/Dashboard', [
            'dashboardStats' => [
                'revenue' => $stats['revenue']['value'],
                'newOrders' => $stats['orders']['value'],
                'customers' => $stats['customers']['value'],
                'lowStock' => $lowStockProducts->count(),
            ],
            'topProducts' => $topProducts,
            'genreData' => $genreRevenue,
            'trendingArtists' => $trendingArtists,
            'lowStockProducts' => $lowStockProducts,
            'pendingOrders' => $pendingOrders,
            'recentOrders' => $recentOrders,
            'revenueData' => $dailyRevenue,
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
        ]);
    }
}
