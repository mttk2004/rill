import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Navigation } from "@/components/navigation";
import { Minus, Plus, Trash2, ShoppingCart, Heart, ArrowLeft, Disc3, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Link, Head, usePage, router } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { useState, useEffect } from 'react';

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
  const pageProps = usePage<CartPageProps & { flash?: { message?: string } }>().props;
  const { auth, cartItems, cartSummary } = pageProps;
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const shipping = cartSummary.total_amount >= 1000000 ? 0 : 50000;
  const total = cartSummary.total_amount + shipping;

  // Handle flash messages from Laravel and auto-hide after 3 seconds
  useEffect(() => {
    if (pageProps.flash?.message) {
      setMessage({ type: 'success', text: pageProps.flash.message });
      setIsUpdating(null); // Reset loading state
    }
  }, [pageProps.flash]);

  // Auto-hide messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setIsUpdating(cartItemId);
    setMessage(null);

    router.put(`/cart/${cartItemId}`, { quantity: newQuantity }, {
      onFinish: () => {
        setIsUpdating(null);
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể cập nhật số lượng';
        setMessage({ type: 'error', text: typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi cập nhật số lượng' });
      }
    });
  };

  const removeItem = async (cartItemId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      return;
    }

    setIsUpdating(cartItemId);
    setMessage(null);

    router.delete(`/cart/${cartItemId}`, {
      onFinish: () => {
        setIsUpdating(null);
      },
      onError: (errors) => {
        const errorMessage = errors.message || Object.values(errors)[0] || 'Không thể xóa sản phẩm';
        setMessage({ type: 'error', text: typeof errorMessage === 'string' ? errorMessage : 'Có lỗi xảy ra khi xóa sản phẩm' });
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

          <div className="relative container mx-auto px-4 py-12">
            <div className="flex items-center gap-4 mb-6">
              <Link href="/products">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Tiếp tục mua sắm
                </Button>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg">
                    <ShoppingCart className="h-8 w-8" />
                  </div>
                  Giỏ hàng
                </h1>
                <p className="text-slate-200 drop-shadow">{cartSummary.items_count} sản phẩm đang chờ thanh toán</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl shadow-lg border transition-all duration-300 transform ${
            message.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">{message.text}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMessage(null)}
                className="ml-auto h-6 w-6 p-0 hover:bg-transparent"
              >
                ×
              </Button>
            </div>
          </div>
        )}

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {cartItems.length === 0 ? (
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                {cartItems.map((item) => (
                  <Card key={item.id} className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex gap-6">
                        {/* Vinyl Record Image */}
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                            {item.product.image_url ? (
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <Disc3 className="h-16 w-16 text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
                            )}
                          </div>
                          {/* Vinyl Label */}
                          {!item.product.image_url && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full shadow-md"></div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <Link href={`/products/${item.product.slug}`}>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate group-hover:text-amber-600 transition-colors hover:text-amber-600">
                                  {item.product.name}
                                </h3>
                              </Link>
                              <p className="text-slate-600 dark:text-slate-300 font-medium">
                                {item.product.artists.map(artist => artist.name).join(', ')}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className={`${
                                  item.product.status === 'active'
                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
                                    : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                }`}>
                                  {item.product.status === 'active' ? 'Còn hàng' : 'Hết hàng'}
                                </Badge>
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                                  Vinyl LP
                                </Badge>
                                {item.product.is_featured && (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800">
                                    Nổi bật
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Heart className="h-5 w-5" />
                            </Button>
                          </div>

                          <div className="flex justify-between items-center mt-6">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-amber-50 hover:border-amber-200 transition-all duration-200"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={isUpdating === item.id || item.quantity <= 1}
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Minus className="h-4 w-4" />
                                )}
                              </Button>
                              <div className="relative">
                                <span className="w-12 text-center font-semibold text-slate-900 dark:text-white block">
                                  {item.quantity}
                                </span>
                                {isUpdating === item.id && (
                                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 rounded flex items-center justify-center">
                                    <Loader2 className="h-3 w-3 animate-spin text-amber-600" />
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-amber-50 hover:border-amber-200 transition-all duration-200"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={isUpdating === item.id || item.quantity >= item.product.stock_quantity}
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Plus className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-xl font-bold text-amber-600">
                                {item.total_price.toLocaleString('vi-VN')}₫
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                  {item.unit_price.toLocaleString('vi-VN')}₫ / cái
                                </p>
                              )}
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              className="px-3 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 min-w-[80px]"
                              onClick={() => removeItem(item.id)}
                              disabled={isUpdating === item.id}
                            >
                              {isUpdating === item.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Removing
                                </>
                              ) : (
                                <>
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Order Summary */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Tóm tắt đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600 dark:text-slate-300">Tạm tính ({cartSummary.total_items} sản phẩm)</span>
                      <span className="font-semibold text-slate-900 dark:text-white">{cartSummary.total_amount.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-600 dark:text-slate-300">Phí vận chuyển</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {shipping === 0 ? 'Miễn phí' : `${shipping.toLocaleString('vi-VN')}₫`}
                      </span>
                    </div>
                    <Separator className="border-slate-200 dark:border-slate-600" />
                    <div className="flex justify-between text-lg font-bold py-2">
                      <span className="text-slate-900 dark:text-white">Tổng cộng</span>
                      <span className="text-amber-600">{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" size="lg">
                      Tiến hành thanh toán
                    </Button>
                  </CardContent>
                </Card>

                {/* Discount Code */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="text-slate-900 dark:text-white">Mã giảm giá</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nhập mã giảm giá"
                        className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                      />
                      <Button
                        variant="outline"
                        className="border-amber-200 text-amber-600 hover:bg-amber-50 hover:border-amber-300"
                      >
                        Áp dụng
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-lg">
                    <CardTitle className="text-slate-900 dark:text-white">Thông tin vận chuyển</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6">
                    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🚚</span>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                        Miễn phí vận chuyển cho đơn hàng trên 1.000.000₫
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">📦</span>
                      </div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        Giao hàng trong 3-5 ngày làm việc
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🔄</span>
                      </div>
                      <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                        Đổi trả miễn phí trong 30 ngày
                      </p>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
