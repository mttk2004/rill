<?php

namespace App\Repositories;

use App\Models\ShippingAddress;
use App\Repositories\Contracts\AddressRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AddressRepository extends BaseRepository implements AddressRepositoryInterface
{
    public function __construct(ShippingAddress $model)
    {
        parent::__construct($model);
    }

    /**
     * Get all addresses for a user.
     */
    public function getUserAddresses(int $userId): Collection
    {
        return $this->model
            ->where('user_id', $userId)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();
    }

    /**
     * Get user's default address.
     */
    public function getUserDefaultAddress(int $userId): ?ShippingAddress
    {
        return $this->model
            ->where('user_id', $userId)
            ->where('is_default', true)
            ->first();
    }

    /**
     * Create address for user.
     */
    public function createUserAddress(int $userId, array $data): ShippingAddress
    {
        $data['user_id'] = $userId;
        return $this->model->create($data);
    }

    /**
     * Set address as default for user.
     */
    public function setAsDefault(int $addressId, int $userId): bool
    {
        $address = $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->first();

        if (!$address) {
            return false;
        }

        return $address->update(['is_default' => true]);
    }

    /**
     * Unset all default addresses for user.
     */
    public function unsetAllDefaults(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->update(['is_default' => false]);
    }

    /**
     * Check if address belongs to user.
     */
    public function belongsToUser(int $addressId, int $userId): bool
    {
        return $this->model
            ->where('id', $addressId)
            ->where('user_id', $userId)
            ->exists();
    }

    /**
     * Count user addresses.
     */
    public function countUserAddresses(int $userId): int
    {
        return $this->model
            ->where('user_id', $userId)
            ->count();
    }
}
