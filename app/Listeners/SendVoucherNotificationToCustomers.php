<?php

namespace App\Listeners;

use App\Events\VoucherCreated;
use App\Mail\VoucherCreatedNotification;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendVoucherNotificationToCustomers implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * The number of times the job may be attempted.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * The maximum number of seconds the job can run.
     *
     * @var int
     */
    public $timeout = 600; // 10 minutes for processing all users

    /**
     * Calculate the number of seconds to wait before retrying the job.
     *
     * @return array<int, int>
     */
    public function backoff(): array
    {
        return [60, 180, 300]; // Wait 1min, 3min, 5min between retries
    }

    /**
     * Handle the event.
     */
    public function handle(VoucherCreated $event): void
    {
        // Only send if flag is set
        if (!$event->sendEmailNotification) {
            return;
        }

        $voucher = $event->voucher;
        $totalUsers = 0;
        $failedUsers = 0;

        Log::info('Starting to send voucher notification emails', [
            'voucher_id' => $voucher->id,
            'voucher_code' => $voucher->code,
        ]);

        // Get all customers (users with role 'customer' or users who have orders)
        // Process in smaller chunks of 50 to avoid overwhelming the mail service
        User::query()
            ->where('role', 'customer')
            ->orWhereHas('orders')
            ->chunk(50, function ($users) use ($voucher, &$totalUsers, &$failedUsers) {
                foreach ($users as $user) {
                    try {
                        Mail::to($user->email)->queue(
                            new VoucherCreatedNotification($voucher, $user)
                        );
                        $totalUsers++;
                    } catch (\Exception $e) {
                        $failedUsers++;
                        Log::error('Failed to queue voucher email', [
                            'user_id' => $user->id,
                            'voucher_id' => $voucher->id,
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                // Add a small delay between chunks to avoid rate limiting
                // This delay happens in the listener, not in queue
                usleep(500000); // 0.5 second delay between chunks
            });

        Log::info('Finished queueing voucher notification emails', [
            'voucher_id' => $voucher->id,
            'total_queued' => $totalUsers,
            'failed_to_queue' => $failedUsers,
        ]);
    }
}
