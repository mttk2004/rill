<?php

namespace App\Services;

use App\Models\User;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * @deprecated Use AddressServiceRefactored instead
 * This service will be removed in a future version
 */
class AddressService
{
    /**
     * Get all shipping addresses for a user.
     */
    public function getUserAddresses(User $user)
    {
        return $user->shippingAddresses()->orderByDesc('is_default')->get();
    }

    /**
     * Create a new shipping address for a user.
     */
    public function createAddress(User $user, array $data): ShippingAddress
    {
        return DB::transaction(function () use ($user, $data) {
            // If this is the first address, make it default
            if ($user->shippingAddresses()->doesntExist()) {
                $data['is_default'] = true;
            }

            // If new address is set as default, unset other defaults
            if (isset($data['is_default']) && $data['is_default']) {
                $user->shippingAddresses()->update(['is_default' => false]);
            }

            return $user->shippingAddresses()->create($data);
        });
    }

    /**
     * Update an existing shipping address.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function updateAddress(ShippingAddress $address, array $data): ShippingAddress
    {
        return DB::transaction(function () use ($address, $data) {
            // If updated address is set as default, unset other defaults for the user
            if (isset($data['is_default']) && $data['is_default']) {
                $address->user->shippingAddresses()
                    ->where('id', '!=', $address->id)
                    ->update(['is_default' => false]);
            }

            $address->update($data);

            // If no address is default after update, make the updated one default
            if (!$address->user->shippingAddresses()->where('is_default', true)->exists()) {
                $address->update(['is_default' => true]);
            }

            return $address;
        });
    }

    /**
     * Delete a shipping address.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function deleteAddress(ShippingAddress $address): void
    {
        // Business rule: Cannot delete address if it's the only one and default
        $addressCount = $address->user->shippingAddresses()->count();

        if ($address->is_default && $addressCount === 1) {
            throw ValidationException::withMessages([
                'address' => 'Không thể xóa địa chỉ mặc định duy nhất của bạn.'
            ]);
        }

        DB::transaction(function () use ($address) {
            $address->delete();

            // If the deleted address was default, set another one as default
            if ($address->is_default && $address->user->shippingAddresses()->exists()) {
                $newDefault = $address->user->shippingAddresses()->first();
                $newDefault->update(['is_default' => true]);
            }
        });
    }

    /**
     * Set a shipping address as default.
     */
    public function setDefaultAddress(User $user, ShippingAddress $address): ShippingAddress
    {
        if ($user->id !== $address->user_id) {
            throw new \Exception('Địa chỉ không thuộc về người dùng này.');
        }

        return DB::transaction(function () use ($user, $address) {
            $user->shippingAddresses()->update(['is_default' => false]);
            $address->update(['is_default' => true]);
            return $address;
        });
    }
}
