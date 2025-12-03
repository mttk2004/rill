<?php

namespace App\Actions\Address;

use App\Actions\BaseAction;
use App\Repositories\Contracts\AddressRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Set Default Address Action
 *
 * Handles setting an address as default for a user.
 */
class SetDefaultAddressAction extends BaseAction
{
    public function __construct(
        protected AddressRepositoryInterface $addressRepository
    ) {}

    /**
     * Execute set default address action.
     *
     * @param int $addressId
     * @param int $userId
     * @return ServiceResult
     */
    public function execute(int $addressId, int $userId): ServiceResult
    {
        return DB::transaction(function () use ($addressId, $userId) {
            // Check if address belongs to user
            if (!$this->addressRepository->belongsToUser($addressId, $userId)) {
                return ServiceResult::error(
                    'Địa chỉ không thuộc về người dùng này.',
                    ['error_code' => 'ADDRESS_NOT_FOUND']
                );
            }

            // Unset all defaults for user
            $this->addressRepository->unsetAllDefaults($userId);

            // Set this address as default
            $this->addressRepository->setAsDefault($addressId, $userId);

            // Get updated address
            $address = $this->addressRepository->find($addressId);

            return ServiceResult::success(
                ['address' => $address],
                'Đã đặt địa chỉ mặc định'
            );
        });
    }
}
