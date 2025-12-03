<?php

namespace App\Http\Middleware;

use App\Services\CartServiceRefactored;
use App\Services\SettingService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'info' => $request->session()->get('info'),
                'warning' => $request->session()->get('warning'),
            ],
            'cart' => function () use ($request) {
                $cartService = app(CartServiceRefactored::class);
                $userId = $request->user()?->id;
                $sessionId = $request->session()->getId();

                return [
                    'summary' => $cartService->getCartSummary($userId, $sessionId),
                    'items' => $cartService->getCartItems($userId, $sessionId)->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'slug' => $item->product->slug,
                                'image_urlc' => $item->product->image_url,
                            ],
                        ];
                    }),
                ];
            },
            'settings' => function () {
                $settingService = app(SettingService::class);
                return [
                    'banner' => [
                        'enabled' => $settingService->get('banner_enabled', false),
                        'content' => $settingService->get('banner_content', ''),
                        'type' => $settingService->get('banner_type', 'info'),
                    ],
                    'shipping' => [
                        'free_threshold' => $settingService->get('shipping_free_threshold', 1000000),
                        'estimate_min_days' => $settingService->get('shipping_estimate_min_days', 2),
                        'estimate_max_days' => $settingService->get('shipping_estimate_max_days', 5),
                    ],
                    'policy' => [
                        'return_days' => $settingService->get('return_policy_days', 7),
                        'return_condition' => $settingService->get('return_policy_condition', 'lỗi nhà sản xuất'),
                    ],
                ];
            },
            'collections' => function () {
                return \App\Models\Collection::active()
                    ->orderBy('name')
                    ->take(10)
                    ->get(['id', 'name', 'slug', 'type']);
            },
            'menuData' => function () {
                // Get unique genres and labels from active products
                $genres = \App\Models\Product::query()
                    ->where('status', 'active')
                    ->whereNotNull('genre')
                    ->distinct()
                    ->pluck('genre')
                    ->sort()
                    ->values();

                $labels = \App\Models\Product::query()
                    ->where('status', 'active')
                    ->whereNotNull('label')
                    ->distinct()
                    ->pluck('label')
                    ->sort()
                    ->values();

                // Get all active artists sorted by product count
                $artists = \App\Models\Artist::active()
                    ->withCount('products')
                    ->orderBy('products_count', 'desc')
                    ->get(['id', 'name', 'slug', 'image']);

                return [
                    'genres' => $genres,
                    'labels' => $labels,
                    'artists' => $artists,
                ];
            },
        ];
    }
}
