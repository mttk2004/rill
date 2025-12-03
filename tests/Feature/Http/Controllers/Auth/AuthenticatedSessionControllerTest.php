<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

uses(RefreshDatabase::class);

test('user can view login page', function () {
    $response = $this->get(route('login'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Login')
            ->has('canResetPassword')
            ->has('status')
        );
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('products'));
    $this->assertAuthenticatedAs($user);
});

test('admin redirects to dashboard after login', function () {
    $admin = User::factory()->admin()->create([
        'email' => 'admin@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'admin@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('admin.dashboard'));
    $this->assertAuthenticatedAs($admin);
});

test('customer redirects to products after login', function () {
    $customer = User::factory()->customer()->create([
        'email' => 'customer@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'customer@example.com',
        'password' => 'password123',
    ]);

    $response->assertRedirect(route('products'));
    $this->assertAuthenticatedAs($customer);
});

test('login fails with invalid email', function () {
    $response = $this->post(route('login'), [
        'email' => 'nonexistent@example.com',
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('login fails with invalid password', function () {
    User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('login fails without email', function () {
    $response = $this->post(route('login'), [
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('login fails without password', function () {
    $response = $this->post(route('login'), [
        'email' => 'test@example.com',
    ]);

    $response->assertSessionHasErrors('password');
    $this->assertGuest();
});

test('login fails with invalid email format', function () {
    $response = $this->post(route('login'), [
        'email' => 'not-an-email',
        'password' => 'password123',
    ]);

    $response->assertSessionHasErrors('email');
    $this->assertGuest();
});

test('user can logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user);

    $response = $this->post(route('logout'));

    $response->assertRedirect('/');
    $this->assertGuest();
});

test('remember me functionality works', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $response = $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'password123',
        'remember' => true,
    ]);

    $response->assertRedirect();
    $this->assertAuthenticatedAs($user);
    $this->assertNotNull($user->fresh()->remember_token);
});

test('session regenerates after login', function () {
    $user = User::factory()->create([
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
    ]);

    $oldSessionId = session()->getId();

    $this->post(route('login'), [
        'email' => 'test@example.com',
        'password' => 'password123',
    ]);

    $newSessionId = session()->getId();

    expect($oldSessionId)->not->toBe($newSessionId);
});

test('guest cannot access protected routes', function () {
    $response = $this->get(route('profile.edit'));

    $response->assertRedirect(route('login'));
});
