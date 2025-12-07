<?php

namespace App\Events;

use App\Models\Voucher;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class VoucherCreated
{
    use Dispatchable, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(
        public Voucher $voucher,
        public bool $sendEmailNotification = false
    ) {
        //
    }
}
