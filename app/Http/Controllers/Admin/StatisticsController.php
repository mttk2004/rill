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

class StatisticsController extends Controller
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
            ->whereBetween('orders.placed_at', [$startDate, $endDate])
            ->where('orders.status', '!=', OrderStatus::CANCELLED->value)
            ->select(
                'products.id',
                'products.name',
                'products.sku',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('SUM(order_items.total_price) as total_revenue')
            )
            ->groupBy('products.id', 'products.name', 'products.sku')
            ->orderByDesc('total_revenue')
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'sku' => $item->sku,
                    'sales' => (int) $item->total_quantity,
                    'revenue' => (float) $item->total_revenue,
                ];
            });

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
                        'full_name' => $order->shipping_full_name,
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
                    'shipping_full_name' => $order->shipping_full_name,
                    'has_shipping_name' => !empty($order->shipping_full_name),
                ]);

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status->value,
                    'created_at' => $order->placed_at->toISOString(),
                    'shipping_address' => [
                        'full_name' => $order->shipping_full_name ?? 'N/A',
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

        return Inertia::render('admin/Dashboard', [
            'dashboardStats' => [
                'revenue' => $stats['revenue']['value'],
                'newOrders' => $stats['orders']['value'],
                'customers' => $stats['customers']['value'],
                'lowStock' => $lowStockProducts->count(),
            ],
            'topProducts' => $topProducts,
            'genreData' => [], // TODO: Implement genre revenue data
            'trendingArtists' => [], // TODO: Implement trending artists data
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
