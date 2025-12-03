<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user can delete account with correct password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'password123',
        ]);

    $response->assertRedirect(route('home'));

    $this->assertDatabaseMissing('users', [
        'id' => $user->id,
    ]);

    $this->assertFalse(Auth::check());
});

test('account deletion fails with incorrect password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password123'),
    ]);

    $response = $this->actingAs($user)
        ->delete(route('profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response->assertSessionHasErrors('password');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
    ]);
});

test('account deletion fails without password', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->delete(route('profile.destroy'), []);

    $response->assertSessionHasErrors('password');

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
    ]);
});

test('guest cannot delete account', function () {
    $response = $this->delete(route('profile.destroy'), [
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('login'));
});

test('user can view profile edit page', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->get(route('profile.edit'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Settings')
            ->has('user')
        );
});

test('user can update profile information', function () {
    $user = User::factory()->create([
        'name' => 'Old Name',
        'email' => 'old@example.com',
    ]);

    $response = $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => 'New Name',
            'email' => 'new@example.com',
        ]);

    $response->assertRedirect(route('profile.edit'));

    $this->assertDatabaseHas('users', [
        'id' => $user->id,
        'name' => 'New Name',
        'email' => 'new@example.com',
    ]);
});

test('email verification is reset when email changes', function () {
    $user = User::factory()->create([
        'email' => 'old@example.com',
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($user)
        ->patch(route('profile.update'), [
            'name' => $user->name,
            'email' => 'new@example.com',
        ]);

    $response->assertRedirect(route('profile.edit'));

    $user->refresh();
    $this->assertNull($user->email_verified_at);
});

test('guest cannot access profile pages', function () {
    $this->get(route('profile.edit'))
        ->assertRedirect(route('login'));

    $this->patch(route('profile.update'), [])
        ->assertRedirect(route('login'));
});
