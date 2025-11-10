<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Models\Voucher;
use App\Services\VoucherService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function __construct(
        protected VoucherService $voucherService
    ) {}

    /**
     * Display a listing of vouchers.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 20);
        $search = trim((string) $request->get('search', ''));
        $status = $request->get('status', 'all');
        $sort = $request->get('sort', 'created_desc');

        $query = Voucher::query();

        // Search
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        $now = now();
        if ($status && $status !== 'all') {
            switch ($status) {
                case 'active':
                    $query->where('is_active', true)
                        ->where('valid_from', '<=', $now)
                        ->where('valid_to', '>=', $now);
                    break;
                case 'inactive':
                    $query->where('is_active', false);
                    break;
                case 'expired':
                    $query->where('valid_to', '<', $now);
                    break;
                case 'upcoming':
                    $query->where('valid_from', '>', $now);
                    break;
                case 'exhausted':
                    $query->whereNotNull('usage_limit')
                        ->whereColumn('used_count', '>=', 'usage_limit');
                    break;
            }
        }

        // Sorting
        switch ($sort) {
            case 'code_asc':
                $query->orderBy('code', 'asc');
                break;
            case 'code_desc':
                $query->orderBy('code', 'desc');
                break;
            case 'value_asc':
                $query->orderBy('value', 'asc');
                break;
            case 'value_desc':
                $query->orderBy('value', 'desc');
                break;
            case 'usage_desc':
                $query->orderBy('used_count', 'desc');
                break;
            case 'valid_from_desc':
                $query->orderBy('valid_from', 'desc');
                break;
            case 'valid_to_asc':
                $query->orderBy('valid_to', 'asc');
                break;
            case 'created_desc':
                $query->orderBy('created_at', 'desc');
                break;
            case 'created_asc':
                $query->orderBy('created_at', 'asc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $vouchers = $query->withCount('usages')
            ->paginate($perPage)
            ->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Voucher::count(),
            'active' => Voucher::where('is_active', true)
                ->where('valid_from', '<=', $now)
                ->where('valid_to', '>=', $now)
                ->count(),
            'expired' => Voucher::where('valid_to', '<', $now)->count(),
            'total_used' => Voucher::sum('used_count'),
        ];

        return Inertia::render('admin/vouchers/index', [
            'vouchers' => $vouchers,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'sort']),
        ]);
    }

    /**
     * Show the form for creating a new voucher.
     */
    public function create()
    {
        return Inertia::render('admin/vouchers/create');
    }

    /**
     * Store a newly created voucher.
     */
    public function store(StoreVoucherRequest $request)
    {
        $validated = $request->validated();

        $voucher = Voucher::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Voucher đã được tạo thành công',
            'voucher' => $voucher,
        ]);
    }

    /**
     * Display the specified voucher.
     */
    public function show(Request $request, string $id)
    {
        $voucher = Voucher::with(['usages.user', 'usages.order'])
            ->withCount('usages')
            ->findOrFail($id);

        // Get statistics
        $statistics = $this->voucherService->getVoucherStatistics((int) $id);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'voucher' => $voucher,
                'statistics' => $statistics,
            ]);
        }

        return Inertia::render('admin/vouchers/show', [
            'voucher' => $voucher,
            'statistics' => $statistics,
        ]);
    }

    /**
     * Show the form for editing the specified voucher.
     */
    public function edit(string $id)
    {
        $voucher = Voucher::findOrFail($id);

        return Inertia::render('admin/vouchers/edit', [
            'voucher' => $voucher,
        ]);
    }

    /**
     * Update the specified voucher.
     */
    public function update(UpdateVoucherRequest $request, string $id)
    {
        $voucher = Voucher::findOrFail($id);

        $validated = $request->validated();

        $voucher->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Voucher đã được cập nhật thành công',
            'voucher' => $voucher->fresh(),
        ]);
    }

    /**
     * Remove the specified voucher.
     */
    public function destroy(string $id)
    {
        $voucher = Voucher::findOrFail($id);

        // Check if voucher has been used
        if ($voucher->used_count > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa voucher đã được sử dụng',
            ], 422);
        }

        $voucher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Voucher đã được xóa thành công',
        ]);
    }

    /**
     * Toggle voucher active status.
     */
    public function toggleStatus(string $id)
    {
        $voucher = Voucher::findOrFail($id);

        $voucher->update([
            'is_active' => !$voucher->is_active,
        ]);

        return response()->json([
            'success' => true,
            'message' => $voucher->is_active
                ? 'Voucher đã được kích hoạt'
                : 'Voucher đã được vô hiệu hóa',
            'voucher' => $voucher,
        ]);
    }
}
