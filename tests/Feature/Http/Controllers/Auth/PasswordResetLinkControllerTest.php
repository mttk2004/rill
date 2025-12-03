<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

test('can request password reset link', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);

    $response = $this->post(route('password.email'), [
        'email' => 'test@example.com',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('status', __('A reset link will be sent if the account exists.'));
});

test('password reset link request fails without email', function () {
    $response = $this->post(route('password.email'), []);

    $response->assertSessionHasErrors('email');
});

test('password reset link request fails with invalid email format', function () {
    $response = $this->post(route('password.email'), [
        'email' => 'invalid-email',
    ]);

    $response->assertSessionHasErrors('email');
});

test('password reset link request returns same response for non-existent email', function () {
    // This test ensures we don't leak information about which emails exist
    $response = $this->post(route('password.email'), [
        'email' => 'nonexistent@example.com',
    ]);

    $response->assertRedirect()
        ->assertSessionHas('status', __('A reset link will be sent if the account exists.'));
});
