<?php

namespace App\Services;

use App\Actions\Address\CreateAddressAction;
use App\Actions\Address\DeleteAddressAction;
use App\Actions\Address\SetDefaultAddressAction;
use App\Actions\Address\UpdateAddressAction;
use App\DataObjects\Address\AddressData;
use App\Repositories\Contracts\AddressRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Database\Eloquent\Collection;

/**
 * Address Service (Refactored)
 *
 * Orchestrates shipping address operations using Clean Architecture patterns.
 */
class AddressServiceRefactored
{
    public function __construct(
        protected AddressRepositoryInterface $addressRepository,
        protected CreateAddressAction $createAddressAction,
        protected UpdateAddressAction $updateAddressAction,
        protected DeleteAddressAction $deleteAddressAction,
        protected SetDefaultAddressAction $setDefaultAddressAction
    ) {}

    /**
     * Get all shipping addresses for a user.
     *
     * @param int $userId
     * @return Collection
     */
    public function getUserAddresses(int $userId): Collection
    {
        return $this->addressRepository->getUserAddresses($userId);
    }

    /**
     * Get user's default address.
     *
     * @param int $userId
     * @return \App\Models\ShippingAddress|null
     */
    public function getUserDefaultAddress(int $userId)
    {
        return $this->addressRepository->getUserDefaultAddress($userId);
    }

    /**
     * Create a new shipping address for a user.
     *
     * @param int $userId
     * @param array $data
     * @return ServiceResult
     */
    public function createAddress(int $userId, array $data): ServiceResult
    {
        try {
            $addressData = new AddressData(
                recipientName: trim($data['recipient_name'] ?? ''),
                phoneNumber: trim($data['phone_number'] ?? ''),
                address: trim($data['address'] ?? ''),
                ward: trim($data['ward'] ?? ''),
                district: trim($data['district'] ?? ''),
                province: trim($data['province'] ?? ''),
                isDefault: $data['is_default'] ?? false
            );
            return $this->createAddressAction->execute($userId, $addressData);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Update an existing shipping address.
     *
     * @param int $addressId
     * @param int $userId
     * @param array $data
     * @return ServiceResult
     */
    public function updateAddress(int $addressId, int $userId, array $data): ServiceResult
    {
        try {
            $addressData = new AddressData(
                recipientName: trim($data['recipient_name'] ?? ''),
                phoneNumber: trim($data['phone_number'] ?? ''),
                address: trim($data['address'] ?? ''),
                ward: trim($data['ward'] ?? ''),
                district: trim($data['district'] ?? ''),
                province: trim($data['province'] ?? ''),
                isDefault: $data['is_default'] ?? false
            );
            return $this->updateAddressAction->execute($addressId, $userId, $addressData);
        } catch (\InvalidArgumentException $e) {
            return ServiceResult::error($e->getMessage());
        }
    }

    /**
     * Delete a shipping address.
     *
     * @param int $addressId
     * @param int $userId
     * @return ServiceResult
     */
    public function deleteAddress(int $addressId, int $userId): ServiceResult
    {
        return $this->deleteAddressAction->execute($addressId, $userId);
    }

    /**
     * Set a shipping address as default.
     *
     * @param int $addressId
     * @param int $userId
     * @return ServiceResult
     */
    public function setDefaultAddress(int $addressId, int $userId): ServiceResult
    {
        return $this->setDefaultAddressAction->execute($addressId, $userId);
    }

    /**
     * Get an address by ID.
     *
     * @param int $addressId
     * @return \App\Models\ShippingAddress|null
     */
    public function getAddress(int $addressId)
    {
        return $this->addressRepository->find($addressId);
    }
}
