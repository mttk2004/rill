<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user can update password with valid current password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

    $response->assertRedirect();

    $this->assertTrue(Hash::check('new-password123', $user->fresh()->password));
});

test('password update fails with incorrect current password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

    $response->assertSessionHasErrors('current_password');
});

test('password update fails without current password', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

    $response->assertSessionHasErrors('current_password');
});

test('password update fails without new password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'current_password' => 'old-password',
        ]);

    $response->assertSessionHasErrors('password');
});

test('password update fails when passwords do not match', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'current_password' => 'old-password',
            'password' => 'new-password123',
            'password_confirmation' => 'different-password',
        ]);

    $response->assertSessionHasErrors('password');
});

test('password update fails with weak password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('old-password'),
    ]);

    $response = $this->actingAs($user)
        ->put(route('password.update'), [
            'current_password' => 'old-password',
            'password' => '123',
            'password_confirmation' => '123',
        ]);

    $response->assertSessionHasErrors('password');
});

test('guest cannot update password', function () {
    $response = $this->put(route('password.update'), [
        'current_password' => 'old-password',
        'password' => 'new-password123',
        'password_confirmation' => 'new-password123',
    ]);

    $response->assertRedirect(route('login'));
});
