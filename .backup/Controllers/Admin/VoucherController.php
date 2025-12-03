<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoucherRequest;
use App\Http\Requests\UpdateVoucherRequest;
use App\Models\Voucher;
use App\Services\VoucherServiceRefactored;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VoucherController extends Controller
{
    public function __construct(
        protected VoucherServiceRefactored $voucherService
    ) {
        //
    }

    /**
     * Display a listing of vouchers.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->get('per_page', 10);
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

        // Calculate stats with single query
        $stats = Voucher::selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN is_active = 1 AND valid_from <= ? AND valid_to >= ? THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN valid_to < ? THEN 1 ELSE 0 END) as expired,
                SUM(used_count) as total_used
            ', [$now, $now, $now])
            ->first()
            ->toArray();

        return Inertia::render('admin/vouchers/VoucherList', [
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
        return Inertia::render('admin/vouchers/VoucherForm');
    }

    /**
     * Store a newly created voucher.
     */
    public function store(StoreVoucherRequest $request)
    {
        $result = $this->voucherService->createVoucher($request->validated());

        if (!$result->isSuccess()) {
            return redirect()->back()->with('error', $result->message);
        }

        return redirect()->route('admin.vouchers')
            ->with('success', $result->message);
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
        $voucher = Voucher::withCount('usages')->findOrFail($id);

        return Inertia::render('admin/vouchers/VoucherForm', [
            'voucher' => $voucher,
        ]);
    }

    /**
     * Update the specified voucher.
     */
    public function update(UpdateVoucherRequest $request, string $id)
    {
        $result = $this->voucherService->updateVoucher((int) $id, $request->validated());

        if (!$result->isSuccess()) {
            return redirect()->back()->with('error', $result->message);
        }

        return redirect()->route('admin.vouchers')
            ->with('success', $result->message);
    }

    /**
     * Remove the specified voucher.
     */
    public function destroy(string $id)
    {
        $voucher = $this->voucherService->getVoucher((int) $id);

        if (!$voucher) {
            return redirect()->back()->with('error', 'Voucher không tồn tại');
        }

        // Check if voucher has been used
        if ($voucher->used_count > 0) {
            return redirect()->back()
                ->with('error', 'Không thể xóa voucher đã được sử dụng');
        }

        $this->voucherService->deleteVoucher((int) $id);

        return redirect()->route('admin.vouchers')
            ->with('success', 'Voucher đã được xóa thành công');
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

        return redirect()->back()
            ->with('success', $voucher->is_active
                ? 'Voucher đã được kích hoạt'
                : 'Voucher đã được vô hiệu hóa');
    }
}
