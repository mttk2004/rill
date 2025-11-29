import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";
import { formatVND } from "@/lib/utils";

interface ProductPriceCardProps {
  product: Product;
}

export function ProductPriceCard({ product }: ProductPriceCardProps) {
  return (
    <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-accent">
          {formatVND(product.price)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`h-2.5 w-2.5 rounded-full ${product.in_stock ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
        />
        <span className="text-sm font-medium">
          {product.in_stock ? `Còn ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
          {product.low_stock && product.in_stock && (
            <span className="text-amber-600 ml-1 text-xs">(Sắp hết!)</span>
          )}
        </span>
      </div>
    </div>
  );
}
