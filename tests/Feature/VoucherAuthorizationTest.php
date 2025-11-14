<?php

use App\Models\User;
use App\Models\Voucher;

test('admin can access voucher index', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $response = $this->actingAs($admin)
        ->get(route('admin.vouchers'));

    $response->assertStatus(200);
});

test('regular user cannot access voucher index', function () {
    $user = User::factory()->create(['role' => 'user']);

    $response = $this->actingAs($user)
        ->get(route('admin.vouchers'));

    $response->assertStatus(403); // Forbidden
});

test('guest cannot access voucher index', function () {
    $response = $this->get(route('admin.vouchers'));

    $response->assertRedirect(route('login'));
});

test('admin can create voucher', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $voucherData = [
        'code' => 'TESTCODE',
        'name' => 'Test Voucher',
        'description' => 'Test Description',
        'type' => 'fixed',
        'value' => 50000,
        'minimum_amount' => 100000,
        'valid_from' => now()->format('Y-m-d'),
        'valid_to' => now()->addDays(30)->format('Y-m-d'),
        'is_active' => true,
    ];

    $response = $this->actingAs($admin)
        ->post(route('admin.vouchers.store'), $voucherData);

    $response->assertRedirect(route('admin.vouchers'));
    $this->assertDatabaseHas('vouchers', ['code' => 'TESTCODE']);
});

test('regular user cannot create voucher', function () {
    $user = User::factory()->create(['role' => 'user']);

    $voucherData = [
        'code' => 'TESTCODE',
        'name' => 'Test Voucher',
        'description' => 'Test Description',
        'type' => 'fixed',
        'value' => 50000,
        'minimum_amount' => 100000,
        'valid_from' => now()->format('Y-m-d'),
        'valid_to' => now()->addDays(30)->format('Y-m-d'),
        'is_active' => true,
    ];

    $response = $this->actingAs($user)
        ->post(route('admin.vouchers.store'), $voucherData);

    $response->assertStatus(403);
    $this->assertDatabaseMissing('vouchers', ['code' => 'TESTCODE']);
});

test('admin can update voucher', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $voucher = Voucher::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($admin)
        ->put(route('admin.vouchers.update', $voucher->id), [
            'code' => $voucher->code,
            'name' => 'New Name',
            'description' => $voucher->description,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'valid_from' => $voucher->valid_from->format('Y-m-d'),
            'valid_to' => $voucher->valid_to->format('Y-m-d'),
            'is_active' => true,
        ]);

    $response->assertRedirect(route('admin.vouchers'));
    $this->assertDatabaseHas('vouchers', ['id' => $voucher->id, 'name' => 'New Name']);
});

test('regular user cannot update voucher', function () {
    $user = User::factory()->create(['role' => 'user']);
    $voucher = Voucher::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($user)
        ->put(route('admin.vouchers.update', $voucher->id), [
            'code' => $voucher->code,
            'name' => 'New Name',
            'description' => $voucher->description,
            'type' => $voucher->type,
            'value' => $voucher->value,
            'valid_from' => $voucher->valid_from->format('Y-m-d'),
            'valid_to' => $voucher->valid_to->format('Y-m-d'),
            'is_active' => true,
        ]);

    $response->assertStatus(403);
    $this->assertDatabaseHas('vouchers', ['id' => $voucher->id, 'name' => 'Old Name']);
});

test('admin can delete voucher', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $voucher = Voucher::factory()->create(['used_count' => 0]);

    $response = $this->actingAs($admin)
        ->delete(route('admin.vouchers.destroy', $voucher->id));

    $response->assertRedirect(route('admin.vouchers'));
    $this->assertDatabaseMissing('vouchers', ['id' => $voucher->id]);
});

test('regular user cannot delete voucher', function () {
    $user = User::factory()->create(['role' => 'user']);
    $voucher = Voucher::factory()->create(['used_count' => 0]);

    $response = $this->actingAs($user)
        ->delete(route('admin.vouchers.destroy', $voucher->id));

    $response->assertStatus(403);
    $this->assertDatabaseHas('vouchers', ['id' => $voucher->id]);
});
