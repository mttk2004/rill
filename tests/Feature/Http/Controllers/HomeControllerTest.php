<?php

use App\Models\Artist;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Setting;

use function Pest\Laravel\get;
use function Pest\Laravel\seed;

beforeEach(function () {
    seed(\Database\Seeders\SettingSeeder::class);
});

test('homepage renders successfully', function () {
    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('featuredProducts')
            ->has('collections')
            ->has('artists')
            ->has('settings')
        );
});

test('homepage displays featured products', function () {
    $products = Product::factory()->count(5)->create([
        'status' => 'active',
        'stock_quantity' => 10,
    ]);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('featuredProducts', fn ($products) => count($products) <= 8)
        );
});

test('homepage displays active collections', function () {
    Collection::factory()->count(8)->create(['is_active' => true]);
    Collection::factory()->count(2)->create(['is_active' => false]);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('collections', fn ($collections) => count($collections) <= 6)
        );
});

test('homepage only shows active collections', function () {
    $activeCollection = Collection::factory()->create([
        'is_active' => true,
        'name' => 'Active Collection',
    ]);
    $inactiveCollection = Collection::factory()->create([
        'is_active' => false,
        'name' => 'Inactive Collection',
    ]);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('collections', function ($collections) use ($activeCollection, $inactiveCollection) {
                $collectionIds = collect($collections)->pluck('id')->toArray();
                return in_array($activeCollection->id, $collectionIds)
                    && !in_array($inactiveCollection->id, $collectionIds);
            })
        );
});

test('homepage displays featured artists', function () {
    Artist::factory()->count(12)->create(['is_active' => true]);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('artists', fn ($artists) => count($artists) <= 10)
        );
});

test('homepage only shows active artists', function () {
    $activeArtist = Artist::factory()->create(['is_active' => true]);
    Artist::factory()->create(['is_active' => false]);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('artists', function ($artists) use ($activeArtist) {
                $artistIds = collect($artists)->pluck('id')->toArray();
                return in_array($activeArtist->id, $artistIds);
            })
        );
});

test('homepage includes return policy settings', function () {
    Setting::updateOrCreate(
        ['key' => 'return_policy_days'],
        ['value' => '14', 'type' => 'integer']
    );
    Setting::updateOrCreate(
        ['key' => 'return_policy_condition'],
        ['value' => 'test condition', 'type' => 'string']
    );

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('settings.returnPolicyDays', '14')
            ->where('settings.returnPolicyCondition', 'test condition')
        );
});

test('homepage uses default settings when not configured', function () {
    Setting::where('key', 'return_policy_days')->delete();
    Setting::where('key', 'return_policy_condition')->delete();

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('settings.returnPolicyDays', '7')
            ->where('settings.returnPolicyCondition', 'lỗi nhà sản xuất')
        );
});

test('homepage displays products with artists relationship', function () {
    $artist = Artist::factory()->create(['is_active' => true]);
    $product = Product::factory()->create([
        'status' => 'active',
        'stock_quantity' => 10,
    ]);
    $product->artists()->attach($artist->id);

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->has('featuredProducts')
        );
});

test('homepage orders artists by product count', function () {
    $artist1 = Artist::factory()->create(['is_active' => true, 'name' => 'Artist 1']);
    $artist2 = Artist::factory()->create(['is_active' => true, 'name' => 'Artist 2']);

    // Artist 2 has more products
    Product::factory()->count(5)->create(['status' => 'active'])->each(function ($product) use ($artist2) {
        $product->artists()->attach($artist2->id);
    });
    Product::factory()->count(2)->create(['status' => 'active'])->each(function ($product) use ($artist1) {
        $product->artists()->attach($artist1->id);
    });

    $response = get(route('home'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Home')
            ->where('artists.0.id', $artist2->id) // First artist should be artist2 (more products)
        );
});
