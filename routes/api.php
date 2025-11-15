<?php

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AddressDataController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Category routes for header menu
Route::get('/categories/menu-data', [CategoryController::class, 'getMenuData'])->name('api.categories.menu');

// Address data routes (provinces, districts, wards)
Route::get('/provinces', [AddressDataController::class, 'getProvinces'])->name('api.provinces');
Route::get('/districts', [AddressDataController::class, 'getDistricts'])->name('api.districts');
Route::get('/wards', [AddressDataController::class, 'getWards'])->name('api.wards');
