import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Minus, Plus, Trash2, ShoppingCart, Heart, ArrowLeft, Disc3, Loader2 } from "lucide-react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface CartItem {
  id: number;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    image_url: string | null;
    stock_quantity: number;
    is_featured: boolean;
    status: string;
    artists: Array<{
      id: string;
      name: string;
      slug: string;
    }>;
  };
}

interface CartSummary {
  total_items: number;
  total_amount: number;
  items_count: number;
  formatted_total: string;
}

interface CartPageProps extends SharedData {
  cartItems: CartItem[];
  cartSummary: CartSummary;
}

export default function Cart() {
  const pageProps = usePage<CartPageProps>().props;
  const { auth, cartItems, cartSummary } = pageProps;
  const [isUpdating, setIsUpdating] = useState<number | null>(null);

  const shipping = cartSummary.total_amount >= 1000000 ? 0 : 50000;
  const total = cartSummary.total_amount + shipping;

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setIsUpdating(cartItemId);

    router.put(`/cart/${cartItemId}`, { quantity: newQuantity }, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setIsUpdating(null);
      },
      onSuccess: () => {
        toast.success('Đã cập nhật số lượng!');
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể cập nhật số lượng';
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi cập nhật số lượng');
      }
    });
  };

  const removeItem = async (cartItemId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }

    setIsUpdating(cartItemId);

    router.delete(`/cart/${cartItemId}`, {
      preserveScroll: true,
      preserveState: true,
      onFinish: () => {
        setIsUpdating(null);
      },
      onSuccess: () => {
        toast.success('Đã xóa sản phẩm!');
        router.reload();
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể xóa sản phẩm';
        toast.error(typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi xóa sản phẩm');
      }
    });
  };

  return (
    <>
      <Head title="Giỏ hàng - Rill" />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Navigation user={auth.user} />

        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

          {/* Floating Vinyl Records */}
          <div className="absolute top-10 left-10 animate-spin-slow">
            <Disc3 className="h-20 w-20 text-amber-500/10" />
          </div>
          <div className="absolute top-20 right-10 animate-spin-reverse">
            <Disc3 className="h-16 w-16 text-amber-500/5" />
          </div>

          <div className="relative container mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/products">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  Giỏ hàng
                </h1>
                <p className="text-sm text-slate-200 drop-shadow">{cartSummary.items_count} sản phẩm đang chờ thanh toán</p>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">{cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="mb-8">
                  <ShoppingCart className="h-24 w-24 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Giỏ hàng trống</h2>
                  <p className="text-slate-600 dark:text-slate-300">
                    Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập vinyl tuyệt vời của chúng tôi!
                  </p>
                </div>
                <Link href="/products">
                  <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3">
                    Khám phá sản phẩm
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Cart Items List (2/3) */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                    <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                      Sản phẩm ({cartSummary.total_items})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                      {cartItems.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative flex-shrink-0">
                              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-md overflow-hidden">
                                {item.product.image_url ? (
                                  <img
                                    src={item.product.image_url}
                                    alt={item.product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Disc3 className="h-12 w-12 text-amber-500" />
                                )}
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <Link href={`/products/${item.product.slug}`}>
                                    <h3 className="font-semibold text-base text-slate-900 dark:text-white hover:text-amber-600 transition-colors line-clamp-1">
                                      {item.product.name}
                                    </h3>
                                  </Link>
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                                    {item.product.artists.map(artist => artist.name).join(', ')}
                                  </p>

                                  {/* Mobile: Price & Quantity */}
                                  <div className="flex items-center gap-4 mt-3 md:hidden">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={isUpdating === item.id || item.quantity <= 1}
                                      >
                                        {isUpdating === item.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Minus className="h-3 w-3" />
                                        )}
                                      </Button>
                                      <span className="w-10 text-center font-semibold text-sm">
                                        {item.quantity}
                                      </span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        disabled={isUpdating === item.id || item.quantity >= item.product.stock_quantity}
                                      >
                                        {isUpdating === item.id ? (
                                          <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                          <Plus className="h-3 w-3" />
                                        )}
                                      </Button>
                                    </div>
                                    <div className="flex-1 text-right">
                                      <p className="text-lg font-bold text-amber-600">
                                        {item.total_price.toLocaleString('vi-VN')}₫
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {item.unit_price.toLocaleString('vi-VN')}₫/cái
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Desktop: Delete Button */}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                                  onClick={() => removeItem(item.id)}
                                  disabled={isUpdating === item.id}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>

                              {/* Desktop: Quantity & Price Row */}
                              <div className="hidden md:flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-slate-600 dark:text-slate-400">Số lượng:</span>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                      disabled={isUpdating === item.id || item.quantity <= 1}
                                    >
                                      {isUpdating === item.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Minus className="h-3 w-3" />
                                      )}
                                    </Button>
                                    <span className="w-12 text-center font-semibold">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      disabled={isUpdating === item.id || item.quantity >= item.product.stock_quantity}
                                    >
                                      {isUpdating === item.id ? (
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Plus className="h-3 w-3" />
                                      )}
                                    </Button>
                                  </div>
                                  <span className="text-xs text-slate-500">
                                    (Còn {item.product.stock_quantity} sản phẩm)
                                  </span>
                                </div>

                                <div className="text-right">
                                  <p className="text-xl font-bold text-amber-600">
                                    {item.total_price.toLocaleString('vi-VN')}₫
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    {item.unit_price.toLocaleString('vi-VN')}₫ × {item.quantity}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Sidebar (1/3) - Sticky */}
              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">{/* Order Summary */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
                      <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <ShoppingCart className="h-5 w-5 text-amber-500" />
                        Tóm tắt đơn hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Tạm tính ({cartSummary.total_items} sản phẩm)</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{cartSummary.total_amount.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-300">Phí vận chuyển</span>
                        <span className="font-semibold text-green-600">Miễn phí</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span className="text-slate-900 dark:text-white">Tổng cộng</span>
                        <span className="text-amber-600">{cartSummary.total_amount.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <Button
                        onClick={() => router.get('/checkout')}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                        size="lg"
                      >
                        Tiến hành thanh toán
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Discount Code */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base text-slate-900 dark:text-white">Mã giảm giá</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-amber-200 text-amber-600 hover:bg-amber-50"
                        >
                          Áp dụng
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Shipping Info - Compact */}
                  <Card className="border-0 shadow-lg">
                    <CardContent className="space-y-2 p-4">
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-green-600">✓</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫
                        </p>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-blue-600">✓</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          Giao hàng trong 3-5 ngày làm việc
                        </p>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <span className="text-amber-600">✓</span>
                        <p className="text-slate-600 dark:text-slate-300">
                          Đổi trả miễn phí trong 30 ngày
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </>
  );
}
