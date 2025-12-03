<?php

use App\Models\Setting;
use App\Models\User;
use App\Services\SettingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('admin can view settings page', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get(route('admin.settings.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/Settings')
            ->has('settings')
        );
});

test('admin can update settings with valid data', function () {
    $admin = User::factory()->admin()->create();
    // Create some settings first
    Setting::factory()->create([
        'key' => 'banner_enabled',
        'value' => '0',
        'group' => 'general',
    ]);

    Setting::factory()->create([
        'key' => 'banner_content',
        'value' => 'Old content',
        'group' => 'general',
    ]);

    $validData = [
        'settings' => [
            'banner_enabled' => '1',
            'banner_content' => 'New banner content',
            'banner_type' => 'info',
            'shipping_free_threshold' => 1000000,
            'shipping_estimate_min_days' => 3,
            'shipping_estimate_max_days' => 5,
            'return_policy_days' => 7,
            'return_policy_condition' => 'Product must be unused',
        ],
    ];

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), $validData)
        ->assertRedirect()
        ->assertSessionHas('success', 'Cài đặt đã được cập nhật thành công!');
});

test('settings update fails with invalid banner_enabled value', function () {
    $admin = User::factory()->admin()->create();

    $invalidData = [
        'settings' => [
            'banner_enabled' => '5', // Invalid: must be 0 or 1
            'banner_content' => 'Test content',
            'banner_type' => 'info',
            'shipping_free_threshold' => 1000000,
            'shipping_estimate_min_days' => 3,
            'shipping_estimate_max_days' => 5,
            'return_policy_days' => 7,
            'return_policy_condition' => 'Product must be unused',
        ],
    ];

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), $invalidData)
        ->assertSessionHasErrors('settings.banner_enabled');
});

test('settings update fails with invalid banner_type', function () {
    $admin = User::factory()->admin()->create();

    $invalidData = [
        'settings' => [
            'banner_enabled' => '1',
            'banner_content' => 'Test content',
            'banner_type' => 'invalid_type', // Invalid: must be info, success, or warning
            'shipping_free_threshold' => 1000000,
            'shipping_estimate_min_days' => 3,
            'shipping_estimate_max_days' => 5,
            'return_policy_days' => 7,
            'return_policy_condition' => 'Product must be unused',
        ],
    ];

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), $invalidData)
        ->assertSessionHasErrors('settings.banner_type');
});

test('settings update fails when max days less than min days', function () {
    $admin = User::factory()->admin()->create();

    $invalidData = [
        'settings' => [
            'banner_enabled' => '1',
            'banner_content' => 'Test content',
            'banner_type' => 'info',
            'shipping_free_threshold' => 1000000,
            'shipping_estimate_min_days' => 5,
            'shipping_estimate_max_days' => 3, // Invalid: max < min
            'return_policy_days' => 7,
            'return_policy_condition' => 'Product must be unused',
        ],
    ];

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), $invalidData)
        ->assertSessionHasErrors('settings.shipping_estimate_max_days');
});

test('settings update fails with empty banner content', function () {
    $admin = User::factory()->admin()->create();

    $invalidData = [
        'settings' => [
            'banner_enabled' => '1',
            'banner_content' => '', // Invalid: required
            'banner_type' => 'info',
            'shipping_free_threshold' => 1000000,
            'shipping_estimate_min_days' => 3,
            'shipping_estimate_max_days' => 5,
            'return_policy_days' => 7,
            'return_policy_condition' => 'Product must be unused',
        ],
    ];

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), $invalidData)
        ->assertSessionHasErrors('settings.banner_content');
});

test('non-admin cannot access settings', function () {
    $user = User::factory()->customer()->create();

    $this->actingAs($user)
        ->get(route('admin.settings.index'))
        ->assertForbidden();
});

test('guest cannot access settings', function () {
    $this->get(route('admin.settings.index'))
        ->assertRedirect(route('login'));
});
