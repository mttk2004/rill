<?php

namespace App\Actions\Address;

use App\Actions\BaseAction;
use App\DataObjects\Address\AddressData;
use App\Repositories\Contracts\AddressRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Create Address Action
 *
 * Handles creating new shipping addresses with automatic default handling.
 */
class CreateAddressAction extends BaseAction
{
    public function __construct(
        protected AddressRepositoryInterface $addressRepository
    ) {}

    /**
     * Execute create address action.
     *
     * @param int $userId
     * @param AddressData $data
     * @return ServiceResult
     */
    public function execute(int $userId, AddressData $data): ServiceResult
    {
        return DB::transaction(function () use ($userId, $data) {
            // If this is the first address, make it default
            $addressCount = $this->addressRepository->countUserAddresses($userId);

            $addressArray = $data->toArray();

            if ($addressCount === 0) {
                $addressArray['is_default'] = true;
            }

            // If new address is set as default, unset other defaults
            if ($addressArray['is_default']) {
                $this->addressRepository->unsetAllDefaults($userId);
            }

            // Create address
            $address = $this->addressRepository->createUserAddress($userId, $addressArray);

            return ServiceResult::success(
                ['address' => $address],
                'Địa chỉ đã được thêm thành công'
            );
        });
    }
}
