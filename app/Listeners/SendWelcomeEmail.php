<?php

namespace App\Listeners;

use App\Mail\WelcomeEmail;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        // Ensure user is instance of User model
        $user = $event->user instanceof \App\Models\User
            ? $event->user
            : \App\Models\User::find($event->user->getAuthIdentifier());

        if ($user) {
            // Send welcome email to the newly registered user
            Mail::to($user)->send(new WelcomeEmail($user));
        }
    }
}
