<?php

use App\Models\ShippingAddress;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user can view their addresses', function () {
    $user = User::factory()->create();
    ShippingAddress::factory()->count(3)->create(['user_id' => $user->id]);

    $response = $this->actingAs($user)->get(route('addresses.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Addresses')
            ->has('addresses', 3)
        );
});

test('user can create new address with valid data', function () {
    $user = User::factory()->create();

    $addressData = [
        'recipient_name' => 'John Doe',
        'phone' => '0123456789',
        'province_id' => 1,
        'province_name' => 'Hà Nội',
        'district_id' => 1,
        'district_name' => 'Ba Đình',
        'ward_code' => '00001',
        'ward_name' => 'Phường Phúc Xá',
        'address_detail' => '123 Đường ABC',
        'is_default' => false,
    ];

    $response = $this->actingAs($user)
        ->post(route('addresses.store'), $addressData);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('shipping_addresses', [
        'user_id' => $user->id,
        'recipient_name' => 'John Doe',
        'phone' => '0123456789',
    ]);
});

test('first address is automatically set as default', function () {
    $user = User::factory()->create();

    $addressData = [
        'recipient_name' => 'John Doe',
        'phone' => '0123456789',
        'province_id' => 1,
        'province_name' => 'Hà Nội',
        'district_id' => 1,
        'district_name' => 'Ba Đình',
        'ward_code' => '00001',
        'ward_name' => 'Phường Phúc Xá',
        'address_detail' => '123 Đường ABC',
        'is_default' => false,
    ];

    $this->actingAs($user)
        ->post(route('addresses.store'), $addressData);

    $this->assertDatabaseHas('shipping_addresses', [
        'user_id' => $user->id,
        'is_default' => true,
    ]);
});

test('address creation fails without required fields', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('addresses.store'), []);

    $response->assertSessionHasErrors([
        'recipient_name',
        'phone',
        'province_id',
        'district_id',
        'ward_code',
        'address_detail',
    ]);
});

test('user can update their address', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $user->id]);

    $updatedData = [
        'recipient_name' => 'Jane Doe Updated',
        'phone' => '0987654321',
        'province_id' => $address->province_id,
        'province_name' => $address->province_name,
        'district_id' => $address->district_id,
        'district_name' => $address->district_name,
        'ward_code' => $address->ward_code,
        'ward_name' => $address->ward_name,
        'address_detail' => 'Updated Address',
        'is_default' => $address->is_default,
    ];

    $response = $this->actingAs($user)
        ->put(route('addresses.update', $address), $updatedData);

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('shipping_addresses', [
        'id' => $address->id,
        'recipient_name' => 'Jane Doe Updated',
    ]);
});

test('user cannot update another users address', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)
        ->put(route('addresses.update', $address), [
            'recipient_name' => 'Hacked',
            'phone' => '0123456789',
            'province_id' => 1,
            'province_name' => 'Hà Nội',
            'district_id' => 1,
            'district_name' => 'Ba Đình',
            'ward_code' => '00001',
            'ward_name' => 'Phường Phúc Xá',
            'address_detail' => '123 Đường ABC',
            'is_default' => false,
        ]);

    $response->assertForbidden();
});

test('user can delete their address', function () {
    $user = User::factory()->create();
    $address = ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => false,
    ]);

    $response = $this->actingAs($user)
        ->delete(route('addresses.destroy', $address));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('shipping_addresses', [
        'id' => $address->id,
    ]);
});

test('user cannot delete another users address', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $address = ShippingAddress::factory()->create(['user_id' => $otherUser->id]);

    $response = $this->actingAs($user)
        ->delete(route('addresses.destroy', $address));

    $response->assertForbidden();

    $this->assertDatabaseHas('shipping_addresses', [
        'id' => $address->id,
    ]);
});

test('user can set address as default', function () {
    $user = User::factory()->create();
    $defaultAddress = ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => true,
    ]);
    $newDefaultAddress = ShippingAddress::factory()->create([
        'user_id' => $user->id,
        'is_default' => false,
    ]);

    $response = $this->actingAs($user)
        ->put(route('addresses.set-default', $newDefaultAddress));

    $response->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('shipping_addresses', [
        'id' => $newDefaultAddress->id,
        'is_default' => true,
    ]);

    $this->assertDatabaseHas('shipping_addresses', [
        'id' => $defaultAddress->id,
        'is_default' => false,
    ]);
});

test('phone number must be 10 digits', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->post(route('addresses.store'), [
            'recipient_name' => 'John Doe',
            'phone' => '123', // Invalid: too short
            'province_id' => 1,
            'province_name' => 'Hà Nội',
            'district_id' => 1,
            'district_name' => 'Ba Đình',
            'ward_code' => '00001',
            'ward_name' => 'Phường Phúc Xá',
            'address_detail' => '123 Đường ABC',
            'is_default' => false,
        ]);

    $response->assertSessionHasErrors('phone');
});

test('guest cannot access addresses', function () {
    $response = $this->get(route('addresses.index'));

    $response->assertRedirect(route('login'));
});

test('guest cannot create address', function () {
    $response = $this->post(route('addresses.store'), []);

    $response->assertRedirect(route('login'));
});
