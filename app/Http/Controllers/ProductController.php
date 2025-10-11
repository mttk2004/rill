<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected ProductService $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display the products catalog page.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'genre', 'label', 'artist', 'sort', 'page']);

        $result = $this->productService->getProducts($filters);

        return Inertia::render('products', [
            'products' => $result['products'],
            'filters' => $result['filters'],
            'pagination' => $result['pagination'],
            // Pass filter parameters to frontend
            'search' => $filters['search'] ?? null,
            'genre' => $filters['genre'] ?? null,
            'label' => $filters['label'] ?? null,
            'artist' => $filters['artist'] ?? null,
            'sort' => $filters['sort'] ?? null,
            'page' => $filters['page'] ?? 1,
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(Product $product): Response
    {
        $product->load(['artists' => function ($query) {
            $query->orderByPivot('sort_order');
        }]);

        return Inertia::render('product-detail', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'description' => $product->description,
                'detailed_description' => $product->detailed_description,
                'price' => $product->price,
                'compare_price' => $product->compare_price,
                'stock_quantity' => $product->stock_quantity,
                'genre' => $product->genre,
                'label' => $product->label,
                'image' => $product->image,
                'is_featured' => $product->is_featured,
                'status' => $product->status,
                'artists' => $product->artists->map(function ($artist) {
                    return [
                        'id' => $artist->id,
                        'name' => $artist->name,
                        'slug' => $artist->slug,
                        'role' => $artist->pivot->role,
                        'sort_order' => $artist->pivot->sort_order,
                    ];
                }),
                'main_artists' => $product->artists->where('pivot.role', 'main')->values(),
                'featured_artists' => $product->artists->where('pivot.role', 'featured')->values(),
                'in_stock' => $product->isInStock(),
                'low_stock' => $product->isLowStock(),
            ]
        ]);
    }
}
