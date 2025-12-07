<?php

namespace App\Listeners;

use App\Services\CartService;
use Illuminate\Auth\Events\Login;
use Illuminate\Support\Facades\Log;

class MergeGuestCartOnLogin
{
    public function __construct(
        protected CartService $cartService
    ) {}

    /**
     * Handle the Login event.
     *
     * Merge guest cart (session-based) into authenticated user cart.
     */
    public function handle(Login $event): void
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

            // Merge guest cart into user cart
            $result = $this->cartService->mergeGuestCartToUser($user->id, $sessionId);

            if ($result->isSuccess()) {
                Log::info('Guest cart merged successfully', [
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                    'items_merged' => $guestCartItems->count(),
                ]);
            } else {
                Log::warning('Failed to merge guest cart', [
                    'user_id' => $user->id,
                    'session_id' => $sessionId,
                    'error' => $result->message,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Exception during cart merge on login', [
                'user_id' => $user->id,
                'session_id' => $sessionId,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
