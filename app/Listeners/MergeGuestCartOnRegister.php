<?php

namespace App\Listeners;

use App\Services\CartService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Log;

class MergeGuestCartOnRegister
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Handle the Registered event.
     *
     * Merge guest cart (session-based) into newly registered user cart.
     */
    public function handle(Registered $event): void
    {
        /** @var \App\Models\User $user */
        $user = $event->user;

        // Get the old session ID before regeneration
        $sessionId = session()->get('_previous_session_id');

        if (!$user || !$sessionId) {
            return;
        }

        try {
            // Check if there's a guest cart to merge
            $guestCartItems = $this->cartService->getCartItems(null, $sessionId);

            if ($guestCartItems->isEmpty()) {
                return; // No guest cart to merge
            }

            // Merge guest cart into new user cart
            $result = $this->cartService->mergeGuestCartToUser($user->id, $sessionId);

            if ($result->isSuccess()) {
                Log::info('Guest cart merged successfully on registration', [
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                    'items_merged' => $guestCartItems->count(),
                ]);
            } else {
                Log::warning('Failed to merge guest cart on registration', [
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                    'error' => $result->message,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during cart merge on registration', [
                'user_id' => $user->id,
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
