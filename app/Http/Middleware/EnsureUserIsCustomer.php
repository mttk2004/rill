<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsCustomer
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user()) {
            return redirect()->route('login')->with('error', 'Vui lòng đăng nhập để tiếp tục.');
        }

        // If user is admin, redirect to admin dashboard
        if ($request->user()->isAdmin()) {
            return redirect()->route('admin.dashboard')->with('info', 'Trang này dành cho khách hàng. Bạn đã được chuyển về trang quản trị.');
        }

        // If user is not a customer
        if ($request->user()->role !== 'customer') {
            return redirect()->route('products.index')->with('error', 'Bạn không có quyền truy cập trang này.');
        }

        return $next($request);
    }
}
