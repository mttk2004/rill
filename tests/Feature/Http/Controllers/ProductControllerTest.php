<?php

use App\Models\Artist;
use App\Models\Collection;
use App\Models\Product;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;

test('product index page renders successfully', function () {
    $response = get(route('products.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->has('products')
            ->has('artists')
            ->has('availableGenres')
            ->has('availableLabels')
            ->has('filters')
            ->has('pagination')
        );
});

test('product index displays active products', function () {
    Product::factory()->count(3)->create(['status' => 'active', 'stock_quantity' => 10]);
    Product::factory()->create(['status' => 'inactive']);

    $response = get(route('products.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('products.data', fn ($products) => count($products) === 3)
        );
});

test('product index can search by name', function () {
    Product::factory()->create(['name' => 'Test Album', 'status' => 'active']);
    Product::factory()->create(['name' => 'Other Album', 'status' => 'active']);

    $response = get(route('products.index', ['search' => 'Test']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.search', 'Test')
        );
});

test('product index can filter by artist', function () {
    $artist = Artist::factory()->create(['slug' => 'test-artist']);
    Product::factory()->count(2)->create(['status' => 'active']);

    $response = get(route('products.index', ['artist' => 'test-artist']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.artist', 'test-artist')
        );
});

test('product index can filter by collection', function () {
    $collection = Collection::factory()->create([
        'slug' => 'test-collection',
        'is_active' => true,
    ]);

    $response = get(route('products.index', ['collection' => 'test-collection']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.collection', 'test-collection')
            ->where('activeCollection.slug', 'test-collection')
        );
});

test('product index can filter by genre', function () {
    $response = get(route('products.index', ['genre' => 'rock']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.genre', 'rock')
        );
});

test('product index can filter by label', function () {
    $response = get(route('products.index', ['label' => 'universal']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.label', 'universal')
        );
});

test('product index can sort products', function () {
    $response = get(route('products.index', ['sort' => 'price_asc']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('filters.sort', 'price_asc')
        );
});

test('product index displays only active artists', function () {
    $activeArtist = Artist::factory()->create(['is_active' => true]);
    $inactiveArtist = Artist::factory()->create(['is_active' => false]);

    // Both artists have products
    $product1 = Product::factory()->create(['status' => 'active']);
    $product1->artists()->attach($activeArtist->id);

    $product2 = Product::factory()->create(['status' => 'active']);
    $product2->artists()->attach($inactiveArtist->id);

    $response = get(route('products.index'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('artists', function ($artists) use ($activeArtist, $inactiveArtist) {
                $artistIds = collect($artists)->pluck('id')->toArray();
                return in_array($activeArtist->id, $artistIds)
                    && !in_array($inactiveArtist->id, $artistIds);
            })
        );
});

test('product show page renders successfully', function () {
    $product = Product::factory()->create(['status' => 'active']);

    $response = get(route('products.show', $product));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductDetail')
        );
});

test('product show page displays product details', function () {
    $artist = Artist::factory()->create();
    $product = Product::factory()->create([
        'name' => 'Test Album',
        'status' => 'active',
        'price' => 250000,
    ]);
    $product->artists()->attach($artist->id);

    $response = get(route('products.show', $product));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductDetail')
            ->where('product.name', 'Test Album')
            ->where('product.price', 250000)
        );
});

test('guest can view product details', function () {
    $product = Product::factory()->create(['status' => 'active']);

    $response = get(route('products.show', $product));

    $response->assertOk();
});

test('authenticated user can view product details', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['status' => 'active']);

    $response = actingAs($user)->get(route('products.show', $product));

    $response->assertOk();
});

test('product index handles pagination', function () {
    Product::factory()->count(20)->create(['status' => 'active']);

    $response = get(route('products.index', ['page' => 2]));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->has('pagination')
        );
});

test('product index shows inactive collection as null', function () {
    $collection = Collection::factory()->create([
        'slug' => 'inactive-collection',
        'is_active' => false,
    ]);

    $response = get(route('products.index', ['collection' => 'inactive-collection']));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('ProductList')
            ->where('activeCollection', null)
        );
});
