<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartServiceRefactored;
use App\Services\ProductServiceRefactored;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected ProductServiceRefactored $productService;
    protected CartServiceRefactored $cartService;

    public function __construct(ProductServiceRefactored $productService, CartServiceRefactored $cartService)
    {
        $this->productService = $productService;
        $this->cartService = $cartService;
    }

    /**
     * Display the products catalog page.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'genre', 'label', 'artist', 'collection', 'sort', 'page']);

        $serviceResult = $this->productService->getProducts($filters);

        if (!$serviceResult->success) {
            abort(500, $serviceResult->message);
        }

        $result = $serviceResult->data;

        // Get active collection if filter is set
        $activeCollection = null;
        if (!empty($filters['collection'])) {
            $activeCollection = \App\Models\Collection::where('slug', $filters['collection'])
                ->where('is_active', true)
                ->first(['id', 'name', 'slug', 'type', 'description']);
        }

        $artists = \App\Models\Artist::active()
            ->whereHas('products', function ($query) {
                $query->where('status', 'active');
            })
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'image']);

        return Inertia::render('ProductList', [
            'products' => $result['products'],
            'artists' => $artists,
            'availableGenres' => $result['filters']['genres'] ?? [],
            'availableLabels' => $result['filters']['labels'] ?? [],
            'activeCollection' => $activeCollection,
            'filters' => [
                'search' => $filters['search'] ?? null,
                'genre' => $filters['genre'] ?? null,
                'label' => $filters['label'] ?? null,
                'artist' => $filters['artist'] ?? null,
                'collection' => $filters['collection'] ?? null,
                'sort' => $filters['sort'] ?? null,
            ],
            'pagination' => $result['pagination'],
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(Product $product): Response
    {
        $serviceResult = $this->productService->getDataForShowPage($product, auth()->user());

        if (!$serviceResult->success) {
            abort(500, $serviceResult->message);
        }

        return Inertia::render('ProductDetail', $serviceResult->data);
    }
}
