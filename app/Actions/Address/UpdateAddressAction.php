<?php

namespace App\Actions\Address;

use App\Actions\BaseAction;
use App\DataObjects\Address\AddressData;
use App\Repositories\Contracts\AddressRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Update Address Action
 *
 * Handles updating existing shipping addresses.
 */
class UpdateAddressAction extends BaseAction
{
    public function __construct(
        protected AddressRepositoryInterface $addressRepository
    ) {}

    /**
     * Execute update address action.
     *
     * @param int $addressId
     * @param int $userId
     * @param AddressData $data
     * @return ServiceResult
     */
    public function execute(int $addressId, int $userId, AddressData $data): ServiceResult
    {
        return DB::transaction(function () use ($addressId, $userId, $data) {
            // Check if address belongs to user
            if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
                return ServiceResult::error(
                    'Địa chỉ không tồn tại hoặc không thuộc về bạn',
                    ['error_code' => 'ADDRESS_NOT_FOUND']
                );
            }

            $addressArray = $data->toArray();

            // If updated address is set as default, unset other defaults for the user
            if ($addressArray['is_default']) {
                $this->addressRepository->unsetAllDefaults($userId);
            }

            // Update address
            $this->addressRepository->update($addressId, $addressArray);

            // If no address is default after update, make the updated one default
            $defaultAddress = $this->addressRepository->getUserDefaultAddress($userId);
            if (!$defaultAddress) {
                $this->addressRepository->setAsDefault($addressId, $userId);
            }

            // Get updated address
            $address = $this->addressRepository->find($addressId);

            return ServiceResult::success(
                ['address' => $address],
                'Địa chỉ đã được cập nhật'
            );
        });
    }
}
