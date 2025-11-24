<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        // Temporarily show random products - will be replaced with collections system
        $featuredProducts = Product::with('artists')
            ->active()
            ->inRandomOrder()
            ->limit(config('pagination.featured_products'))
            ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
