<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        $featuredProducts = Product::with('artists')
            ->where('is_featured', true)
            ->inRandomOrder()
            ->limit(config('pagination.featured_products'))
            ->get();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
        ]);
    }
}
