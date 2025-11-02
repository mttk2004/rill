<?php

namespace App\Policies;

use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShippingAddressPolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any shipping addresses.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the shipping address.
     */
    public function view(User $user, ShippingAddress $shippingAddress): bool
    {
        return $user->id === $shippingAddress->user_id;
    }

    /**
     * Determine whether the user can create shipping addresses.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the shipping address.
     */
    public function update(User $user, ShippingAddress $shippingAddress): bool
    {
        return $user->id === $shippingAddress->user_id;
    }

    /**
     * Determine whether the user can delete the shipping address.
     */
    public function delete(User $user, ShippingAddress $shippingAddress): bool
    {
        return $user->id === $shippingAddress->user_id;
    }

    /**
     * Determine whether the user can set the shipping address as default.
     */
    public function setDefault(User $user, ShippingAddress $shippingAddress): bool
    {
        return $user->id === $shippingAddress->user_id;
    }
}
