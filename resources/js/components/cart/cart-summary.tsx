import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { formatVND } from '@/lib/utils';
import { FreeShippingProgressBar } from './free-shipping-progress-bar';

interface CartSummarySettings {
  shipping: {
    free_threshold: number;
    estimate_min_days: number;
    estimate_max_days: number;
  };
  policy: {
    return_days: number;
  };
}

interface CartSummaryProps {
  cartSummary: {
    total_items: number;
    total_amount: number;
    items_count: number;
  };
}

export function CartSummary({ cartSummary }: CartSummaryProps) {
  const { settings } = usePage<{ settings: CartSummarySettings }>().props;

  return (
    <div className="sticky top-4 space-y-4">
      {/* Order Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700">
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            Tóm tắt đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Free Shipping Progress Bar */}
          <FreeShippingProgressBar currentAmount={cartSummary.total_amount} />

          <Separator />

          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Tạm tính ({cartSummary.total_items} sản phẩm)</span>
            <span className="font-semibold text-slate-900 dark:text-white">{formatVND(cartSummary.total_amount)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span className="text-slate-900 dark:text-white">Tổng cộng</span>
            <span className="text-amber-600">{formatVND(cartSummary.total_amount)}</span>
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

      {/* Shipping Info - Compact */}
      <Card className="border-0 shadow-lg">
        <CardContent className="space-y-2 p-4">
          <div className="flex items-start gap-2 text-xs">
            <span className="text-green-600">✓</span>
            <p className="text-slate-600 dark:text-slate-300">
              Miễn phí vận chuyển cho đơn hàng trên {settings.shipping.free_threshold.toLocaleString('vi-VN')}₫
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-blue-600">✓</span>
            <p className="text-slate-600 dark:text-slate-300">
              Giao hàng trong {settings.shipping.estimate_min_days}-{settings.shipping.estimate_max_days} ngày làm việc
            </p>
          </div>
          <div className="flex items-start gap-2 text-xs">
            <span className="text-amber-600">✓</span>
            <p className="text-slate-600 dark:text-slate-300">
              Đổi trả miễn phí trong {settings.policy.return_days} ngày
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
