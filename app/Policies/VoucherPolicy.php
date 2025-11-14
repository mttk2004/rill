<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Voucher;

class VoucherPolicy
{
    /**
     * Determine whether the user can view any vouchers.
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the voucher.
     */
    public function view(User $user, Voucher $voucher): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can create vouchers.
     */
    public function create(User $user): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the voucher.
     */
    public function update(User $user, Voucher $voucher): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the voucher.
     */
    public function delete(User $user, Voucher $voucher): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can restore the voucher.
     */
    public function restore(User $user, Voucher $voucher): bool
    {
        return $user->role === 'admin';
    }

    /**
     * Determine whether the user can permanently delete the voucher.
     */
    public function forceDelete(User $user, Voucher $voucher): bool
    {
        return $user->role === 'admin';
    }
}
