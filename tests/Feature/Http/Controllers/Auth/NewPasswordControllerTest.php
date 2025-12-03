<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

test('user can reset password with valid token', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('old-password'),
    ]);

    $token = Password::createToken($user);

    $response = $this->post(route('password.store'), [
        'token' => $token,
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertRedirect(route('login'))
        ->assertSessionHas('status');

    $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
});

test('password reset fails with invalid token', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $response = $this->post(route('password.store'), [
        'token' => 'invalid-token',
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('password reset fails without token', function () {
    $response = $this->post(route('password.store'), [
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasErrors('token');
});

test('password reset fails without email', function () {
    $response = $this->post(route('password.store'), [
        'token' => 'some-token',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('password reset fails with invalid email format', function () {
    $response = $this->post(route('password.store'), [
        'token' => 'some-token',
        'email' => 'invalid-email',
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ]);

    $response->assertSessionHasErrors('email');
});

test('password reset fails without password', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $token = Password::createToken($user);

    $response = $this->post(route('password.store'), [
        'token' => $token,
        'email' => 'test@example.com',
    ]);

    $response->assertSessionHasErrors('password');
});

test('password reset fails when passwords do not match', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $token = Password::createToken($user);

    $response = $this->post(route('password.store'), [
        'token' => $token,
        'email' => 'test@example.com',
        'password' => 'new-password',
        'password_confirmation' => 'different-password',
    ]);

    $response->assertSessionHasErrors('password');
});

test('password reset fails with weak password', function () {
    $user = User::factory()->create(['email' => 'test@example.com']);
    $token = Password::createToken($user);

    $response = $this->post(route('password.store'), [
        'token' => $token,
        'email' => 'test@example.com',
        'password' => '123', // Too short
        'password_confirmation' => '123',
    ]);

    $response->assertSessionHasErrors('password');
});
