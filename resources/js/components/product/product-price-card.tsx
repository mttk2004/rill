import { Badge } from "@/components/ui/badge";
import { Product } from "@/types";

interface ProductPriceCardProps {
  product: Product;
}

export function ProductPriceCard({ product }: ProductPriceCardProps) {
  const discountPercentage = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="p-6 bg-muted/50 rounded-lg border">
      <div className="flex items-baseline gap-3 mb-4">
        <span className="text-4xl font-bold text-accent">
          {product.price.toLocaleString('vi-VN')}₫
        </span>
        {product.compare_price && (
          <span className="text-xl text-muted-foreground line-through">
            {product.compare_price.toLocaleString('vi-VN')}₫
          </span>
        )}
      </div>
      {discountPercentage && (
        <Badge variant="destructive" className="text-sm mb-4">
          Giảm {discountPercentage}%
        </Badge>
      )}

      <div className="flex items-center gap-2">
        <div
          className={`h-3 w-3 rounded-full ${product.in_stock ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}
        />
        <span className="text-md font-medium">
          {product.in_stock ? `Còn ${product.stock_quantity} sản phẩm` : 'Hết hàng'}
          {product.low_stock && product.in_stock && (
            <span className="text-amber-600 ml-2">(Sắp hết hàng!)</span>
          )}
        </span>
      </div>
    </div>
  );
}
