<?php

use App\Models\User;
use App\Services\GHNService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;

uses(RefreshDatabase::class);

test('can get all provinces', function () {
    $mockService = Mockery::mock(GHNService::class);
    $mockService->shouldReceive('getProvinces')
        ->once()
        ->andReturn([
            ['ProvinceID' => 1, 'ProvinceName' => 'Hà Nội'],
            ['ProvinceID' => 2, 'ProvinceName' => 'TP. Hồ Chí Minh'],
        ]);

    $this->app->instance(GHNService::class, $mockService);

    $response = $this->getJson(route('api.provinces'));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [
                ['ProvinceID' => 201, 'ProvinceName' => 'Hà Nội'],
                ['ProvinceID' => 202, 'ProvinceName' => 'Hồ Chí Minh'],
            ],
        ]);
});

test('can get districts by province_id', function () {
    $mockService = Mockery::mock(GHNService::class);
    $mockService->shouldReceive('getDistricts')
        ->with(1)
        ->once()
        ->andReturn([
            ['DistrictID' => 1, 'DistrictName' => 'Ba Đình'],
            ['DistrictID' => 2, 'DistrictName' => 'Hoàn Kiếm'],
        ]);

    $this->app->instance(GHNService::class, $mockService);

    $response = $this->getJson(route('api.districts', ['province_id' => 1]));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [
                ['DistrictID' => 1482, 'DistrictName' => 'Hoàn Kiếm'],
                ['DistrictID' => 1483, 'DistrictName' => 'Ba Đình'],
            ],
        ]);
});

test('get districts fails without province_id', function () {
    $response = $this->getJson(route('api.districts'));

    $response->assertStatus(422)
        ->assertJsonValidationErrors('province_id');
});

test('get districts fails with invalid province_id type', function () {
    $response = $this->getJson(route('api.districts', ['province_id' => 'invalid']));

    $response->assertStatus(422)
        ->assertJsonValidationErrors('province_id');
});

test('can get wards by district_id', function () {
    $mockService = Mockery::mock(GHNService::class);
    $mockService->shouldReceive('getWards')
        ->with(1)
        ->once()
        ->andReturn([
            ['WardCode' => '00001', 'WardName' => 'Phường Phúc Xá'],
            ['WardCode' => '00002', 'WardName' => 'Phường Trúc Bạch'],
        ]);

    $this->app->instance(GHNService::class, $mockService);

    $response = $this->getJson(route('api.wards', ['district_id' => 1]));

    $response->assertOk()
        ->assertJson([
            'success' => true,
            'data' => [
                ['WardCode' => '1A0101', 'WardName' => 'Phường Phúc Tân'],
                ['WardCode' => '1A0102', 'WardName' => 'Phường Đồng Xuân'],
            ],
        ]);
});

test('get wards fails without district_id', function () {
    $response = $this->getJson(route('api.wards'));

    $response->assertStatus(422)
        ->assertJsonValidationErrors('district_id');
});

test('get wards fails with invalid district_id type', function () {
    $response = $this->getJson(route('api.wards', ['district_id' => 'invalid']));

    $response->assertStatus(422)
        ->assertJsonValidationErrors('district_id');
});
