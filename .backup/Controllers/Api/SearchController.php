<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Artist;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    /**
     * Get search suggestions (autocomplete)
     *
     * Returns limited results for quick suggestions:
     * - 5 products matching the query
     * - 3 artists matching the query
     */
    public function suggestions(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json([
                'products' => [],
                'artists' => []
            ]);
        }

        // Search products - limit to 5 for performance
        $products = Product::query()
            ->where('status', 'active')
            ->where(function ($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('sku', 'LIKE', "%{$query}%");
            })
            ->with('artists:id,name')
            ->limit(5)
            ->get(['id', 'name', 'slug', 'image', 'price'])
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image_url' => $product->image_url,
                    'price' => $product->price,
                    'artists' => $product->artists->pluck('name')->join(', '),
                    'type' => 'product'
                ];
            });

        // Search artists - limit to 3
        $artists = Artist::query()
            ->where('name', 'LIKE', "%{$query}%")
            ->limit(3)
            ->get(['id', 'name', 'slug', 'image'])
            ->map(function ($artist) {
                return [
                    'id' => $artist->id,
                    'name' => $artist->name,
                    'slug' => $artist->slug,
                    'image_url' => $artist->image_url,
                    'type' => 'artist'
                ];
            });

        return response()->json([
            'products' => $products,
            'artists' => $artists
        ]);
    }
}
