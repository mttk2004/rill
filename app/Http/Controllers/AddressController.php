<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreShippingAddressRequest;
use App\Http\Requests\UpdateShippingAddressRequest;
use App\Http\Resources\ShippingAddressResource;
use App\Models\ShippingAddress;
use App\Services\AddressService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    use AuthorizesRequests;

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
        \Log::info('[AddressController] Store request received', [
            'user_id' => Auth::id(),
            'data' => $request->validated(),
        ]);

        $this->authorize('create', ShippingAddress::class);

        $user = Auth::user();
        $address = $this->addressService->createAddress($user, $request->validated());
        \Log::info('[AddressController] Address created successfully', ['address_id' => $address->id]);

        return back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShippingAddressRequest $request, ShippingAddress $address): RedirectResponse
    {
        \Log::info('[AddressController] Update request received', [
            'address_id' => $address->id,
            'user_id' => Auth::id(),
            'data' => $request->validated(),
        ]);

        $this->authorize('update', $address);

        $this->addressService->updateAddress($address, $request->validated());
        \Log::info('[AddressController] Address updated successfully', ['address_id' => $address->id]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingAddress $address): RedirectResponse
    {
        \Log::info('[AddressController] Delete request received', [
            'address_id' => $address->id,
            'user_id' => Auth::id(),
        ]);

        $this->authorize('delete', $address);

        try {
            $this->addressService->deleteAddress($address);
            \Log::info('[AddressController] Address deleted successfully', ['address_id' => $address->id]);
            return back()->with('success', 'Địa chỉ đã được xóa thành công.');
        } catch (\Exception $e) {
            \Log::error('[AddressController] Failed to delete address', [
                'address_id' => $address->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }

    /**
     * Set the specified address as default.
     */
    public function setDefault(ShippingAddress $address): RedirectResponse
    {
        \Log::info('[AddressController] Set default request received', [
            'address_id' => $address->id,
            'user_id' => Auth::id(),
        ]);

        $this->authorize('setDefault', $address);

        try {
            $this->addressService->setDefaultAddress(Auth::user(), $address);
            \Log::info('[AddressController] Default address updated successfully', ['address_id' => $address->id]);
            return back()->with('success', 'Địa chỉ mặc định đã được cập nhật.');
        } catch (\Exception $e) {
            \Log::error('[AddressController] Failed to set default address', [
                'address_id' => $address->id,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', $e->getMessage());
        }
    }
}
