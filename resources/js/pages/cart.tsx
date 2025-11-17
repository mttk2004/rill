import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Navigation } from "@/components/navigation";
import { ArrowLeft } from "lucide-react";
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
        <PageHeader
          title="Giỏ hàng"
          subtitle={`${cartSummary.items_count} sản phẩm đang chờ thanh toán`}
          size="md"
          actions={
            <Link href="/products">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Tiếp tục mua sắm
              </Button>
            </Link>
          }
        />

        <main className="container mx-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {cartItems.length === 0 ? (
              <div className="max-w-2xl mx-auto">
                <EmptyState
                  title="Giỏ hàng trống"
                  description="Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập vinyl tuyệt vời của chúng tôi!"
                  primaryActionLabel="Khám phá sản phẩm"
                  primaryActionHref="/products"
                />
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
