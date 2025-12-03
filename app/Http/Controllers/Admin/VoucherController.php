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
    ) {
        //
    }

    /**
     * Display a listing of vouchers.
     */
    public function index(Request $request)
    {
        $filters = [
            'per_page' => (int) $request->get('per_page', 10),
            'search' => $request->get('search', ''),
            'status' => $request->get('status', 'all'),
            'sort' => $request->get('sort', 'created_desc'),
        ];

        $vouchers = $this->voucherService->getFilteredVouchers($filters);
        $stats = $this->voucherService->getVoucherStats();

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

        // Check if voucher can be deleted
        $error = $this->voucherService->canDeleteVoucher($voucher);
        if ($error) {
            return redirect()->back()->with('error', $error);
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
        $this->voucherService->toggleVoucherStatus((int) $id);

        // Refresh to get updated status
        $voucher->refresh();

        return redirect()->back()
            ->with('success', $voucher->is_active
                ? 'Voucher đã được kích hoạt'
                : 'Voucher đã được vô hiệu hóa');
    }
}
