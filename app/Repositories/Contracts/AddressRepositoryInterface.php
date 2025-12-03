<?php

namespace App\Repositories\Contracts;

use App\Models\ShippingAddress;
use Illuminate\Database\Eloquent\Collection;

interface AddressRepositoryInterface extends BaseRepositoryInterface
{
    /**
     * Get all addresses for a user.
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserAddresses(int $userId): Collection;

    /**
     * Get user's default address.
     *
     * @param int $userId
     * @return ShippingAddress|null
     */
    public function getUserDefaultAddress(int $userId): ?ShippingAddress;

    /**
     * Create address for user.
     *
     * @param int $userId
     * @param array $data
     * @return ShippingAddress
     */
    public function createUserAddress(int $userId, array $data): ShippingAddress;

    /**
     * Set address as default for user.
     *
     * @param int $addressId
     * @param int $userId
     * @return bool
     */
    public function setAsDefault(int $addressId, int $userId): bool;

    /**
     * Unset all default addresses for user.
     *
     * @param int $userId
     * @return int Number of updated records
     */
    public function unsetAllDefaults(int $userId): int;

    /**
     * Check if address belongs to user.
     *
     * @param int $addressId
     * @param int $userId
     * @return bool
     */
    public function belongsToUser(int $addressId, int $userId): bool;

    /**
     * Count user addresses.
     *
     * @param int $userId
     * @return int
     */
    public function countUserAddresses(int $userId): int;
}
