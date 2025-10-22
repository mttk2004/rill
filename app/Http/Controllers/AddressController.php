<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShippingAddressRequest;
use App\Http\Requests\UpdateShippingAddressRequest;
use App\Models\ShippingAddress;
use App\Services\AddressService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    protected AddressService $addressService;

    public function __construct(AddressService $addressService)
    {
        $this->addressService = $addressService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $user = Auth::user();
        $addresses = $this->addressService->getUserAddresses($user);

        return Inertia::render('addresses/index', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShippingAddressRequest $request): RedirectResponse
    {
        $user = Auth::user();
        $this->addressService->createAddress($user, $request->validated());

        return redirect()->route('addresses.index')
            ->with('success', 'Địa chỉ đã được thêm thành công.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShippingAddressRequest $request, ShippingAddress $address): RedirectResponse
    {
        // Policy check: ensure user owns the address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền chỉnh sửa địa chỉ này.');
        }

        $this->addressService->updateAddress($address, $request->validated());

        return redirect()->route('addresses.index')
            ->with('success', 'Địa chỉ đã được cập nhật thành công.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingAddress $address): RedirectResponse
    {
        // Policy check: ensure user owns the address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền xóa địa chỉ này.');
        }

        try {
            $this->addressService->deleteAddress($address);
            return redirect()->route('addresses.index')
                ->with('success', 'Địa chỉ đã được xóa thành công.');
        } catch (\Exception $e) {
            return redirect()->route('addresses.index')
                ->with('error', $e->getMessage());
        }
    }

    /**
     * Set the specified address as default.
     */
    public function setDefault(ShippingAddress $address): RedirectResponse
    {
        // Policy check: ensure user owns the address
        if ($address->user_id !== Auth::id()) {
            abort(403, 'Bạn không có quyền đặt địa chỉ này làm mặc định.');
        }

        try {
            $this->addressService->setDefaultAddress(Auth::user(), $address);
            return redirect()->route('addresses.index')
                ->with('success', 'Địa chỉ mặc định đã được cập nhật.');
        } catch (\Exception $e) {
            return redirect()->route('addresses.index')
                ->with('error', $e->getMessage());
        }
    }
}
