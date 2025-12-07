<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->route('home')
                ->with('success', 'Email của bạn đã được xác nhận trước đó!');
        }

        $request->fulfill();

        return redirect()->route('home')
            ->with('success', 'Xác nhận email thành công! Chào mừng bạn đến với Rill! 🎉');
    }
}
