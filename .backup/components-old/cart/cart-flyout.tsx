import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { type FlyoutCartItem } from "@/types";
import { formatVND } from "@/lib/utils";
import { FreeShippingProgressBar } from "./free-shipping-progress-bar";

interface CartFlyoutProps {
  cartItems: FlyoutCartItem[];
  cartSummary: {
    items_count: number;
    formatted_total: string;
    total_amount: number;
  };
}

export function CartFlyout({ cartItems, cartSummary }: CartFlyoutProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold flex items-center gap-2">
        <ShoppingBag className="h-4 w-4 text-amber-500" />
        Giỏ hàng ({cartSummary.items_count})
      </h4>

      {cartItems.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-4">
          Giỏ hàng của bạn đang trống.
        </div>
      ) : (
        <>
          {/* Free Shipping Progress Bar */}
          <FreeShippingProgressBar currentAmount={cartSummary.total_amount} />

          <div className="max-h-60 overflow-y-auto space-y-3 pr-2 -mr-3">
            {cartItems.map((item: FlyoutCartItem) => (
              <div key={item.id} className="flex items-start justify-between text-xs">
                <div className="flex-grow overflow-hidden pr-4">
                  <p className="font-medium truncate">{item.product.name}</p>
                  <p className="text-muted-foreground">SL: {item.quantity}</p>
                </div>
                <span className="font-semibold">{formatVND(item.unit_price)}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span>Tổng cộng</span>
              <span className="text-amber-500">{cartSummary.formatted_total}</span>
            </div>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/cart">Đến giỏ hàng</Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
