<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Get products from the active featured collection
        $featuredCollection = Collection::featured()
            ->active()
            ->ordered()
            ->first();

        $featuredProducts = $featuredCollection
            ? $featuredCollection->products()->with('artists')->get()->map(function ($product) use ($featuredCollection) {
                // Attach collection info to each product
                $product->collection = [
                    'id' => $featuredCollection->id,
                    'name' => $featuredCollection->name,
                    'type' => $featuredCollection->type,
                ];
                return $product;
            })
            : Product::with('artists')
                ->active()
                ->inRandomOrder()
                ->limit(config('pagination.featured_products'))
                ->get();

        // Get active collections for display
        $collections = Collection::active()
            ->ordered()
            ->take(6)
            ->get(['id', 'name', 'slug', 'type', 'description']);

        // Get featured artists
        $artists = \App\Models\Artist::active()
            ->withCount('products')
            ->orderBy('products_count', 'desc')
            ->take(10)
            ->get(['id', 'name', 'slug', 'image', 'country']);

        return Inertia::render('Home', [
            'featuredProducts' => $featuredProducts,
            'collections' => $collections,
            'artists' => $artists,
            'featuredCollection' => $featuredCollection ? [
                'id' => $featuredCollection->id,
                'name' => $featuredCollection->name,
                'type' => $featuredCollection->type,
                'description' => $featuredCollection->description,
            ] : null,
        ]);
    }
}
