<?php

namespace App\Services;

use App\Models\User;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AddressService
{
    const MAX_ADDRESSES_PER_USER = 3;

    /**
     * Get all shipping addresses for a user.
     */
    public function getUserAddresses(User $user)
    {
        return $user->shippingAddresses()->orderByDesc('is_default')->get();
    }

    /**
     * Create a new shipping address for a user.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function createAddress(User $user, array $data): ShippingAddress
    {
        if ($user->shippingAddresses()->count() >= self::MAX_ADDRESSES_PER_USER) {
            throw ValidationException::withMessages([
                'address' => 'Bạn chỉ có thể có tối đa ' . self::MAX_ADDRESSES_PER_USER . ' địa chỉ.'
            ]);
        }

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
        \Log::info('[AddressService] deleteAddress called', [
            'address_id' => $address->id,
            'is_default' => $address->is_default,
            'user_id' => $address->user_id,
        ]);

        // Business rule: Cannot delete address if it's the only one and default
        $addressCount = $address->user->shippingAddresses()->count();
        \Log::info('[AddressService] Address count for user', ['count' => $addressCount]);

        if ($address->is_default && $addressCount === 1) {
            \Log::warning('[AddressService] Cannot delete default address - it is the only one');
            throw ValidationException::withMessages([
                'address' => 'Không thể xóa địa chỉ mặc định duy nhất của bạn.'
            ]);
        }

        DB::transaction(function () use ($address) {
            \Log::info('[AddressService] Deleting address in transaction', ['address_id' => $address->id]);
            $address->delete();
            \Log::info('[AddressService] Address deleted');

            // If the deleted address was default, set another one as default
            if ($address->is_default && $address->user->shippingAddresses()->exists()) {
                $newDefault = $address->user->shippingAddresses()->first();
                \Log::info('[AddressService] Setting new default address', ['new_default_id' => $newDefault->id]);
                $newDefault->update(['is_default' => true]);
            }
        });

        \Log::info('[AddressService] deleteAddress completed successfully');
    }

    /**
     * Set a shipping address as default.
     */
    public function setDefaultAddress(User $user, ShippingAddress $address): ShippingAddress
    {
        \Log::info('[AddressService] setDefaultAddress called', [
            'user_id' => $user->id,
            'address_id' => $address->id,
            'address_user_id' => $address->user_id,
        ]);

        if ($user->id !== $address->user_id) {
            \Log::error('[AddressService] User mismatch', [
                'user_id' => $user->id,
                'address_user_id' => $address->user_id,
            ]);
            throw new \Exception('Địa chỉ không thuộc về người dùng này.');
        }

        return DB::transaction(function () use ($user, $address) {
            \Log::info('[AddressService] Unsetting all default addresses');
            $user->shippingAddresses()->update(['is_default' => false]);

            \Log::info('[AddressService] Setting address as default', ['address_id' => $address->id]);
            $address->update(['is_default' => true]);

            \Log::info('[AddressService] setDefaultAddress completed successfully');
            return $address;
        });
    }
}
