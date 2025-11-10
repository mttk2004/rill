<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers for admin.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);
        $search = trim((string) $request->get('search', ''));
        $status = $request->get('status'); // active/inactive
        $verified = $request->get('verified'); // verified/unverified
        $sort = $request->get('sort', 'newest');

        $query = User::query()->where('role', 'customer');

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        if ($verified === 'verified') {
            $query->whereNotNull('email_verified_at');
        } elseif ($verified === 'unverified') {
            $query->whereNull('email_verified_at');
        }

        // Sorting
        switch ($sort) {
            case 'name-asc':
                $query->orderBy('name', 'asc');
                break;
            case 'name-desc':
                $query->orderBy('name', 'desc');
                break;
            case 'orders-desc':
                $query->withCount('orders')->orderBy('orders_count', 'desc');
                break;
            case 'spent-desc':
                // If there's a cached spent column or relation, use it. Fallback to newest.
                $query->orderBy('created_at', 'desc');
                break;
            case 'recent-order':
                // Not implemented: fallback
            case 'newest':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Eager load order count for display
        $users = $query->withCount('orders')->paginate($perPage)->withQueryString();

        // Some quick stats
        $total = User::where('role', 'customer')->count();
        $active = User::where('role', 'customer')->where('is_active', true)->count();
        $verifiedCount = User::where('role', 'customer')->whereNotNull('email_verified_at')->count();
        $newThisMonth = User::where('role', 'customer')->where('created_at', '>=', now()->subMonth())->count();

        return Inertia::render('admin/customers/index', [
            'users' => $users,
            'stats' => [
                'total' => $total,
                'active' => $active,
                'verified' => $verifiedCount,
                'new_this_month' => $newThisMonth,
            ],
            'filters' => [
                'search' => $search,
                'status' => $status,
                'verified' => $verified,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display the specified customer.
     */
    public function show(Request $request, string $id)
    {
        $customer = User::where('role', 'customer')
            ->with(['orders' => function ($query) {
                $query->latest()->limit(10);
            }])
            ->withCount('orders')
            ->findOrFail($id);

        // Calculate total spent
        $totalSpent = $customer->orders()->sum('total_amount');
        $customer->total_spent = $totalSpent;

        // If the request expects JSON (AJAX / fetch with Accept: application/json),
        // return a JSON payload compatible with the Inertia response shape so the
        // frontend can parse `data.props.customer` as before.
        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'props' => [
                    'customer' => $customer,
                ],
            ]);
        }

        return Inertia::render('admin/customers/edit', [
            'customer' => $customer,
        ]);
    }
}
