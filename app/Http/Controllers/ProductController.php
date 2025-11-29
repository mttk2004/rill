<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\CartService;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    protected ProductService $productService;
    protected CartService $cartService;

    public function __construct(ProductService $productService, CartService $cartService)
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

        $result = $this->productService->getProducts($filters);

        return Inertia::render('ProductList', [
            'products' => $result['products'],
            'filters' => $result['filters'],
            'pagination' => $result['pagination'],
            // Pass filter parameters to frontend
            'search' => $filters['search'] ?? null,
            'genre' => $filters['genre'] ?? null,
            'label' => $filters['label'] ?? null,
            'artist' => $filters['artist'] ?? null,
            'collection' => $filters['collection'] ?? null,
            'sort' => $filters['sort'] ?? null,
            'page' => $filters['page'] ?? 1,
        ]);
    }

    /**
     * Display a single product detail page.
     */
    public function show(Product $product): Response
    {
        $data = $this->productService->getDataForShowPage($product, auth()->user());

        return Inertia::render('ProductDetail', $data);
    }
}
