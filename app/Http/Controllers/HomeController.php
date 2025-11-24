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
            ? $featuredCollection->products()->with('artists')->get()
            : Product::with('artists')
                ->active()
                ->inRandomOrder()
                ->limit(config('pagination.featured_products'))
                ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
