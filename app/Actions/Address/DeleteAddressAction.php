<?php

namespace App\Actions\Address;

use App\Actions\BaseAction;
use App\Repositories\Contracts\AddressRepositoryInterface;
use App\Support\ServiceResult;
use Illuminate\Support\Facades\DB;

/**
 * Delete Address Action
 *
 * Handles deleting shipping addresses with validation.
 */
class DeleteAddressAction extends BaseAction
{
    public function __construct(
        protected AddressRepositoryInterface $addressRepository
    ) {}

    /**
     * Execute delete address action.
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
                    'Địa chỉ không tồn tại hoặc không thuộc về bạn',
                    ['error_code' => 'ADDRESS_NOT_FOUND']
                );
            }

            // Get address
            $address = $this->addressRepository->find($addressId);

            // Business rule: Cannot delete address if it's the only one and default
            $addressCount = $this->addressRepository->countUserAddresses($userId);

            if ($address->is_default && $addressCount === 1) {
                return ServiceResult::error(
                    'Không thể xóa địa chỉ mặc định duy nhất của bạn.',
                    ['error_code' => 'CANNOT_DELETE_ONLY_DEFAULT']
                );
            }

            // Delete address
            $this->addressRepository->delete($addressId);

            // If the deleted address was default, set another one as default
            if ($address->is_default) {
                $addresses = $this->addressRepository->getUserAddresses($userId);
                if ($addresses->isNotEmpty()) {
                    $newDefaultAddress = $addresses->first();
                    $this->addressRepository->setAsDefault($newDefaultAddress->id, $userId);
                }
            }

            return ServiceResult::success(
                [],
                'Địa chỉ đã được xóa'
            );
        });
    }
}
