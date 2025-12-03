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

    public function __construct(AddressServiceRefactored $addressService)
    {
        $this->addressService = $addressService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $userId = Auth::id();
        $addresses = $this->addressService->getUserAddresses($userId);

        return Inertia::render('Addresses', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreShippingAddressRequest $request): RedirectResponse
    {
        $this->authorize('create', ShippingAddress::class);

        $result = $this->addressService->createAddress(Auth::id(), $request->validated());

        if (!$result->isSuccess()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateShippingAddressRequest $request, ShippingAddress $address): RedirectResponse
    {
        $this->authorize('update', $address);

        $result = $this->addressService->updateAddress($address->id, Auth::id(), $request->validated());

        if (!$result->isSuccess()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ShippingAddress $address): RedirectResponse
    {
        $this->authorize('delete', $address);

        $result = $this->addressService->deleteAddress($address->id, Auth::id());

        if (!$result->isSuccess()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }

    /**
     * Set the specified address as default.
     */
    public function setDefault(ShippingAddress $address): RedirectResponse
    {
        $this->authorize('setDefault', $address);

        $result = $this->addressService->setDefaultAddress($address->id, Auth::id());

        if (!$result->isSuccess()) {
            return back()->with('error', $result->message);
        }

        return back()->with('success', $result->message);
    }
}
