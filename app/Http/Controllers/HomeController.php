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
        // Get 8 best-selling products based on order items
        $featuredProducts = Product::query()
            ->with('artists')
            ->where('status', 'active')
            ->withCount(['orderItems as total_sold' => function ($query) {
                $query->selectRaw('COALESCE(SUM(quantity), 0)');
            }])
            ->orderBy('total_sold', 'desc')
            ->take(8)
            ->get();

        // Get active collections for display
        $collections = Collection::active()
            ->orderBy('name')
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
        ]);
    }
}
