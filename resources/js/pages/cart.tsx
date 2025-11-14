import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { ShoppingCart, ArrowLeft, Disc3 } from "lucide-react";
import { Link, Head, usePage } from "@inertiajs/react";
import { type SharedData } from '@/types';
import { CartItemDesktop } from "@/components/cart/cart-item-desktop";
import { CartItemMobile } from "@/components/cart/cart-item-mobile";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCartOperations } from "@/hooks/use-cart-operations";

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
  const { isUpdating, updateQuantity, removeItem } = useCartOperations();

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
                        <div key={item.id}>
                          {/* Desktop View */}
                          <div className="hidden md:block">
                            <CartItemDesktop
                              item={item}
                              isUpdating={isUpdating === item.id}
                              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                              onRemove={() => removeItem(item.id)}
                            />
                          </div>
                          {/* Mobile View */}
                          <div className="md:hidden">
                            <CartItemMobile
                              item={item}
                              isUpdating={isUpdating === item.id}
                              onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                              onRemove={() => removeItem(item.id)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Sidebar (1/3) - Sticky */}
              <div className="lg:col-span-1">
                <CartSummary cartSummary={cartSummary} />
              </div>
            </div>
          )}
          </div>
        </main>
      </div>
    </>
  );
}
